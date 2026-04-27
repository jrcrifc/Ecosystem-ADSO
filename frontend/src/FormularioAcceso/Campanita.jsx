import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";

export default function Campanita({ userData, onAprobado, userRol }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  const noLeidas = notificaciones.filter(n => !n.leida).length;
  const esAdmin = userRol === 'Administrador';

  useEffect(() => {
    if (!id_usuario) return;
    cargar();
    // ✅ Polling cada 5 segundos
    const interval = setInterval(cargar, 5000);
    return () => clearInterval(interval);
  }, [id_usuario]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const cargar = async () => {
    try {
      const res = await apiAxios.get(`/api/notificaciones/${id_usuario}`);
      const nuevas = res.data;

      // ✅ Si hay notificación de aprobado no leída, avisar al App para recargar userData
      // ⚠️ Solo para usuarios NO administradores (evita re-render innecesario del admin)
      const hayAprobacion = nuevas.some(n => n.tipo === 'aprobado' && !n.leida);
      if (hayAprobacion && onAprobado && userRol !== 'Administrador') {
        onAprobado();
      }

      // ✅ Limitar a las últimas 5 notificaciones
      const ultimasCinco = nuevas.slice(0, 5);
      setNotificaciones(ultimasCinco);
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

    // ✅ Si es admin y la notificación es de solicitud de acceso, redirigir a gestión usuarios
    if (esAdmin && n.tipo === 'solicitud_acceso') {
      setOpen(false);
      navigate('/gestion-usuarios');
    }
  };

  const colorTipo = (tipo) => {
    if (tipo === 'aprobado') return '#e8f5e9';
    if (tipo === 'rechazado') return '#ffebee';
    if (tipo === 'solicitud_acceso') return '#e3f2fd';
    return '#f5f5f5';
  };

  const iconTipo = (tipo) => {
    if (tipo === 'aprobado') return '✅';
    if (tipo === 'rechazado') return '❌';
    if (tipo === 'solicitud_acceso') return '📋';
    return '🔔';
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
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
          position: "fixed", left: "290px", top: "auto",
          width: "360px", maxHeight: "420px",
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          border: "1px solid #f0f4f8", zIndex: 9999,
          overflow: "hidden", display: "flex", flexDirection: "column"
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
            ) : notificaciones.map(n => (
              <div key={n.id_notificacion} style={{
                padding: "14px 20px",
                background: n.leida ? "#fff" : colorTipo(n.tipo),
                borderBottom: "1px solid #f0f4f8",
                cursor: "pointer",
                transition: "background 0.15s ease"
              }} onClick={() => handleNotificacionClick(n)}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{iconTipo(n.tipo)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "13px", color: "#0A1628" }}>{n.titulo}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#64748b", lineHeight: "1.5", wordBreak: "break-word" }}>{n.mensaje}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(n.createdAt).toLocaleString('es-CO')}
                      </p>
                      {/* ✅ Indicador de acción para admin en solicitudes de acceso */}
                      {esAdmin && n.tipo === 'solicitud_acceso' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#00A8CC",
                          background: "rgba(0,168,204,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ver solicitud →</span>
                      )}
                    </div>
                  </div>
                  {!n.leida && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D4FF", marginTop: "4px", flexShrink: 0 }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}