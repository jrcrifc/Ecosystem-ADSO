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
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: solicitud.estado === 'pendiente' ? "#fff8e1" : solicitud.estado === 'aprobado' ? "#e8f5e9" : "#ffebee",
              border: `1px solid ${solicitud.estado === 'pendiente' ? "#ffe082" : solicitud.estado === 'aprobado' ? "#a5d6a7" : "#ef9a9a"}`,
              borderRadius: "12px", padding: "24px", marginBottom: "24px"
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                {solicitud.estado === 'pendiente' ? '⏳' : solicitud.estado === 'aprobado' ? '✅' : '❌'}
              </div>
              <h4 style={{ fontWeight: "700", color: "#0A1628" }}>
                {solicitud.estado === 'pendiente' ? 'Solicitud en revisión' :
                  solicitud.estado === 'aprobado' ? '¡Acceso aprobado!' : 'Solicitud rechazada'}
              </h4>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {solicitud.estado === 'pendiente' ? 'El administrador revisará tu solicitud pronto. Recibirás una notificación.' :
                  solicitud.estado === 'aprobado' ? 'Ya puedes acceder al sistema. Recarga la página.' :
                    'Tu solicitud fue rechazada. Contacta al Laboratorio Ambiental.'}
              </p>
            </div>

            {/* Resumen */}
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px", textAlign: "left" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", marginBottom: "10px" }}>Tu solicitud</p>
              {[
                { label: "Ficha", value: solicitud.ficha },
                { label: "Grupo", value: solicitud.grupo },
                { label: "Motivo", value: solicitud.motivo },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", minWidth: "60px" }}>{f.label}:</span>
                  <span style={{ fontSize: "13px", color: "#0A1628", fontWeight: "500" }}>{f.value}</span>
                </div>
              ))}
            </div>

            <button onClick={logOut} style={{
              marginTop: "20px", background: "transparent",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "10px 24px", color: "#64748b", cursor: "pointer", fontSize: "13px"
            }}>Cerrar sesión</button>
          </div>
        ) : (
          // Formulario
          <form onSubmit={enviar}>
            {[
              { label: "Número de Ficha", name: "ficha", placeholder: "Ej: 2558832" },
              { label: "Grupo", name: "grupo", placeholder: "Ej: Grupo 1" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>{f.label}</label>
                <input
                  type="text" required
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid #e5e7eb", fontSize: "14px",
                    outline: "none", background: "#f9fafb"
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>¿Por qué quieres acceder al sistema?</label>
              <textarea
                required rows={4}
                placeholder="Describe el motivo por el que necesitas acceso..."
                value={form.motivo}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  border: "1px solid #e5e7eb", fontSize: "14px",
                  outline: "none", background: "#f9fafb", resize: "vertical"
                }}
              />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "13px",
              background: "linear-gradient(135deg,#00D4FF,#0099bb)",
              border: "none", borderRadius: "10px",
              color: "#020d1a", fontWeight: "700", fontSize: "15px", cursor: "pointer"
            }}>
              Enviar Solicitud
            </button>
            <button type="button" onClick={logOut} style={{
              width: "100%", marginTop: "10px", background: "transparent",
              border: "1px solid #e5e7eb", borderRadius: "10px",
              padding: "10px", color: "#64748b", cursor: "pointer", fontSize: "13px"
            }}>Cerrar sesión</button>
          </form>
        )}
      </div>
    </div>
  );
}