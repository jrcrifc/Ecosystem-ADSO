import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import SolicitudPrestamoForm from "./solicitudform.jsx";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

const getBadgeEquipo = (estado) => ({
  disponible:      { bg: "#d1fae5", color: "#065f46", label: "Disponible" },
  mantenimiento:   { bg: "#fef3c7", color: "#92400e", label: "Mantenimiento" },
  "no disponible": { bg: "#fee2e2", color: "#991b1b", label: "No disponible" },
}[estado] || { bg: "#f3f4f6", color: "#374151", label: estado || "Sin estado" });

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
  const [solicitudes, setSolicitudes]       = useState([]);
  const [filterText, setFilterText]         = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [verDetalle, setVerDetalle]         = useState(null); // modal detalle

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
      selector: r => r.id_solicitud,
      sortable: true,
      width: "70px",
      center: true,
    },
    {
      name: "Solicitante",
      selector: r => r.usuario?.nombres_apellidos || "-",
      sortable: true,
      width: "160px",
      omit: !esAdmin, // ✅ Solo admin ve esta columna
    },
    {
      name: "Fecha Inicio",
      selector: r => r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleString() : "-",
      sortable: true,
      width: "160px",
    },
    {
      name: "Fecha Fin",
      selector: r => r.fecha_fin ? new Date(r.fecha_fin).toLocaleString() : "-",
      sortable: true,
      width: "160px",
    },
    {
      name: "Equipos",
      width: "220px",
      cell: r => <EquiposPills equipos={r.equipos} />,
    },
    {
      name: "Estado Solicitud",
      width: "150px",
      center: true,
      cell: r => {
        const colores = {
          generado:   { bg: "#f1f5f9", color: "#475569" },
          aceptado:   { bg: "#dbeafe", color: "#0077B6" },
          prestado:   { bg: "#fffbeb", color: "#d97706" },
          entregado:  { bg: "#ecfdf5", color: "#059669" },
          devuelto:   { bg: "#ecfdf5", color: "#059669" },
          cancelado:  { bg: "#fef2f2", color: "#dc2626" },
          rechazado:  { bg: "#fef2f2", color: "#dc2626" },
        };
        const c = colores[r.ultimoEstado] || { bg: "#f3f4f6", color: "#374151" };
        return (
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
            fontWeight: 700, backgroundColor: c.bg, color: c.color
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
            data-bs-toggle="modal"
            data-bs-target="#modalSolicitud"
            onClick={() => setSelectedSolicitud(r)}
            title="Editar"
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

  useEffect(() => { cargarSolicitudes(); }, []);

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
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    }
  };

  const filtered = solicitudes.filter(item =>
    String(item.id_solicitud || "").includes(filterText) ||
    (item.usuario?.nombres_apellidos || "").toLowerCase().includes(filterText.toLowerCase()) ||
    (item.equipos || []).some(e => e.nom_equipo?.toLowerCase().includes(filterText.toLowerCase()))
  );

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
        <div className="col-md-7 text-end">
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
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  Detalle — Solicitud #{verDetalle.id_solicitud}
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setVerDetalle(null)}></button>
              </div>
              <div className="modal-body">

                <div className="mb-3 p-3 rounded" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-muted">Solicitante</span>
                      <div className="fw-semibold">{verDetalle.usuario?.nombres_apellidos || "-"}</div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted">Estado</span>
                      <div className="fw-semibold text-capitalize">{verDetalle.ultimoEstado || "generado"}</div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted">Fecha inicio</span>
                      <div className="fw-semibold">
                        {verDetalle.fecha_inicio ? new Date(verDetalle.fecha_inicio).toLocaleString() : "-"}
                      </div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted">Fecha fin</span>
                      <div className="fw-semibold">
                        {verDetalle.fecha_fin ? new Date(verDetalle.fecha_fin).toLocaleString() : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">
                  Equipos solicitados
                  <span className="badge bg-primary ms-2">{verDetalle.equipos?.length || 0}</span>
                </h6>

                {(!verDetalle.equipos || verDetalle.equipos.length === 0) ? (
                  <p className="text-muted small">No hay equipos asignados</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {verDetalle.equipos.map(eq => {
                      const badge = getBadgeEquipo(eq.ultimoEstado);
                      return (
                        <div key={eq.id_equipo} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", borderRadius: "10px",
                          border: "1px solid #e2e8f0", backgroundColor: "#fff"
                        }}>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{eq.nom_equipo}</div>
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {eq.marca_equipo || "Sin marca"} · {eq.no_placa || "Sin placa"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setVerDetalle(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudSolicitudPrestamos;