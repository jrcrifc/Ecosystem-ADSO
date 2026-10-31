// Archivo de componente de notificaciones en tiempo real con campana y sonido filtrado por rol
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import socket from "../socket.js";
import Swal from "sweetalert2";

export default function Campanita({ userData, onAprobado, userRol }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [verTodas, setVerTodas] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  const rolLimpio = String(userRol || userData?.rol || userData?.user?.rol || "").trim().toLowerCase();

  // Permisos estrictos por rol en la campanita:
  // - Administrador: ve Solicitudes y Reactivos por vencer
  // - Instructor: SOLO ve Solicitudes
  // - Pasante: SOLO ve Reactivos por vencer
  // - Gestor: NO recibe notificaciones de Solicitudes ni de Reactivos por vencer
  const esAdmin = rolLimpio === 'administrador' || rolLimpio === 'admin';
  const esInstructor = rolLimpio === 'instructor';
  const esPasante = rolLimpio === 'pasante';
  const esGestor = rolLimpio === 'gestor';

  const puedeVerSolicitudes = esAdmin || esInstructor;
  const puedeVerReactivos = esAdmin || esPasante;

  const [tabActiva, setTabActiva] = useState(puedeVerSolicitudes ? 'solicitudes' : 'reactivos');

  // Asegura que la pestaña activa siempre corresponda al rol actual
  useEffect(() => {
    if (esPasante) {
      setTabActiva('reactivos');
    } else if (esInstructor) {
      setTabActiva('solicitudes');
    }
  }, [rolLimpio, esPasante, esInstructor]);

  // Separación de notificaciones según el rol
  const notifsSolicitudes = puedeVerSolicitudes
    ? notificaciones.filter(n => n.tipo !== 'vencimiento_reactivo')
    : [];
  const notifsReactivos = puedeVerReactivos
    ? notificaciones.filter(n => n.tipo === 'vencimiento_reactivo')
    : [];

  const noLeidasSolicitudes = notifsSolicitudes.filter(n => !n.leida).length;
  const noLeidasReactivos = notifsReactivos.filter(n => !n.leida).length;
  const noLeidas = noLeidasSolicitudes + noLeidasReactivos;

  const listaActual = tabActiva === 'solicitudes' ? notifsSolicitudes : notifsReactivos;

  useEffect(() => {
    if (!id_usuario || esGestor) return;
    cargar();

    const emitJoin = () => {
      socket.emit("join", id_usuario);
    };

    if (socket.connected) {
      emitJoin();
    }

    socket.on("connect", emitJoin);

    const playNotificationSound = () => {
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/ui/message_notification.ogg");
        audio.play().catch(e => console.log("Audio bloqueado por el navegador (requiere interacción previa):", e));
      } catch (e) {
        console.error("No se pudo reproducir el sonido de notificación", e);
      }
    };

    const handleNotification = (nueva) => {
      // Si es Gestor, no mostrar notificaciones de solicitudes ni reactivos
      if (esGestor) return;
      // Si es Pasante, ignorar notificaciones de solicitudes
      if (esPasante && nueva.tipo !== 'vencimiento_reactivo') {
        return;
      }
      // Si es Instructor, ignorar notificaciones de reactivos
      if (esInstructor && nueva.tipo === 'vencimiento_reactivo') {
        return;
      }

      setNotificaciones(prev => [nueva, ...prev]);
      playNotificationSound();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: nueva.titulo || '🔔 Nueva Notificación',
        text: nueva.mensaje,
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
          toast.style.cursor = 'pointer';
          toast.addEventListener('click', () => {
            Swal.close();
            handleNotificacionClick(nueva);
          });
        }
      });

      if (nueva.tipo === 'aprobado' && onAprobado && !esAdmin) {
        onAprobado();
      }
    };

    const handleRefresh = () => {
      cargar();
    };

    socket.on("notification", handleNotification);
    if (puedeVerSolicitudes) {
      socket.on("solicitud_actualizada", handleRefresh);
      socket.on("nueva_solicitud", handleRefresh);
      socket.on("equipo_actualizado", handleRefresh);
    }

    return () => {
      socket.off("connect", emitJoin);
      socket.off("notification", handleNotification);
      socket.off("solicitud_actualizada", handleRefresh);
      socket.off("nueva_solicitud", handleRefresh);
      socket.off("equipo_actualizado", handleRefresh);
    };
  }, [id_usuario, rolLimpio]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const cargar = async () => {
    try {
      if (esGestor) {
        setNotificaciones([]);
        return;
      }

      let nuevas = [];

      // Solo cargar notificaciones de solicitudes si es Admin o Instructor
      if (puedeVerSolicitudes) {
        const res = await apiAxios.get(`/api/notificaciones/${id_usuario}`);
        nuevas = Array.isArray(res.data) ? res.data : [];

        const hayAprobacion = nuevas.some(n => n.tipo === 'aprobado' && !n.leida);
        if (hayAprobacion && onAprobado && !esAdmin) {
          onAprobado();
        }
      }

      // Cargar alertas de reactivos próximos a vencer solo para Admin y Pasante
      if (puedeVerReactivos) {
        try {
          const statsRes = await apiAxios.get('/api/dashboard/stats');
          const venc = statsRes.data.vencimientos || [];
          const virtualNotifs = venc.map(v => ({
            id_notificacion: `venc-${v.id_movimiento_reactivo}`,
            tipo: 'vencimiento_reactivo',
            titulo: '⚠️ Reactivo por vencer',
            mensaje: `El reactivo ${v.reactivo?.nom_reactivo} (Lote: ${v.lote || 'N/A'}) vence el ${new Date(v.fecha_vencimiento).toLocaleDateString()}. Haz clic para ir a Reactivos.`,
            leida: false,
            createdAt: new Date().toISOString()
          }));
          nuevas = [...virtualNotifs, ...nuevas];
        } catch (e) {
          console.error("Error cargando stats en notificaciones", e);
        }
      }

      setNotificaciones(nuevas);
    } catch (e) { console.error("Error cargando notificaciones", e); }
  };

  const marcarTodas = async () => {
    try {
      if (puedeVerSolicitudes) {
        await apiAxios.put(`/api/notificaciones/${id_usuario}/todas-leidas`);
      }
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (e) { console.error("Error al marcar todas como leídas", e); }
  };

  // Al darle clic en cualquier notificación, marca como leída y redirige directamente al módulo correspondiente
  const handleNotificacionClick = async (n) => {
    if (!n.leida && !String(n.id_notificacion).startsWith('venc-')) {
      try {
        await apiAxios.put(`/api/notificaciones/${n.id_notificacion}/leida`);
      } catch (e) { console.error("Error al marcar como leída", e); }
    }
    setNotificaciones(prev => prev.map(x =>
      x.id_notificacion === n.id_notificacion ? { ...x, leida: true } : x
    ));

    setOpen(false);

    if (n.tipo === 'vencimiento_reactivo' && puedeVerReactivos) {
      navigate('/reactivos');
    } else if (n.tipo === 'aprobado' || n.tipo === 'rechazado') {
      navigate('/perfil');
    } else if (n.tipo === 'solicitud_acceso' && esAdmin) {
      navigate('/usuarios');
    } else if (puedeVerSolicitudes) {
      // Cualquier notificación de solicitudes, cambio de estado, revisión de equipo o préstamo vencido lleva directo a /solicitud
      navigate('/solicitud');
    }
  };

  const colorTipo = (tipo) => {
    if (tipo === 'aprobado') return '#f0fdf4';
    if (tipo === 'rechazado') return '#fef2f2';
    if (tipo === 'nueva_solicitud') return '#fffbeb';
    if (tipo === 'cambio_estado_solicitud') return '#f5f3ff';
    if (tipo === 'alerta') return '#fff1f2';
    if (tipo === 'vencimiento_reactivo') return '#fff1f2';
    return '#f0f7ff';
  };

  const iconTipo = (tipo) => {
    if (tipo === 'aprobado') return '✅';
    if (tipo === 'rechazado') return '❌';
    if (tipo === 'nueva_solicitud') return '📦';
    if (tipo === 'cambio_estado_solicitud') return '🔄';
    if (tipo === 'alerta') return '⏰';
    if (tipo === 'vencimiento_reactivo') return '⚠️';
    return '🔔';
  };

  // El rol Gestor no maneja solicitudes ni vencimiento de reactivos, por lo que no requiere campanita
  if (esGestor) {
    return null;
  }

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
        <div className="campanita-dropdown">
          <div style={{
            padding: "14px 20px 10px 20px", borderBottom: "1px solid #f0f4f8",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px"
          }}>
            <span style={{ fontWeight: "700", color: "#0077B6", fontSize: "15px" }}>
              {esPasante ? "Alertas de Reactivos" : esInstructor ? "Notificaciones de Solicitudes" : "Notificaciones"}{" "}
              {noLeidas > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "99px", marginLeft: "6px" }}>{noLeidas}</span>
              )}
            </span>
            {noLeidas > 0 && (
              <button onClick={marcarTodas} style={{
                background: "transparent", border: "none",
                color: "#0077B6", fontSize: "12px", cursor: "pointer", fontWeight: "600"
              }}>Marcar todas leídas</button>
            )}
          </div>

          {/* Selector de pestañas: Solo visible para el Administrador que tiene acceso a ambos módulos */}
          {puedeVerSolicitudes && puedeVerReactivos && (
            <div style={{
              display: "flex", borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc"
            }}>
              <button
                onClick={() => { setTabActiva('solicitudes'); setVerTodas(false); }}
                style={{
                  flex: 1, padding: "10px 12px", border: "none",
                  background: tabActiva === 'solicitudes' ? "#fff" : "transparent",
                  color: tabActiva === 'solicitudes' ? "#0077B6" : "#64748b",
                  fontWeight: tabActiva === 'solicitudes' ? "700" : "600",
                  fontSize: "12px", cursor: "pointer",
                  borderBottom: tabActiva === 'solicitudes' ? "2px solid #0077B6" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  transition: "all 0.15s ease"
                }}
              >
                📋 Solicitudes
                {noLeidasSolicitudes > 0 && (
                  <span style={{
                    background: "#0077B6", color: "#fff",
                    fontSize: "10px", padding: "1px 6px", borderRadius: "99px", fontWeight: "700"
                  }}>{noLeidasSolicitudes}</span>
                )}
              </button>
              <button
                onClick={() => { setTabActiva('reactivos'); setVerTodas(false); }}
                style={{
                  flex: 1, padding: "10px 12px", border: "none",
                  background: tabActiva === 'reactivos' ? "#fff" : "transparent",
                  color: tabActiva === 'reactivos' ? "#dc2626" : "#64748b",
                  fontWeight: tabActiva === 'reactivos' ? "700" : "600",
                  fontSize: "12px", cursor: "pointer",
                  borderBottom: tabActiva === 'reactivos' ? "2px solid #dc2626" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  transition: "all 0.15s ease"
                }}
              >
                🧪 Reactivos
                {noLeidasReactivos > 0 && (
                  <span style={{
                    background: "#dc2626", color: "#fff",
                    fontSize: "10px", padding: "1px 6px", borderRadius: "99px", fontWeight: "700"
                  }}>{noLeidasReactivos}</span>
                )}
              </button>
            </div>
          )}

          {/* Botón de acceso directo según el rol y pestaña activa */}
          <div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {tabActiva === 'solicitudes' && puedeVerSolicitudes ? (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate('/solicitud');
                }}
                style={{
                  width: "100%",
                  background: "#0077B6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                📥 {esAdmin ? "Ir a Gestión de Solicitudes" : "Ver Mis Solicitudes"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate('/reactivos');
                }}
                style={{
                  width: "100%",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                🧪 Ir a Gestión de Reactivos
              </button>
            )}
          </div>

          {/* Lista de notificaciones filtrada por rol */}
          <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", flex: 1 }}>
            {listaActual.length === 0 ? (
              <div style={{ padding: "35px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>
                  {tabActiva === 'solicitudes' ? '📭' : '🧪'}
                </div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "500" }}>
                  {tabActiva === 'solicitudes' ? 'Sin notificaciones de solicitudes' : 'Sin alertas de reactivos por vencer'}
                </p>
              </div>
            ) : (verTodas ? listaActual : listaActual.slice(0, 5)).map(n => (
              <div key={n.id_notificacion} style={{
                padding: "12px 18px",
                background: n.leida ? "#fff" : colorTipo(n.tipo),
                borderBottom: "1px solid #f0f4f8",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = n.leida ? "#fff" : colorTipo(n.tipo); e.currentTarget.style.transform = "translateX(0)"; }}
              onClick={() => handleNotificacionClick(n)}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{iconTipo(n.tipo)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "13px", color: n.tipo === 'vencimiento_reactivo' ? "#b91c1c" : "#0077B6" }}>
                      {n.titulo}
                    </p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#475569", lineHeight: "1.4", wordBreak: "break-word" }}>
                      {n.mensaje}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(n.createdAt).toLocaleString('es-CO')}
                      </p>
                      {n.tipo === 'vencimiento_reactivo' && puedeVerReactivos ? (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#dc2626",
                          background: "rgba(220,38,38,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ir a Reactivos →</span>
                      ) : puedeVerSolicitudes && n.tipo !== 'aprobado' && n.tipo !== 'rechazado' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#0077B6",
                          background: "rgba(0,119,182,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ir a Solicitudes →</span>
                      )}
                    </div>
                  </div>
                  {!n.leida && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0077B6", marginTop: "4px", flexShrink: 0 }} />}
                </div>
              </div>
            ))}

            {listaActual.length > 5 && (
              <button
                onClick={() => setVerTodas(prev => !prev)}
                style={{
                  width: "100%", padding: "10px", border: "none",
                  background: "#f8fafc", color: "#0077B6",
                  fontSize: "12px", fontWeight: "700",
                  cursor: "pointer", transition: "background 0.2s ease",
                  borderTop: "1px solid #f0f4f8"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
              >
                {verTodas ? `▲ Ver menos` : `▼ Ver más (${listaActual.length - 5} más)...`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
