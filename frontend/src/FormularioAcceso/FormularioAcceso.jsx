import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function FormularioAcceso({ userData, logOut }) {
  const [form, setForm] = useState({ ficha: "", grupo: "", motivo: "" });
  const [enviado, setEnviado] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  const nombre = userData?.nombres_apellidos || userData?.user?.nombres_apellidos;
  const rol = userData?.rol || userData?.user?.rol;
  const estado = userData?.estado || userData?.user?.estado;

  useEffect(() => {
    if (estado === 'rechazado') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso rechazado',
        text: 'Tu solicitud fue rechazada. Serás expulsado del sistema.',
        confirmButtonText: 'Entendido'
      }).then(() => logOut());
      return;
    }
    cargarSolicitud();
  }, []);

  const cargarSolicitud = async () => {
    try {
      const res = await apiAxios.get(`/api/solicitud-acceso/${id_usuario}`);
      if (res.data) setSolicitud(res.data);
    } catch { }
    setLoading(false);
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      await apiAxios.post('/api/solicitud-acceso', { id_usuario, ...form });
      setEnviado(true);
      Swal.fire('✅ Enviado', 'Tu solicitud fue enviada. Espera la respuesta del administrador.', 'success');
      cargarSolicitud();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'No se pudo enviar', 'error');
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f9ff",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "40px",
        maxWidth: "520px", width: "100%",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        border: "1px solid #e0f2fe"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg,#00D4FF,#0099bb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px"
          }}>🔐</div>
          <h2 style={{ fontWeight: "700", color: "#0A1628", marginBottom: "6px" }}>Solicitud de Acceso</h2>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Hola <strong>{nombre}</strong>, completa el formulario para acceder al sistema como <strong>{rol}</strong></p>
        </div>

        {solicitud ? (
          // Ya envió el formulario
          <div className="animate__animated animate__fadeIn">
            <div style={{
              background: solicitud.estado === 'pendiente' ? "#fffbeb" : solicitud.estado === 'aprobado' ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${solicitud.estado === 'pendiente' ? "#fef3c7" : solicitud.estado === 'aprobado' ? "#dcfce7" : "#fee2e2"}`,
              borderRadius: "24px", padding: "32px", marginBottom: "24px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
            }}>
              <div style={{ fontSize: "52px", marginBottom: "16px" }}>
                {solicitud.estado === 'pendiente' ? '⏳' : solicitud.estado === 'aprobado' ? '✅' : '❌'}
              </div>
              <h3 style={{ fontWeight: "800", color: "#0A1628", marginBottom: "12px" }}>
                {solicitud.estado === 'pendiente' ? 'Solicitud en Revisión' :
                  solicitud.estado === 'aprobado' ? '¡Acceso Concedido!' : 'Acceso Denegado'}
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                {solicitud.estado === 'pendiente' ? 'Un administrador está validando tus datos. Te notificaremos pronto a través de la campana.' :
                  solicitud.estado === 'aprobado' ? '¡Felicidades! Ya eres parte de Ecosystem. Recarga la página para empezar.' :
                    'Lo sentimos, tu solicitud no cumple con los requisitos actuales. Por favor, contacta a soporte.'}
              </p>
            </div>

            {/* Resumen de Datos */}
            <div style={{ background: "#f8fafc", borderRadius: "18px", padding: "20px", textAlign: "left", border: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Resumen de Solicitud</p>
              {[
                { label: "Ficha", value: solicitud.ficha, icon: "🆔" },
                { label: "Grupo", value: solicitud.grupo, icon: "👥" },
                { label: "Motivo", value: solicitud.motivo, icon: "📝" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px" }}>{f.icon}</span>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{f.label}</span>
                    <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: "600" }}>{f.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
               {solicitud.estado === 'aprobado' && (
                 <button onClick={() => window.location.reload()} style={{
                   flex: 2, background: "linear-gradient(135deg, #0077B6, #00B4D8)",
                   border: "none", borderRadius: "12px", padding: "14px",
                   color: "#fff", fontWeight: "700", cursor: "pointer",
                   boxShadow: "0 4px 12px rgba(0,119,182,0.2)"
                 }}>Ingresar Ahora</button>
               )}
               <button onClick={logOut} style={{
                 flex: 1, background: "#fff",
                 border: "1px solid #e2e8f0", borderRadius: "12px",
                 padding: "14px", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: "600"
               }}>Salir</button>
            </div>
          </div>
        ) : (
          // Formulario
          <form onSubmit={enviar}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              {[
                { label: "Número de Ficha", name: "ficha", placeholder: "2558832", icon: "🆔" },
                { label: "Grupo", name: "grupo", placeholder: "Grupo 1", icon: "👥" },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>{f.label}</label>
                  <input
                    type="text" required
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "12px",
                      border: "1px solid #e2e8f0", fontSize: "14px",
                      outline: "none", background: "#f8fafc", transition: "all 0.2s"
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>¿Por qué necesitas acceso? 📝</label>
              <textarea
                required rows={3}
                placeholder="Describe brevemente el motivo de tu solicitud..."
                value={form.motivo}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid #e2e8f0", fontSize: "14px",
                  outline: "none", background: "#f8fafc", resize: "none"
                }}
              />
            </div>

            <button type="submit" style={{
              width: "100%", padding: "16px",
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              border: "none", borderRadius: "14px",
              color: "#fff", fontWeight: "800", fontSize: "16px", cursor: "pointer",
              boxShadow: "0 10px 20px rgba(0,119,182,0.15)",
              transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              🚀 Enviar Solicitud de Acceso
            </button>
            
            <button type="button" onClick={logOut} style={{
              width: "100%", marginTop: "12px", background: "transparent",
              border: "none", padding: "10px", color: "#94a3b8", cursor: "pointer", fontSize: "13px", fontWeight: "600"
            }}>Cancelar y Salir</button>
          </form>
        )}
      </div>
    </div>
  );
}