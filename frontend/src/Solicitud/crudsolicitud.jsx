import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import SolicitudPrestamoForm from "./solicitudform.jsx";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
import socket from "../socket.js";

const getBadgeEquipo = (estado) => ({
  disponible: { bg: "#d1fae5", color: "#065f46", label: "Disponible" },
  mantenimiento: { bg: "#fef3c7", color: "#92400e", label: "Mantenimiento" },
  "no disponible": { bg: "#fee2e2", color: "#991b1b", label: "No disponible" },
}[estado] || { bg: "#f3f4f6", color: "#374151", label: estado || "Sin estado" });

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  
  // Si la fecha fue guardada con hora 00:00:00 UTC (solo fecha, sin hora)
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return `${isoString.substring(0, 10)} 07:00 AM`;
  }
  
  return d.toLocaleString('es-CO', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const EquiposPills = ({ equipos }) => {
  const [expandido, setExpandido] = useState(false);
  if (!equipos || equipos.length === 0)
    return <span className="text-muted small">Sin equipos</span>;

  const visibles = expandido ? equipos : equipos.slice(0, 2);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
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

const CrudSolicitudPrestamos = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [verDetalle, setVerDetalle] = useState(null); // modal detalle

  const getToken = () => sessionStorage.getItem("token");

  // ✅ Detectar usuario y rol
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const esAdmin = userRol === "administrador" || userRol === "admin";

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

  useEffect(() => {
    cargarSolicitudes();

    // ✅ Escuchar cambios en tiempo real para refrescar la tabla
    socket.on('solicitud_actualizada', cargarSolicitudes);

    // ✅ Event listener para modal de Bootstrap para limpieza garantizada
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
      // ✅ Si NO es admin, filtrar solo las solicitudes del usuario actual
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

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La solicitud pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question", showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/solicitud/estado/${id}`, { estado: nuevoEstado }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSolicitudes(prev =>
        prev.map(item => item.id_solicitud === id ? { ...item, estado: nuevoEstado } : item)
      );
      Swal.fire({ icon: "success", title: "¡Listo!", timer: 1500, showConfirmButton: false });
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
      
      // ✅ Limpieza inmediata para evitar backdrops huérfanos por re-renders rápidos de React
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

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
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Solicitudes de Préstamo</h2>
      </div>

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

      {/* Modal editar/crear */}
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

      {/* Modal detalle de equipos */}
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