import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function GestionUsuarios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [tab, setTab] = useState("pendientes");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargar(); }, [tab]);

  const cargar = async () => {
    try {
      if (tab === "pendientes" || tab === "todas") {
        // ✅ Cargar solicitudes de acceso (Aprendiz/Instructor)
        const urlSolicitudes = tab === "pendientes"
          ? "/api/solicitud-acceso/pendientes"
          : "/api/solicitud-acceso/todas";
        const resSolicitudes = await apiAxios.get(urlSolicitudes, { headers });
        setSolicitudes(resSolicitudes.data);

        // ✅ Cargar usuarios Pasante/Gestor pendientes
        const resUsuarios = await apiAxios.get("/api/auth/usuarios", { headers });
        const pendientes = resUsuarios.data.filter(u =>
          ['Pasante', 'Gestor'].includes(u.rol) &&
          (tab === "pendientes" ? u.estado === 'pendiente' : true)
        );
        setUsuariosPendientes(pendientes);
      }
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const aprobarUsuario = async (id_usuario) => {
    const result = await Swal.fire({
      title: "¿Aprobar usuario?", icon: "question",
      showCancelButton: true, confirmButtonColor: "#00D4FF",
      confirmButtonText: "Sí, aprobar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/auth/usuarios/${id_usuario}/aprobar`, {}, { headers });
      Swal.fire("✅ Aprobado", "El usuario ya puede acceder al sistema", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  const rechazarUsuario = async (id_usuario) => {
    const result = await Swal.fire({
      title: "¿Rechazar usuario?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, rechazar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/auth/usuarios/${id_usuario}/rechazar`, {}, { headers });
      Swal.fire("Rechazado", "El usuario fue rechazado", "info");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  const aprobar = async (id) => {
    const result = await Swal.fire({
      title: "¿Aprobar usuario?", icon: "question",
      showCancelButton: true, confirmButtonColor: "#00D4FF",
      confirmButtonText: "Sí, aprobar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/solicitud-acceso/${id}/aprobar`, {}, { headers });
      Swal.fire("✅ Aprobado", "El usuario ya puede acceder al sistema", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  const rechazar = async (id) => {
    const result = await Swal.fire({
      title: "¿Rechazar usuario?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, rechazar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/solicitud-acceso/${id}/rechazar`, {}, { headers });
      Swal.fire("Rechazado", "El usuario fue rechazado", "info");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  const estadoBadge = (estado) => {
    const map = {
      pendiente: ["#fff8e1", "#f59e0b", "⏳ Pendiente"],
      aprobado: ["#e8f5e9", "#16a34a", "✅ Aprobado"],
      rechazado: ["#ffebee", "#ef4444", "❌ Rechazado"]
    };
    const [bg, color, label] = map[estado] || ["#f5f5f5", "#666", estado];
    return <span style={{ background: bg, color, fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "99px" }}>{label}</span>;
  };

  const cardUsuario = (u) => (
    <div key={u.id_usuario} style={{
      background: "#fff", borderRadius: "16px", padding: "24px",
      marginBottom: "16px", border: "1px solid #f0f4f8",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "800", fontSize: "18px"
          }}>
            {u.nombres_apellidos?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 style={{ margin: "0 0 2px", fontWeight: "700", color: "#0A1628" }}>{u.nombres_apellidos}</h5>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748b" }}>{u.email} · {u.documento}</p>
            <span style={{
              background: "#fef3c7", color: "#d97706",
              fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "99px"
            }}>⚙️ {u.rol}</span>
          </div>
        </div>
        {estadoBadge(u.estado)}
      </div>

      {/* Sin formulario — solo datos básicos */}
      <div style={{
        marginTop: "16px", background: "#f8fafc", borderRadius: "10px",
        padding: "14px 16px"
      }}>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
          ℹ️ Este usuario es <strong>{u.rol}</strong> y no requiere formulario de acceso. 
          Puedes aprobarlo directamente para que acceda a los módulos del sistema.
        </p>
      </div>

      {u.estado === 'pendiente' && (
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button onClick={() => aprobarUsuario(u.id_usuario)} style={{
            background: "linear-gradient(135deg,#00D4FF,#0099bb)",
            border: "none", borderRadius: "10px", padding: "10px 24px",
            color: "#020d1a", fontWeight: "700", cursor: "pointer", fontSize: "13px"
          }}>✅ Aprobar</button>
          <button onClick={() => rechazarUsuario(u.id_usuario)} style={{
            background: "#fff", border: "1px solid #ef4444",
            borderRadius: "10px", padding: "10px 24px",
            color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px"
          }}>❌ Rechazar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <h2 className="fw-bold mb-1" style={{ color: "#0A1628" }}>Gestión de Usuarios</h2>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Aprueba o rechaza solicitudes de acceso al sistema</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[["pendientes", "⏳ Pendientes"], ["todas", "📋 Todas"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "13px",
            background: tab === key ? "#0A1628" : "#f1f5f9",
            color: tab === key ? "#00D4FF" : "#64748b"
          }}>{label}</button>
        ))}
        <button onClick={cargar} style={{
          marginLeft: "auto", padding: "8px 16px", borderRadius: "10px",
          border: "1px solid #e5e7eb", background: "#fff",
          cursor: "pointer", fontSize: "13px", color: "#64748b"
        }}>🔄 Actualizar</button>
      </div>

      {/* ✅ Sección Pasante/Gestor */}
      {usuariosPendientes.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "11px", fontWeight: "700", color: "#f59e0b",
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px"
          }}>⚙️ Pasantes y Gestores</p>
          {usuariosPendientes.map(u => cardUsuario(u))}
        </div>
      )}

      {/* ✅ Sección Aprendiz/Instructor */}
      {solicitudes.length > 0 && (
        <div>
          <p style={{
            fontSize: "11px", fontWeight: "700", color: "#0284c7",
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px"
          }}>🎓 Aprendices e Instructores</p>
          {solicitudes.map(s => (
            <div key={s.id_solicitud_acceso} style={{
              background: "#fff", borderRadius: "16px", padding: "24px",
              marginBottom: "16px", border: "1px solid #f0f4f8",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#00D4FF,#0099bb)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#020d1a", fontWeight: "800", fontSize: "18px"
                  }}>
                    {s.usuario?.nombres_apellidos?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 style={{ margin: "0 0 2px", fontWeight: "700", color: "#0A1628" }}>{s.usuario?.nombres_apellidos}</h5>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748b" }}>{s.usuario?.email} · {s.usuario?.documento}</p>
                    <span style={{
                      background: "#e0f2fe", color: "#0284c7",
                      fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "99px"
                    }}>🎓 {s.usuario?.rol}</span>
                  </div>
                </div>
                {estadoBadge(s.estado)}
              </div>

              <div style={{
                marginTop: "16px", background: "#f8fafc", borderRadius: "10px",
                padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"
              }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Ficha</p>
                  <p style={{ margin: 0, fontWeight: "600", color: "#0A1628" }}>{s.ficha}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Grupo</p>
                  <p style={{ margin: 0, fontWeight: "600", color: "#0A1628" }}>{s.grupo}</p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Motivo</p>
                  <p style={{ margin: 0, color: "#374151", lineHeight: "1.6" }}>{s.motivo}</p>
                </div>
              </div>

              {s.estado === 'pendiente' && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button onClick={() => aprobar(s.id_solicitud_acceso)} style={{
                    background: "linear-gradient(135deg,#00D4FF,#0099bb)",
                    border: "none", borderRadius: "10px", padding: "10px 24px",
                    color: "#020d1a", fontWeight: "700", cursor: "pointer", fontSize: "13px"
                  }}>✅ Aprobar</button>
                  <button onClick={() => rechazar(s.id_solicitud_acceso)} style={{
                    background: "#fff", border: "1px solid #ef4444",
                    borderRadius: "10px", padding: "10px 24px",
                    color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px"
                  }}>❌ Rechazar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sin datos */}
      {solicitudes.length === 0 && usuariosPendientes.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontSize: "16px" }}>No hay solicitudes {tab === "pendientes" ? "pendientes" : ""}</p>
        </div>
      )}
    </div>
  );
}