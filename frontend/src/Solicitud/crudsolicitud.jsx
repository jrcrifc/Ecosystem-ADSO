// Archivo: crudsolicitud.jsx — CRUD principal de solicitudes de préstamo con tabla, filtros, modales de detalle y edición

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

// Función que devuelve estilos visuales según el estado del equipo
const getBadgeEquipo = (estado) => ({
  disponible: { bg: "#d1fae5", color: "#065f46", label: "Disponible" },
  mantenimiento: { bg: "#fef3c7", color: "#92400e", label: "Mantenimiento" },
  "no disponible": { bg: "#fee2e2", color: "#991b1b", label: "No disponible" },
}[estado] || { bg: "#f3f4f6", color: "#374151", label: estado || "Sin estado" });

// Función que formatea una fecha ISO a formato legible local
const formatDateTime = (isoString) => {
  // Retorna un guión si no hay fecha
  if (!isoString) return "-";
  // Convierte el string ISO a objeto Date
  const d = new Date(isoString);
  // Si la fecha tiene hora 00:00:00 UTC, extrae solo la fecha y asigna 7:00 AM
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return `${isoString.substring(0, 10)} 07:00 AM`;
  }
  // Retorna la fecha formateada en locale de Colombia
  return d.toLocaleString('es-CO', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Componente que renderiza las pills de equipos dentro de la celda de la tabla
const EquiposPills = ({ equipos }) => {
  // Estado para controlar si la lista de equipos está expandida
  const [expandido, setExpandido] = useState(false);
  // Si no hay equipos, muestra un texto por defecto
  if (!equipos || equipos.length === 0)
    return <span className="text-muted small">Sin equipos</span>;
  // Muestra solo los primeros dos equipos si no está expandido
  const visibles = expandido ? equipos : equipos.slice(0, 2);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
      {/* Itera sobre los equipos visibles para pintar cada pill */}
      {visibles.map((eq) => (
        <span
          key={eq.id_equipo}
          title={`${eq.marca_equipo || "Sin marca"} · ${eq.no_placa || "Sin placa"}`}
          style={{
            padding: "2px 8px", borderRadius: 20, fontSize: "0.7rem",
            fontWeight: 600, backgroundColor: "#e7f1ff", color: "#1d4ed8",
            border: "1px solid #bfdbfe", whiteSpace: "nowrap"
          }}
        >
          {eq.nom_equipo}
        </span>
      ))}
      {/* Si hay más de dos equipos, muestra botón para expandir/colapsar */}
      {equipos.length > 2 && (
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            background: "none", border: "none", padding: "2px 6px",
            fontSize: "0.7rem", color: "#6b7280", cursor: "pointer",
            fontWeight: 600
          }}
        >
          {expandido ? "Ver menos" : `+${equipos.length - 2} más`}
        </button>
      )}
    </div>
  );
};

// Componente principal del CRUD de solicitudes de préstamo
const CrudSolicitudPrestamos = () => {
  // Hook para navegación programática entre rutas
  const navigate = useNavigate();
  // Estado que almacena el listado de solicitudes obtenidas del backend
  const [solicitudes, setSolicitudes] = useState([]);
  // Estado que almacena el término de búsqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena la solicitud seleccionada para editar
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  // Estado que almacena la solicitud seleccionada para ver detalle
  const [verDetalle, setVerDetalle] = useState(null);
  // Obtiene el token de autenticación desde sessionStorage
  const getToken = () => sessionStorage.getItem("token");
  // Lee los datos del usuario desde sessionStorage
  const stored = sessionStorage.getItem("user");
  // Parsea los datos del usuario si existen
  const userData = stored ? JSON.parse(stored) : null;
  // Determina el rol del usuario actual en minúsculas
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  // Obtiene el ID del usuario actual
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  // Verifica si el usuario es administrador
  const esAdmin = userRol === "administrador" || userRol === "admin";
  // Definición de las columnas de la tabla DataTable
  const columns = [
    {
      name: "ID",
      id: 1,
      selector: r => r.id_solicitud,
      sortable: true,
      width: "70px",
      center: true,
    },
    {
      name: "Solicitante",
      selector: r => r.usuario?.nombres_apellidos || "-",
      sortable: true,
      minWidth: "150px",
      grow: 1,
      wrap: true,
      // Oculta la columna si el usuario no es administrador
      omit: !esAdmin,
    },
    {
      name: "Fecha Inicio",
      selector: r => formatDateTime(r.fecha_inicio),
      sortable: true,
      width: "155px",
      wrap: true
    },
    {
      name: "Fecha Fin",
      selector: r => formatDateTime(r.fecha_fin),
      sortable: true,
      width: "155px",
      wrap: true
    },
    {
      name: "Equipos",
      width: "220px",
      cell: r => <EquiposPills equipos={r.equipos} />,
    },
    {
      name: "Estado",
      selector: r => r.ultimoEstado || "generado",
      sortable: true,
      width: "150px",
      // Renderiza el estado con colores según el valor
      cell: r => {
        const colores = {
          generado: { bg: "#f1f5f9", color: "#475569" },
          aceptado: { bg: "#dbeafe", color: "#0077B6" },
          prestado: { bg: "#fffbeb", color: "#d97706" },
          entregado: { bg: "#ecfdf5", color: "#059669" },
          devuelto: { bg: "#ecfdf5", color: "#059669" },
          cancelado: { bg: "#fef2f2", color: "#dc2626" },
          rechazado: { bg: "#fef2f2", color: "#dc2626" },
        };
        const c = colores[r.ultimoEstado] || { bg: "#f3f4f6", color: "#374151" };
        return (
          <span style={{
            padding: "5px 12px", borderRadius: 20, fontSize: "0.75rem",
            fontWeight: 700, backgroundColor: c.bg, color: c.color,
            display: "inline-block"
          }}>
            {r.ultimoEstado || "generado"}
          </span>
        );
      }
    },
    {
      name: "Activo",
      width: "90px",
      center: true,
      // Renderiza un badge con el estado activo/inactivo
      cell: r => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${r.estado === 1 ? "bg-success" : "bg-danger"}`}
          style={{ fontSize: "0.7rem" }}>
          {r.estado === 1 ? "SÍ" : "NO"}
        </span>
      ),
    },
    {
      name: "Acciones",
      center: true,
      width: "120px",
      // Renderiza los botones de acción para cada fila
      cell: r => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            className="btn btn-sm btn-info text-white"
            onClick={() => setVerDetalle(r)}
            title="Ver detalle"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle={['generado', 'aceptado'].includes(r.ultimoEstado) ? "modal" : ""}
            data-bs-target={['generado', 'aceptado'].includes(r.ultimoEstado) ? "#modalSolicitud" : ""}
            // Maneja el clic para editar, muestra advertencia si el estado no lo permite
            onClick={() => {
              if (!['generado', 'aceptado'].includes(r.ultimoEstado)) {
                Swal.fire({
                  icon: "info",
                  title: "Edición no permitida",
                  text: `No se puede editar una solicitud que ya está en estado ${r.ultimoEstado.toUpperCase()}.`
                });
              } else {
                setSelectedSolicitud(r);
              }
            }}
            disabled={!['generado', 'aceptado'].includes(r.ultimoEstado)}
            style={{ opacity: ['generado', 'aceptado'].includes(r.ultimoEstado) ? 1 : 0.5 }}
            title={['generado', 'aceptado'].includes(r.ultimoEstado) ? "Editar" : `No se puede editar en estado ${r.ultimoEstado}`}
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button
            className={`btn btn-sm ${r.estado === 1 ? "btn-outline-danger" : "btn-outline-success"}`}
            onClick={() => toggleEstado(r.id_solicitud, r.estado)}
            title={r.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${r.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];
  // Efecto que carga las solicitudes al montar el componente y configura listeners
  useEffect(() => {
    cargarSolicitudes();
    // Escucha cambios en tiempo real para refrescar la tabla
    socket.on('solicitud_actualizada', cargarSolicitudes);
    // Obtiene la referencia al modal de Bootstrap para edición
    const modalSolicitud = document.getElementById("modalSolicitud");
    // Función que limpia los backdrops huérfanos del modal
    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    // Función que se ejecuta cuando se oculta el modal, limpiando selección y backdrop
    const handleSolicitudHidden = () => {
      setSelectedSolicitud(null);
      cleanupBackdrop();
    };
    // Si existe el modal, le agrega el listener de ocultamiento
    if (modalSolicitud) {
      modalSolicitud.addEventListener("hidden.bs.modal", handleSolicitudHidden);
    }
    // Función de limpieza al desmontar el componente
    return () => {
      socket.off('solicitud_actualizada', cargarSolicitudes);
      if (modalSolicitud) {
        modalSolicitud.removeEventListener("hidden.bs.modal", handleSolicitudHidden);
      }
    };
  }, []);
  // Función asíncrona para obtener todas las solicitudes desde la API
  const cargarSolicitudes = async () => {
    try {
      const res = await apiAxios.get("/api/solicitud", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Si es admin asigna todas las solicitudes, si no filtra solo las del usuario actual
      if (esAdmin) {
        setSolicitudes(res.data);
      } else {
        const misSolicitudes = res.data.filter(s => s.usuario?.id_usuario === userId || s.id_usuario === userId);
        setSolicitudes(misSolicitudes);
      }
    } catch {
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };
  // Función para alternar el estado activo/inactivo de una solicitud
  const toggleEstado = async (id, estadoActual) => {
    // Calcula el nuevo estado inverso al actual
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    // Muestra confirmación al usuario con SweetAlert2
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La solicitud pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question", showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar",
    });
    // Sale si el usuario canceló la operación
    if (!result.isConfirmed) return;
    try {
      // Envía la petición PUT para cambiar el estado en el backend
      await apiAxios.put(`/api/solicitud/estado/${id}`, { estado: nuevoEstado }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Actualiza el estado localmente sin recargar toda la lista
      setSolicitudes(prev =>
        prev.map(item => item.id_solicitud === id ? { ...item, estado: nuevoEstado } : item)
      );
      Swal.fire({ icon: "success", title: "¡Listo!", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };
  // Función para cerrar el modal con limpieza de backdrop
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
      // Limpieza inmediata para evitar backdrops huérfanos por re-renders rápidos
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };
  // Filtra las solicitudes localmente según el texto de búsqueda ingresado
  const filtered = solicitudes.filter(item => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_solicitud || "").includes(search) ||
      String(item.usuario?.nombres_apellidos || "").toLowerCase().includes(search) ||
      (item.equipos || []).some(e => 
        String(e.nom_equipo || "").toLowerCase().includes(search) ||
        String(e.marca_equipo || "").toLowerCase().includes(search) ||
        String(e.no_placa || "").toLowerCase().includes(search)
      )
    );
  });
  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      {/* Encabezado de la página con barra decorativa azul y título */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Solicitudes de Préstamo</h2>
      </div>
      {/* Fila con el campo de búsqueda y botones de acción */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text" className="form-control"
            placeholder="Buscar por ID, solicitante o equipo..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-secondary"
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => navigate("/estadoxsolicitud")}>
            📜 Ver Historial
          </button>
          <button className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal" data-bs-target="#modalSolicitud"
            onClick={() => setSelectedSolicitud(null)}>
            + Nueva Solicitud
          </button>
        </div>
      </div>
      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={1}
          defaultSortAsc={false}
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
                {/* Sección con datos generales de la solicitud */}
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
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>FECHA INICIO</span>
                      <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                        {formatDateTime(verDetalle.fecha_inicio)}
                      </div>
                    </div>
                    <div className="col-6 mt-2">
                      <span className="text-muted d-block" style={{ fontSize: "11px", fontWeight: "600" }}>FECHA FIN</span>
                      <div className="fw-bold" style={{ color: "#0f172a", fontSize: "13px" }}>
                        {formatDateTime(verDetalle.fecha_fin)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Listado de equipos solicitados con badge de cantidad */}
                <h6 className="fw-bold mb-3" style={{ color: "#023E8A", fontSize: "14px", display: "flex", alignItems: "center" }}>
                  📦 Equipos solicitados
                  <span className="badge ms-2" style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px" }}>{verDetalle.equipos?.length || 0}</span>
                </h6>
                {/* Mensaje si no hay equipos asignados */}
                {(!verDetalle.equipos || verDetalle.equipos.length === 0) ? (
                  <p className="text-muted small text-center my-3">No hay equipos asignados</p>
                ) : (
                  // Itera sobre los equipos para mostrar cada uno como tarjeta
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
                            src={eq.foto_equipo ? `http://localhost:8000/uploads/${eq.foto_equipo}` : "/img/no-image.png"}
                            alt={eq.nom_equipo || "Foto del equipo"}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #dbeafe"
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
