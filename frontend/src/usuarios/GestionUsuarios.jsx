import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import socket from "../socket.js";

export default function GestionUsuarios() {
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [tab, setTab] = useState("pendientes");
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargar(); }, [tab]);

  // ✅ Actualización en tiempo real al recibir notificaciones por socket
  useEffect(() => {
    const handleNotification = (nueva) => {
      // Si la notificación es sobre un nuevo usuario, recargamos la lista
      if (nueva.tipo === "solicitud_acceso") {
        cargar();
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [tab]); // incluimos tab para que cargar use el tab actual

  const ordenarUsuarios = (lista) => {
    const pesos = {
      aprobado: 1,
      pendiente: 2,
      inactivo: 3,
      rechazado: 4
    };
    return [...lista].sort((a, b) => {
      const pesoA = pesos[a.estado] || 99;
      const pesoB = pesos[b.estado] || 99;
      return pesoA - pesoB;
    });
  };

  const cargar = async () => {
    try {
      if (tab === "pendientes") {
        const resUsuarios = await apiAxios.get("/api/auth/usuarios", { headers });
        let pendientes = resUsuarios.data.filter(u =>
          ['Pasante', 'Gestor', 'Aprendiz', 'Instructor'].includes(u.rol) &&
          u.estado === 'pendiente'
        );
        pendientes = ordenarUsuarios(pendientes);
        setUsuariosPendientes(pendientes);
      }

      // ✅ Cargar todos los usuarios para la pestaña de gestión
      if (tab === "gestion") {
        const resUsuarios = await apiAxios.get("/api/auth/usuarios", { headers });
        let filtrados = resUsuarios.data.filter(u => u.rol !== 'Administrador');
        filtrados = ordenarUsuarios(filtrados);
        setTodosUsuarios(filtrados);
      }
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const aprobarUsuario = async (id_usuario) => {
    const result = await Swal.fire({
      title: "¿Aprobar usuario?", icon: "question",
      showCancelButton: true, confirmButtonColor: "#0077B6",
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

  // ✅ Toggle activar/inactivar
  const toggleActivo = async (id_usuario, estadoActual) => {
    const activar = estadoActual === 'inactivo';
    const result = await Swal.fire({
      title: activar ? "¿Activar usuario?" : "¿Inactivar usuario?",
      text: activar
        ? "El usuario podrá iniciar sesión nuevamente"
        : "El usuario no podrá iniciar sesión hasta que lo reactives",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: activar ? "#0077B6" : "#f59e0b",
      confirmButtonText: activar ? "Sí, activar" : "Sí, inactivar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      const res = await apiAxios.put(`/api/auth/usuarios/${id_usuario}/toggle-activo`, {}, { headers });
      Swal.fire({
        icon: "success",
        title: res.data.estado === 'inactivo' ? "Usuario inactivado" : "Usuario activado",
        timer: 1500, showConfirmButton: false
      });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };



  const estadoBadge = (estado) => {
    const map = {
      pendiente: ["#fffbeb", "#d97706", "⏳ Pendiente"],
      aprobado: ["#ecfdf5", "#059669", "✅ Activo"],
      rechazado: ["#fef2f2", "#dc2626", "❌ Rechazado"],
      inactivo: ["#f1f5f9", "#64748b", "⏸️ Inactivo"]
    };
    const [bg, color, label] = map[estado] || ["#f5f5f5", "#666", estado];
    return <span style={{ background: bg, color, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "99px" }}>{label}</span>;
  };

  const gradientFor = (rol) => {
    const map = {
      Pasante: "linear-gradient(135deg, #f59e0b, #d97706)",
      Gestor: "linear-gradient(135deg, #0077B6, #023E8A)",
      Aprendiz: "linear-gradient(135deg, #06b6d4, #0891b2)",
      Instructor: "linear-gradient(135deg, #10b981, #059669)",
    };
    return map[rol] || "linear-gradient(135deg, #94a3b8, #64748b)";
  };

  const rolSections = [
    { key: "Gestor",     icon: "🔑", label: "Gestores",     color: "#0077B6" },
    { key: "Pasante",    icon: "🔬", label: "Pasantes",     color: "#d97706" },
    { key: "Aprendiz",   icon: "🎓", label: "Aprendices",   color: "#0891b2" },
    { key: "Instructor", icon: "👨‍🏫", label: "Instructores", color: "#059669" },
  ];

  const cardUsuario = (u) => (
    <div key={u.id_usuario} style={{
      background: "#fff", borderRadius: "16px", padding: "24px",
      marginBottom: "14px", border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: gradientFor(u.rol),
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "800", fontSize: "18px"
          }}>
            {u.nombres_apellidos?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 style={{ margin: "0 0 2px", fontWeight: "700", color: "#0f172a" }}>{u.nombres_apellidos}</h5>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748b" }}>{u.email} · {u.documento}</p>
            <span style={{
              background: "#eef2ff", color: "#0077B6",
              fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "99px"
            }}>⚙️ {u.rol}</span>
          </div>
        </div>
        {estadoBadge(u.estado)}
      </div>



      {(u.numero_ficha || u.nombre_ficha) && (
        <div style={{
          marginTop: "10px", background: "#f0fdf4", borderRadius: "10px",
          padding: "10px 14px", border: "1px solid #dcfce7", display: "flex", gap: "16px", flexWrap: "wrap"
        }}>
          {u.numero_ficha && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              🆔 <strong>Ficha:</strong> {u.numero_ficha}
            </span>
          )}
          {u.nombre_ficha && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              📋 <strong>Nombre Ficha:</strong> {u.nombre_ficha}
            </span>
          )}
          {u.es_sena_empresa !== undefined && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              🏢 <strong>SENA Empresa:</strong> {u.es_sena_empresa ? "Sí" : "No"}
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
        {u.estado === 'pendiente' && (
          <>
            <button onClick={() => aprobarUsuario(u.id_usuario)} style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              border: "none", borderRadius: "10px", padding: "10px 24px",
              color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "13px"
            }}>✅ Aprobar</button>
            <button onClick={() => rechazarUsuario(u.id_usuario)} style={{
              background: "#fff", border: "1px solid #ef4444",
              borderRadius: "10px", padding: "10px 24px",
              color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px"
            }}>❌ Rechazar</button>
          </>
        )}
        {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
          <button onClick={() => toggleActivo(u.id_usuario, u.estado)} style={{
            background: u.estado === 'inactivo' ? "linear-gradient(135deg, #0077B6, #023E8A)" : "transparent",
            border: u.estado === 'inactivo' ? "none" : "1px solid #f59e0b",
            borderRadius: "10px", padding: "10px 24px",
            color: u.estado === 'inactivo' ? "#fff" : "#d97706",
            fontWeight: "700", cursor: "pointer", fontSize: "13px"
          }}>
            {u.estado === 'inactivo' ? "🔓 Activar" : "🔒 Inactivar"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Usuarios</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Aprueba, rechaza, activa o inactiva usuarios del sistema</p>

      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, nombre, documento o email..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[["pendientes", "🔑 Solicitudes de Acceso"], ["gestion", "👥 Control de Cuentas"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "13px",
            background: tab === key ? "#0f172a" : "#f1f5f9",
            color: tab === key ? "#818cf8" : "#64748b"
          }}>{label}</button>
        ))}
      </div>

      {/* ✅ Pestaña Gestión — Separada por roles */}
      {tab === "gestion" && (
        <div>
          {todosUsuarios.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            rolSections.map(section => {
              const usuarios = todosUsuarios.filter(u => {
                const search = filterText.toLowerCase().trim();
                return u.rol === section.key && (
                  String(u.id_usuario || "").includes(search) ||
                  String(u.nombres_apellidos || "").toLowerCase().includes(search) ||
                  String(u.documento || "").includes(search) ||
                  String(u.email || "").toLowerCase().includes(search)
                );
              });
              if (usuarios.length === 0) return null;

              return (
                <div key={section.key} style={{ marginBottom: "28px" }}>
                  {/* Section header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    marginBottom: "14px", paddingBottom: "10px",
                    borderBottom: `2px solid ${section.color}22`
                  }}>
                    <span style={{ fontSize: "20px" }}>{section.icon}</span>
                    <span style={{
                      fontSize: "13px", fontWeight: "800", color: section.color,
                      letterSpacing: "1px", textTransform: "uppercase"
                    }}>
                      {section.label}
                    </span>
                    <span style={{
                      background: section.color, color: "#fff",
                      fontSize: "11px", fontWeight: "700", padding: "2px 10px",
                      borderRadius: "99px", marginLeft: "4px"
                    }}>
                      {usuarios.length}
                    </span>
                  </div>

                  {/* Users in this role */}
                  {usuarios.map(u => (
                    <div key={u.id_usuario} style={{
                      background: "#fff", borderRadius: "14px", padding: "18px 22px",
                      marginBottom: "10px", border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap"
                    }}>
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: gradientFor(u.rol),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: "800", fontSize: "16px", flexShrink: 0
                      }}>
                        {u.nombres_apellidos?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{u.nombres_apellidos}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{u.email} · {u.documento}</div>
                        {(u.numero_ficha || u.nombre_ficha) && (
                          <div style={{ fontSize: "11px", color: "#0077B6", marginTop: "4px", fontWeight: "600" }}>
                            🆔 Ficha: {u.numero_ficha || "N/A"} · Ficha Nombre: {u.nombre_ficha || "N/A"} · SENA Empresa: {u.es_sena_empresa ? "Sí" : "No"}
                          </div>
                        )}
                      </div>
                      {estadoBadge(u.estado)}
                      {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
                        <button onClick={() => toggleActivo(u.id_usuario, u.estado)} style={{
                          background: u.estado === 'inactivo' ? "linear-gradient(135deg, #0077B6, #023E8A)" : "transparent",
                          border: u.estado === 'inactivo' ? "none" : "1px solid #f59e0b",
                          borderRadius: "8px", padding: "7px 18px",
                          color: u.estado === 'inactivo' ? "#fff" : "#d97706",
                          fontWeight: "700", cursor: "pointer", fontSize: "12px",
                          transition: "all 0.2s"
                        }}>
                          {u.estado === 'inactivo' ? "🔓 Activar" : "🔒 Inactivar"}
                        </button>
                      )}
                      {u.estado === 'pendiente' && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => aprobarUsuario(u.id_usuario)} style={{
                            background: "linear-gradient(135deg, #0077B6, #023E8A)", border: "none",
                            borderRadius: "8px", padding: "7px 16px", color: "#fff",
                            fontWeight: "700", cursor: "pointer", fontSize: "12px"
                          }}>✅</button>
                          <button onClick={() => rechazarUsuario(u.id_usuario)} style={{
                            background: "#fff", border: "1px solid #ef4444",
                            borderRadius: "8px", padding: "7px 16px", color: "#ef4444",
                            fontWeight: "700", cursor: "pointer", fontSize: "12px"
                          }}>❌</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}

          {/* ✅ Sección Usuarios (pendientes/todas) */}
          {tab !== "gestion" && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontSize: "11px", fontWeight: "700", color: "#0077B6",
                letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px"
              }}>⚙️ Lista de Usuarios</p>
              {usuariosPendientes
                .filter(u => {
                  const search = filterText.toLowerCase().trim();
                  return (
                    String(u.id_usuario || "").includes(search) ||
                    String(u.nombres_apellidos || "").toLowerCase().includes(search) ||
                    String(u.documento || "").includes(search) ||
                    String(u.email || "").toLowerCase().includes(search)
                  );
                })
                .map(u => cardUsuario(u))}
            </div>
          )}

      {/* Sin datos */}
      {tab !== "gestion" && usuariosPendientes.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontSize: "16px" }}>No hay usuarios {tab === "pendientes" ? "pendientes" : ""}</p>
        </div>
      )}
    </div>
  );
}