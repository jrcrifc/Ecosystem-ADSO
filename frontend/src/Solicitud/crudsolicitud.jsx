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
// Importa la librería Bootstrap para manipular modales
import * as bootstrap from "bootstrap";
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
  const [verDetalle, setVerDetalle] = useState(null);

  const getToken = () => sessionStorage.getItem("token");
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const esAdmin = userRol === "administrador" || userRol === "admin";
  const esPasante = userRol === "pasante";
  const esGestor = userRol === "gestor";
  // Los roles que pueden gestionar solicitudes (aceptar, prestar, entregar, cancelar)
  const puedeGestionar = esAdmin || esPasante || esGestor;

  // Título dinámico según el rol del usuario
  const tituloVista = (esAdmin || esPasante) ? "Gestión de Solicitudes" : "Solicitudes";

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
      generado: { bg: "#f1f5f9", color: "#475569" },
      aceptado: { bg: "#dbeafe", color: "#0077B6" },
      prestado: { bg: "#fffbeb", color: "#d97706" },
      entregado: { bg: "#ecfdf5", color: "#059669" },
      devuelto: { bg: "#ecfdf5", color: "#059669" },
      cancelado: { bg: "#fef2f2", color: "#dc2626" },
      rechazado: { bg: "#fef2f2", color: "#dc2626" },
    };
    return map[estado] || { bg: "#f3f4f6", color: "#374151" };
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
        const estadoActual = r.ultimoEstado || "generado";
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
                  {estadoActual}
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
                  title="Recibir Equipo (Liberar)"
                  style={{ background: "#dcfce7", color: "#16a34a", border: "none", borderRadius: "20px", padding: "5px 10px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <i className="fas fa-undo"></i> Entregar
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
            {estadoActual}
          </span>
        );
      }
    },
    {
      name: "Acciones", center: true, width: "100px",
      cell: r => (
        <div className="d-flex gap-1 justify-content-center">
          {/* Botón Ver Detalle (ojito) */}
          <button className="btn btn-sm"
            style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            onClick={() => setVerDetalle(r)} title="Ver detalle">
            <i className="fas fa-eye"></i>
          </button>
          {/* Botón Historial (recargar) */}
          <button className="btn btn-sm"
            style={{ background: "#f1f5f9", color: "#64748b", border: "none" }}
            onClick={() => navigate("/estadoxsolicitud", { state: { id_solicitud: r.id_solicitud } })}
            title="Ver historial">
            <i className="fas fa-history"></i>
          </button>
        </div>
      ),
    },
  ];

  // ===================== EFECTOS Y FUNCIONES =====================

  useEffect(() => {
    cargarSolicitudes();
    // Escucha cambios en tiempo real para refrescar la tabla automáticamente
    socket.on('solicitud_actualizada', cargarSolicitudes);
    socket.on('equipo_actualizado', cargarSolicitudes);
    const modalSolicitud = document.getElementById("modalSolicitud");
    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    const handleSolicitudHidden = () => {
      setSelectedSolicitud(null);
      cleanupBackdrop();
    };
    if (modalSolicitud) {
      modalSolicitud.addEventListener("hidden.bs.modal", handleSolicitudHidden);
    }
    return () => {
      socket.off('solicitud_actualizada', cargarSolicitudes);
      socket.off('equipo_actualizado', cargarSolicitudes);
      if (modalSolicitud) {
        modalSolicitud.removeEventListener("hidden.bs.modal", handleSolicitudHidden);
      }
    };
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await apiAxios.get("/api/solicitud", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Admin y Pasante ven todas las solicitudes; Instructor solo las suyas
      if (esAdmin || esPasante || esGestor) {
        setSolicitudes(res.data);
      } else {
        const misSolicitudes = res.data.filter(s => s.usuario?.id_usuario === userId || s.id_usuario === userId);
        setSolicitudes(misSolicitudes);
      }
    } catch {
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };

  // Cambiar estado de solicitud (aceptar, prestar, entregar, cancelar)
  const cambiarEstadoAdmin = async (id_solicitud, nuevoEstado) => {
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La solicitud pasará a "${nuevoEstado.toUpperCase()}"`,
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.post(
        `/api/solicitud/cambiarEstado/${id_solicitud}`,
        { id_estado_solicitud: mapaEstadosId[nuevoEstado] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      Swal.fire({
        icon: "success", title: "¡Estado actualizado!",
        text: `Solicitud ahora está en "${nuevoEstado}"`,
        timer: 1800, showConfirmButton: false
      });
      cargarSolicitudes();
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalSolicitud");
    if (modal) {
      const closeBtn = modal.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.click();
      } else {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.hide();
      }
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
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
    <div className="mt-4" style={{ padding: "0 16px" }}>
      {/* Encabezado con título dinámico */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>{tituloVista}</h2>
      </div>

      {/* Barra de búsqueda y botón nueva solicitud */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control"
            placeholder="Buscar por ID, solicitante, equipo o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          <button className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal" data-bs-target="#modalSolicitud"
            onClick={() => setSelectedSolicitud(null)}>
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
          defaultSortFieldId={1} defaultSortAsc={false}
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay solicitudes registradas</p>
            </div>
          }
          paginationPerPage={10}
        />
      </div>

      {/* Modal editar/crear solicitud */}
      <div className="modal fade" id="modalSolicitud" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="modal-header" style={{ background: "#023E8A", color: "#fff" }}>
              <h5 className="modal-title">
                {selectedSolicitud ? "Editar" : "Nueva"} Solicitud de Préstamo
              </h5>
              <button type="button" className="btn-close btn-close-white"
                data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              <SolicitudPrestamoForm
                selectedSolicitud={selectedSolicitud}
                refreshData={cargarSolicitudes}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal detalle de equipos de la solicitud */}
      {verDetalle && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden", border: "none" }}>
              <div className="modal-header text-white" style={{ background: "#023E8A" }}>
                <h5 className="modal-title" style={{ fontWeight: "700" }}>
                  🔍 Detalle — Solicitud #{verDetalle.id_solicitud}
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setVerDetalle(null)}></button>
              </div>
              <div className="modal-body" style={{ padding: "20px" }}>
                {/* Datos generales */}
                <div className="mb-3 p-3 rounded" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>SOLICITANTE</span>
                      <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>{verDetalle.usuario?.nombres_apellidos || "-"}</div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>ESTADO</span>
                      <div className="fw-bold text-capitalize" style={{ color: "#0f172a", fontSize: "13px" }}>{verDetalle.ultimoEstado || "generado"}</div>
                    </div>
                    <div className="col-6 mt-2">
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>FECHA RECOGIDA</span>
                      <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                        {(() => { const f = formatDateCompact(verDetalle.fecha_inicio); return f === "-" ? "-" : `${f.fecha} ${f.hora}`; })()}
                      </div>
                    </div>
                    <div className="col-6 mt-2">
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>FECHA DEVOLUCIÓN</span>
                      <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                        {(() => { const f = formatDateCompact(verDetalle.fecha_fin); return f === "-" ? "-" : `${f.fecha} ${f.hora}`; })()}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Equipos solicitados */}
                <h6 className="fw-bold mb-3" style={{ color: "#023E8A", fontSize: "14px", display: "flex", alignItems: "center" }}>
                  📦 Equipos solicitados
                  <span className="badge ms-2" style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px" }}>{verDetalle.equipos?.length || 0}</span>
                </h6>
                {(!verDetalle.equipos || verDetalle.equipos.length === 0) ? (
                  <p className="text-muted small text-center my-3">No hay equipos asignados</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {verDetalle.equipos.map(eq => {
                      const placa = (eq.no_placa && eq.no_placa !== 0 && eq.no_placa !== '0') ? eq.no_placa : null;
                      return (
                        <div key={eq.id_equipo} style={{
                          display: "flex", alignItems: "center", gap: "14px",
                          padding: "12px 16px", borderRadius: "12px",
                          border: "1px solid #e2e8f0", backgroundColor: "#fff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                        }}>
                          <img
                            src={eq.foto_equipo ? (eq.foto_equipo.startsWith("http") ? eq.foto_equipo : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${eq.foto_equipo}`) : "/img/no-image.png"}
                            alt={eq.nom_equipo || "Foto del equipo"}
                            style={{
                              width: "60px", height: "60px", objectFit: "cover",
                              borderRadius: "8px", border: "1px solid #dbeafe"
                            }}
                            onError={(e) => { e.target.src = "/img/no-image.png"; }}
                          />
                          <div style={{ flex: 1 }}>
                            <div className="fw-bold" style={{ fontSize: "0.95rem", color: "#023E8A" }}>{eq.nom_equipo}</div>
                            <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>
                              <span className="fw-semibold">Marca:</span> {eq.marca_equipo || "Sin marca"}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#475569" }}>
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
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #e2e8f0" }}>
                <button className="btn text-white" style={{ background: "#023E8A", fontWeight: "600", borderRadius: "8px" }} onClick={() => setVerDetalle(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudSolicitudPrestamos;
