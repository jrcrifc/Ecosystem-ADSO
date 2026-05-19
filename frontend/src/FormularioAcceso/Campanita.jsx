import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import socket from "../socket.js"; // ✅ Usar socket centralizado
import Swal from "sweetalert2";

export default function Campanita({ userData, onAprobado, userRol }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [verTodas, setVerTodas] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  const noLeidas = notificaciones.filter(n => !n.leida).length;
  const esAdmin = userRol === 'Administrador';

  useEffect(() => {
    if (!id_usuario) return;

    cargar();

    // ✅ Unirse a sala privada
    if (socket.connected) {
      socket.emit("join", id_usuario);
    } else {
      socket.on("connect", () => {
        socket.emit("join", id_usuario);
      });
    }

    const handleNotification = (nueva) => {
      console.log("📥 Notificación recibida en tiempo real:", nueva);
      setNotificaciones(prev => [nueva, ...prev]);
      
      // ✅ Si el admin está conectado, mostrar aviso inmediato tipo Toast
      if (esAdmin && nueva.tipo === 'solicitud_acceso') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: '👤 Nuevo registro',
          text: nueva.mensaje,
          showConfirmButton: true,
          confirmButtonText: 'Ver',
          timer: 10000,
          timerProgressBar: true
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/gestion-usuarios');
          }
        });
      }

      // ✅ Si hay notificación de aprobado, avisar al App
      if (nueva.tipo === 'aprobado' && onAprobado && userRol !== 'Administrador') {
        onAprobado();
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [id_usuario]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const cargar = async () => {
    try {
      const res = await apiAxios.get(`/api/notificaciones/${id_usuario}`);
      let nuevas = res.data;

      const hayAprobacion = nuevas.some(n => n.tipo === 'aprobado' && !n.leida);
      if (hayAprobacion && onAprobado && userRol !== 'Administrador') {
        onAprobado();
      }

      // ✅ Inyectar notificaciones virtuales de reactivos por vencer
      if (['Administrador', 'Gestor', 'Cuentadante', 'Pasante'].includes(userRol)) {
        try {
          const statsRes = await apiAxios.get('/api/dashboard/stats');
          const venc = statsRes.data.vencimientos || [];
          const virtualNotifs = venc.map(v => ({
            id_notificacion: `venc-${v.id_movimiento_reactivo}`,
            tipo: 'vencimiento_reactivo',
            titulo: '⚠️ Reactivo por vencer',
            mensaje: `El reactivo ${v.reactivo?.nom_reactivo} (Lote: ${v.lote || 'N/A'}) vence el ${new Date(v.fecha_vencimiento).toLocaleDateString()}.`,
            leida: false,
            createdAt: new Date().toISOString()
          }));
          nuevas = [...virtualNotifs, ...nuevas];
        } catch (e) {
          console.error("Error cargando stats en notificaciones", e);
        }
      }

      // ✅ Guardar todas las notificaciones
      setNotificaciones(nuevas);
    } catch { }
  };

  const marcarTodas = async () => {
    try {
      await apiAxios.put(`/api/notificaciones/${id_usuario}/todas-leidas`);
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch { }
  };

  const handleNotificacionClick = async (n) => {
    // Marcar como leída
    if (!n.leida) {
      try {
        await apiAxios.put(`/api/notificaciones/${n.id_notificacion}/leida`);
        setNotificaciones(prev => prev.map(x =>
          x.id_notificacion === n.id_notificacion ? { ...x, leida: true } : x
        ));
      } catch { }
    }

    // ✅ Redirigir según tipo de notificación
    if (esAdmin && n.tipo === 'solicitud_acceso') {
      setOpen(false);
      navigate('/gestion-usuarios');
    } else if (n.tipo === 'nueva_solicitud') {
      setOpen(false);
      navigate(esAdmin ? '/gestion-solicitudes' : '/solicitud');
    } else if (n.tipo === 'cambio_estado_solicitud') {
      setOpen(false);
      navigate('/solicitud');
    } else if (n.tipo === 'aprobado') {
      setOpen(false);
      navigate('/perfil');
    } else if (n.tipo === 'vencimiento_reactivo') {
      setOpen(false);
      navigate('/control-reactivos');
    } else {
      setOpen(false);
    }
  };

  const colorTipo = (tipo) => {
    if (tipo === 'aprobado') return '#f0fdf4'; // Verde muy claro
    if (tipo === 'rechazado') return '#fef2f2'; // Rojo muy claro
    if (tipo === 'solicitud_acceso') return '#eff6ff'; // Azul muy claro
    if (tipo === 'nueva_solicitud') return '#fffbeb'; // Ambar muy claro
    if (tipo === 'cambio_estado_solicitud') return '#f5f3ff'; // Violeta muy claro
    if (tipo === 'vencimiento_reactivo') return '#fff1f2'; // Rose muy claro (peligro)
    return '#f8fafc';
  };

  const iconTipo = (tipo) => {
    if (tipo === 'aprobado') return '✅';
    if (tipo === 'rechazado') return '❌';
    if (tipo === 'solicitud_acceso') return '📋';
    if (tipo === 'nueva_solicitud') return '📦';
    if (tipo === 'cambio_estado_solicitud') return '🔄';
    if (tipo === 'vencimiento_reactivo') return '⚠️';
    return '🔔';
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => { setOpen(!open); setVerTodas(false); }} style={{
        background: "transparent", border: "none", cursor: "pointer",
        position: "relative", padding: "6px"
      }}>
        <span style={{ fontSize: "22px" }}>🔔</span>
        {noLeidas > 0 && (
          <span style={{
            position: "absolute", top: "0", right: "0",
            background: "#ef4444", color: "#fff",
            fontSize: "10px", fontWeight: "700",
            width: "18px", height: "18px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>{noLeidas > 9 ? '9+' : noLeidas}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: "0", top: "calc(100% + 12px)",
          width: "380px", maxHeight: "480px",
          background: "#fff", borderRadius: "20px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
          border: "1px solid #f1f5f9", zIndex: 9999,
          overflow: "hidden", display: "flex", flexDirection: "column",
          animation: "fadeInScale 0.2s ease-out"
        }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #f0f4f8",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <span style={{ fontWeight: "700", color: "#0A1628", fontSize: "15px" }}>
              Notificaciones {noLeidas > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "99px", marginLeft: "6px" }}>{noLeidas}</span>
              )}
            </span>
            {noLeidas > 0 && (
              <button onClick={marcarTodas} style={{
                background: "transparent", border: "none",
                color: "#00A8CC", fontSize: "12px", cursor: "pointer", fontWeight: "600"
              }}>Marcar todas leídas</button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {notificaciones.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔕</div>
                <p style={{ margin: 0, fontSize: "14px" }}>Sin notificaciones</p>
              </div>
            ) : (verTodas ? notificaciones : notificaciones.slice(0, 5)).map(n => (
              <div key={n.id_notificacion} style={{
                padding: "14px 20px",
                background: n.leida ? "#fff" : colorTipo(n.tipo),
                borderBottom: "1px solid #f0f4f8",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = n.leida ? "#fff" : colorTipo(n.tipo); e.currentTarget.style.transform = "translateX(0)"; }}
              onClick={() => handleNotificacionClick(n)}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{iconTipo(n.tipo)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "13px", color: "#0A1628" }}>{n.titulo}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#64748b", lineHeight: "1.5", wordBreak: "break-word" }}>{n.mensaje}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(n.createdAt).toLocaleString('es-CO')}
                      </p>
                      {/* ✅ Indicador de acción clickeable */}
                      {esAdmin && n.tipo === 'solicitud_acceso' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#00A8CC",
                          background: "rgba(0,168,204,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ver solicitud →</span>
                      )}
                      {(n.tipo === 'nueva_solicitud' || n.tipo === 'cambio_estado_solicitud') && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#0077B6",
                          background: "rgba(0,119,182,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ver solicitudes →</span>
                      )}
                      {n.tipo === 'vencimiento_reactivo' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#dc2626",
                          background: "rgba(220,38,38,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ir al control →</span>
                      )}
                    </div>
                  </div>
                  {!n.leida && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D4FF", marginTop: "4px", flexShrink: 0 }} />}
                </div>
              </div>
            ))}

            {/* ✅ Botón Ver todas / Ver menos */}
            {notificaciones.length > 5 && (
              <button
                onClick={() => setVerTodas(prev => !prev)}
                style={{
                  width: "100%", padding: "12px", border: "none",
                  background: "#f8fafc", color: "#0077B6",
                  fontSize: "13px", fontWeight: "600",
                  cursor: "pointer", transition: "background 0.2s ease",
                  borderTop: "1px solid #f0f4f8"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
              >
                {verTodas ? `Mostrar menos ▲` : `Ver todas (${notificaciones.length}) ▼`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}