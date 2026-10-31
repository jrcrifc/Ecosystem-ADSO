// Archivo: crudsolicitud.jsx — Vista unificada de Solicitudes (tabla única con acciones de gestión por rol)

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa useNavigate para redirigir entre rutas
import { useNavigate } from "react-router-dom";
// Importa el componente DataTable para renderizar tablas con paginación y búsqueda
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa el formulario de solicitud para usarlo dentro del modal
import SolicitudPrestamoForm from "./solicitudform.jsx";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa la instancia de Socket.io para comunicación en tiempo real
import socket from "../socket.js";

// Función que formatea una fecha ISO en dos líneas: fecha arriba, hora abajo
const formatDateCompact = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return { fecha: isoString.substring(0, 10), hora: "07:00 AM" };
  }
  const fecha = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { fecha, hora };
};

// Componente principal del CRUD unificado de solicitudes de préstamo
const CrudSolicitudPrestamos = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verDetalle, setVerDetalle] = useState(null);

  const getToken = () => sessionStorage.getItem("token");
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const esAdmin = userRol === "administrador" || userRol === "admin";
  // Solo el Administrador puede gestionar solicitudes (aceptar, prestar, entregar, cancelar)
  const puedeGestionar = esAdmin;

  // Título dinámico según el rol del usuario (Admin ve gestión general, Instructor ve sus solicitudes)
  const tituloVista = esAdmin ? "Gestión de Solicitudes" : "Mis Solicitudes";

  // Mapa de transiciones permitidas entre estados (para botones de acción)
  const estadosSiguientes = {
    generado: ["aceptado", "cancelado"],
    aceptado: ["prestado"],
    prestado: ["entregado"],
    entregado: [],
    cancelado: [],
  };

  // Mapa de IDs de estados en BD
  const mapaEstadosId = {
    generado: 1, aceptado: 2, prestado: 3, entregado: 5, cancelado: 6
  };

  // Función para obtener estilo de badge según el estado
  const getBadgeStyle = (estado) => {
    const map = {
      generado:  { bg: "#f1f5f9", color: "#475569", label: "Generado" },
      aceptado:  { bg: "#dbeafe", color: "#0077B6", label: "Aceptado" },
      prestado:  { bg: "#fffbeb", color: "#d97706", label: "Prestado" },
      entregado: { bg: "#ecfdf5", color: "#059669", label: "Entregado" },
      devuelto:  { bg: "#ecfdf5", color: "#059669", label: "Entregado" },
      revision:  { bg: "#f3e8ff", color: "#7c3aed", label: "Entregado (En Revisión)" },
      cancelado: { bg: "#fef2f2", color: "#dc2626", label: "Cancelado" },
      rechazado: { bg: "#fef2f2", color: "#dc2626", label: "Rechazado" },
    };
    return map[estado] || { bg: "#f3f4f6", color: "#374151", label: capitalizeText(estado) };
  };

  // Función para capitalizar correctamente los textos en mayúsculas
  const capitalizeText = (str) => {
    if (!str) return "";
    return String(str).toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // ===================== COLUMNAS DE LA TABLA UNIFICADA =====================
  const columns = [
    {
      name: "Solicitante", minWidth: "220px", center: true,
      cell: r => {
        const u = r.usuario;
        if (!u) return <span>-</span>;
        return (
          <div style={{ padding: "6px 0", textAlign: "center" }}>
            <div style={{ fontWeight: "500", color: "#0f172a", fontSize: "13px" }}>{capitalizeText(u.nombres_apellidos)}</div>
            <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "500", marginTop: "2px" }}>{capitalizeText(u.rol)}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Equipo(s)", minWidth: "200px", center: true,
      cell: r => {
        if (!r.equipos || r.equipos.length === 0) return <span className="text-muted small">-</span>;
        return (
          <div style={{ padding: "6px 0", display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
            {r.equipos.map(eq => (
              <div key={eq.id_equipo} style={{ fontSize: "12px", color: "#0f172a", fontWeight: "500" }}>
                • {capitalizeText(eq.nom_equipo)}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      name: "Fecha Recogida", minWidth: "190px", center: true,
      cell: r => {
        const f = formatDateCompact(r.fecha_inicio);
        if (f === "-") return "-";
        return (
          <div style={{ lineHeight: "1.4", textAlign: "center" }}>
            <div style={{ fontWeight: "500", fontSize: "12px", color: "#0f172a" }}>{f.fecha}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{f.hora}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Fecha Devolución", minWidth: "210px", center: true,
      cell: r => {
        const f = formatDateCompact(r.fecha_fin);
        if (f === "-") return "-";
        return (
          <div style={{ lineHeight: "1.4", textAlign: "center" }}>
            <div style={{ fontWeight: "500", fontSize: "12px", color: "#0f172a" }}>{f.fecha}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{f.hora}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Estado Actual", minWidth: puedeGestionar ? "260px" : "130px", center: true,
      cell: r => {
        const estadoActual = r.estadoVisual || r.ultimoEstado || "generado";
        const c = getBadgeStyle(estadoActual);

        // Si el usuario puede gestionar, mostramos botones de acción
        if (puedeGestionar) {
          const siguientes = estadosSiguientes[estadoActual] || [];
          return (
            <div className="d-flex gap-1 py-1 align-items-center flex-wrap">
              {siguientes.length === 0 && (
                <span style={{
                  background: c.bg, color: c.color,
                  fontSize: "11px", fontWeight: "700",
                  padding: "4px 12px", borderRadius: "99px"
                }}>
                  {c.label || estadoActual}
                </span>
              )}
              {siguientes.includes("aceptado") && (
                <button className="btn btn-sm"
                  onClick={() => cambiarEstadoAdmin(r.id_solicitud, "aceptado")}
                  title="Aceptar Solicitud"
                  style={{ background: "#dbeafe", color: "#0077B6", border: "none", borderRadius: "20px", padding: "5px 10px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <i className="fas fa-check-circle"></i> Aceptar
                </button>
              )}
              {siguientes.includes("cancelado") && (
                <button className="btn btn-sm"
                  onClick={() => cambiarEstadoAdmin(r.id_solicitud, "cancelado")}
                  title="Cancelar Solicitud"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "20px", padding: "5px 10px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <i className="fas fa-times-circle"></i> Cancelar
                </button>
              )}
              {siguientes.includes("prestado") && (
                <button className="btn btn-sm"
                  onClick={() => cambiarEstadoAdmin(r.id_solicitud, "prestado")}
                  title="Prestar Equipo"
                  style={{ background: "#fef3c7", color: "#d97706", border: "none", borderRadius: "20px", padding: "5px 10px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <i className="fas fa-box"></i> Prestar
                </button>
              )}
              {siguientes.includes("entregado") && (
                <button className="btn btn-sm"
                  onClick={() => cambiarEstadoAdmin(r.id_solicitud, "entregado")}
                  title="Recibir Equipo (Pasa automáticamente a Revisión técnica)"
                  style={{ background: "#f3e8ff", color: "#7c3aed", border: "none", borderRadius: "20px", padding: "5px 10px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <i className="fas fa-undo"></i> Entregar (A Revisión)
                </button>
              )}
            </div>
          );
        }

        // Si es instructor sin permisos de gestión, solo badge
        return (
          <span style={{
            padding: "5px 12px", borderRadius: 20, fontSize: "0.75rem",
            fontWeight: 700, backgroundColor: c.bg, color: c.color,
            display: "inline-block"
          }}>
            {c.label || estadoActual}
          </span>
        );
      }
    },
    {
      name: "Acciones", center: true, width: "130px",
      cell: r => {
        const estadoActual = (r.ultimoEstado || "").toLowerCase();
        const esGenerado = estadoActual === "generado" || r.id_estado_solicitud === 1;

        return (
          <div className="d-flex gap-1 justify-content-center">
            {/* Botón Editar (lápiz) - SOLO permitido si está en estado generado */}
            {esGenerado && (
              <button className="btn btn-sm"
                style={{ background: "#dbeafe", color: "#0077B6", border: "none", padding: "5px 9px", borderRadius: "6px" }}
                onClick={() => abrirEditarSolicitud(r)}
                title="Editar Solicitud (Solo en estado generado)">
                <i className="fas fa-pencil-alt"></i>
              </button>
            )}
            {/* Botón Ver Detalle (ojito) */}
            <button className="btn btn-sm"
              style={{ background: "#0077B6", color: "#fff", border: "none", padding: "5px 9px", borderRadius: "6px" }}
              onClick={() => setVerDetalle(r)} title="Ver detalle">
              <i className="fas fa-eye"></i>
            </button>
            {/* Botón Historial */}
            <button className="btn btn-sm"
              style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "5px 9px", borderRadius: "6px" }}
              onClick={() => navigate("/estadoxsolicitud", { state: { id_solicitud: r.id_solicitud } })}
              title="Ver historial">
              <i className="fas fa-history"></i>
            </button>
          </div>
        );
      },
    },
  ];

  // ===================== EFECTOS Y FUNCIONES =====================

  useEffect(() => {
    cargarSolicitudes();
    // Escucha cambios en tiempo real para refrescar la tabla automáticamente
    socket.on('solicitud_actualizada', cargarSolicitudes);
    socket.on('equipo_actualizado', cargarSolicitudes);
    return () => {
      socket.off('solicitud_actualizada', cargarSolicitudes);
      socket.off('equipo_actualizado', cargarSolicitudes);
    };
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await apiAxios.get("/api/solicitud", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const dataOrdenada = [...(Array.isArray(res.data) ? res.data : [])].sort(
        (a, b) => (b.id_solicitud || 0) - (a.id_solicitud || 0)
      );
      // Admin ve todas las solicitudes para gestionarlas; Instructor solo las suyas
      if (esAdmin) {
        setSolicitudes(dataOrdenada);
      } else {
        const misSolicitudes = dataOrdenada.filter(s => s.usuario?.id_usuario === userId || s.id_usuario === userId);
        setSolicitudes(misSolicitudes);
      }
    } catch (error) {
      console.warn("No se pudieron cargar solicitudes:", error?.message);
      setSolicitudes([]);
    }
  };

  // Cambiar estado de solicitud (aceptar, prestar, entregar, cancelar)
  const cambiarEstadoAdmin = async (id_solicitud, nuevoEstado) => {
    const esEntregar = nuevoEstado === "entregado";
    const result = await Swal.fire({
      title: esEntregar ? "¿Recibir equipo(s) en Revisión?" : "¿Cambiar estado?",
      text: esEntregar
        ? "El estado de la solicitud cambiará a 'Entregado (En Revisión)' ya que el(los) equipo(s) ingresarán a revisión técnica en el laboratorio. Se notificará automáticamente al instructor por correo y en la campanita."
        : `La solicitud pasará a "${nuevoEstado.toUpperCase()}"`,
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#0077B6",
      confirmButtonText: esEntregar ? "Sí, recibir y pasar a Revisión" : "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.post(
        `/api/solicitud/cambiarEstado/${id_solicitud}`,
        { id_estado_solicitud: mapaEstadosId[nuevoEstado] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      Swal.fire({
        icon: "success",
        title: esEntregar ? "¡Solicitud en Entregado (En Revisión)!" : "¡Estado actualizado!",
        text: esEntregar
          ? "El estado de la solicitud cambió a 'Entregado (En Revisión)' mientras se verifica el estado físico de los equipos. Una vez aprobados como disponibles, la solicitud pasará automáticamente a 'Entregado'."
          : `La solicitud ahora se encuentra en estado "${nuevoEstado}".`,
        timer: 2600,
        showConfirmButton: false
      });
      cargarSolicitudes();
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const abrirNuevaSolicitud = () => {
    setSelectedSolicitud(null);
    setShowModal(true);
  };

  const abrirEditarSolicitud = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
    setSelectedSolicitud(null);
  };

  // Filtrar solicitudes por texto
  const filtered = solicitudes.filter(item => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_solicitud || "").includes(search) ||
      String(item.usuario?.nombres_apellidos || "").toLowerCase().includes(search) ||
      String(item.ultimoEstado || "").toLowerCase().includes(search) ||
      (item.equipos || []).some(e => 
        String(e.nom_equipo || "").toLowerCase().includes(search) ||
        String(e.marca_equipo || "").toLowerCase().includes(search) ||
        String(e.no_placa || "").toLowerCase().includes(search)
      )
    );
  });

  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {/* Encabezado con título dinámico */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>{tituloVista}</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          {esAdmin
            ? "Administra, aprueba y realiza el seguimiento de las solicitudes de préstamo de equipos."
            : "Gestiona y consulta el estado de tus solicitudes de préstamo en el laboratorio."}
        </p>
      </div>

      {/* Barra de búsqueda y botón nueva solicitud */}
      <div className="row mb-3 align-items-center g-2">
        <div className="col-12 col-md-5">
          <input type="text" className="form-control"
            placeholder="Buscar por ID, solicitante, equipo o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-12 col-md-7 text-end d-flex gap-2 justify-content-end">
          <button className="btn"
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none", padding: "8px 18px" }}
            onClick={abrirNuevaSolicitud}>
            + Nueva Solicitud
          </button>
        </div>
      </div>

      {/* Tabla unificada */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover striped responsive
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay solicitudes registradas</p>
            </div>
          }
          paginationPerPage={10}
        />
      </div>

      {/* Modal editar/crear solicitud con diseño azul metalizado unificado */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "680px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  {selectedSolicitud ? "✏️ Editar Solicitud de Préstamo" : "➕ Nueva Solicitud de Préstamo"}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  Selecciona los equipos y programa las fechas de recogida y devolución
                </p>
              </div>
              <button onClick={hideModal}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "0" }}>
              <SolicitudPrestamoForm
                selectedSolicitud={selectedSolicitud}
                refreshData={cargarSolicitudes}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle de equipos de la solicitud */}
      {verDetalle && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "540px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  🔍 Detalle — Solicitud #{verDetalle.id_solicitud}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  Información del solicitante y equipos asociados
                </p>
              </div>
              <button onClick={() => setVerDetalle(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>
            <div style={{ padding: "20px", overflowY: "auto" }}>
              {/* Datos generales */}
              <div className="mb-3 p-3 rounded" style={{ backgroundColor: "#f0f7ff", border: "1px solid #dbeafe", borderRadius: "10px" }}>
                <div className="row g-2 small">
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>SOLICITANTE</span>
                    <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>{verDetalle.usuario?.nombres_apellidos || "-"}</div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>ESTADO</span>
                    <div className="fw-bold text-capitalize" style={{ color: "#0077B6", fontSize: "13px" }}>{verDetalle.ultimoEstado || "generado"}</div>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>FECHA RECOGIDA</span>
                    <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                      {(() => { const f = formatDateCompact(verDetalle.fecha_inicio); return f === "-" ? "-" : `${f.fecha} ${f.hora}`; })()}
                    </div>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>FECHA DEVOLUCIÓN</span>
                    <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                      {(() => { const f = formatDateCompact(verDetalle.fecha_fin); return f === "-" ? "-" : `${f.fecha} ${f.hora}`; })()}
                    </div>
                  </div>
                </div>
              </div>
              {/* Equipos solicitados */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#065f46", fontWeight: "700", textTransform: "uppercase" }}>
                  📦 Equipos Solicitados
                </span>
                <span className="badge" style={{ background: "#059669", color: "#fff", fontSize: "11px" }}>{verDetalle.equipos?.length || 0}</span>
              </div>
              {(!verDetalle.equipos || verDetalle.equipos.length === 0) ? (
                <p className="text-muted small text-center my-3">No hay equipos asignados</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {verDetalle.equipos.map(eq => {
                    const placa = (eq.no_placa && eq.no_placa !== 0 && eq.no_placa !== '0') ? eq.no_placa : null;
                    return (
                      <div key={eq.id_equipo} style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "12px 16px", borderRadius: "10px",
                        border: "1.5px solid #dbeafe", backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                      }}>
                        <img
                          src={eq.foto_equipo ? (eq.foto_equipo.startsWith("http") ? eq.foto_equipo : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${eq.foto_equipo}`) : "/img/no-image.png"}
                          alt={eq.nom_equipo || "Foto del equipo"}
                          style={{
                            width: "56px", height: "56px", objectFit: "cover",
                            borderRadius: "8px", border: "1.5px solid #0077B6"
                          }}
                          onError={(e) => { e.target.src = "/img/no-image.png"; }}
                        />
                        <div style={{ flex: 1 }}>
                          <div className="fw-bold" style={{ fontSize: "0.9rem", color: "#023E8A" }}>{eq.nom_equipo}</div>
                          <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "3px" }}>
                            <span className="fw-semibold">Placa:</span> {placa ? (
                              <span className="badge bg-secondary ms-1" style={{ fontSize: "10px" }}>{placa}</span>
                            ) : (
                              <span className="text-muted italic ms-1" style={{ fontSize: "11px" }}>Sin placa</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => setVerDetalle(null)}
                  style={{
                    padding: "9px 24px", borderRadius: "8px", border: "none",
                    background: "linear-gradient(135deg, #0077B6, #023E8A)",
                    color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer"
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudSolicitudPrestamos;
