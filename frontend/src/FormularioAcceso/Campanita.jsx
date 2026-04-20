import { useState, useEffect, useRef } from "react";
import apiAxios from "../api/axiosConfig.js";

export default function Campanita({ userData, onAprobado }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  const noLeidas = notificaciones.filter(n => !n.leida).length;

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
      const hayAprobacion = nuevas.some(n => n.tipo === 'aprobado' && !n.leida);
      if (hayAprobacion && onAprobado) {
        onAprobado();
      }

      setNotificaciones(nuevas);
    } catch { }
  };

  const marcarTodas = async () => {
    try {
      await apiAxios.put(`/api/notificaciones/${id_usuario}/todas-leidas`);
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch { }
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
          position: "absolute", right: 0, top: "40px",
          width: "360px", maxHeight: "420px",
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
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
                cursor: "pointer"
              }} onClick={async () => {
                if (!n.leida) {
                  await apiAxios.put(`/api/notificaciones/${n.id_notificacion}/leida`);
                  setNotificaciones(prev => prev.map(x =>
                    x.id_notificacion === n.id_notificacion ? { ...x, leida: true } : x
                  ));
                }
              }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px" }}>{iconTipo(n.tipo)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "13px", color: "#0A1628" }}>{n.titulo}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{n.mensaje}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                      {new Date(n.createdAt).toLocaleString('es-CO')}
                    </p>
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