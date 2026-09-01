// Archivo: crudsolicitud.jsx — Vista unificada de Solicitudes con pestañas (Mis Solicitudes + Gestión Admin)

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

// Función que formatea una fecha ISO a formato legible local
const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return `${isoString.substring(0, 10)} 07:00 AM`;
  }
  return d.toLocaleString('es-CO', { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', hour12: true 
  });
};

// Componente que renderiza las pills de equipos dentro de la celda de la tabla
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

// Componente principal del CRUD unificado de solicitudes de préstamo
const CrudSolicitudPrestamos = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [verDetalle, setVerDetalle] = useState(null);
  // Pestaña activa: "solicitudes" o "gestionar"
  const [tabActiva, setTabActiva] = useState("solicitudes");

  const getToken = () => sessionStorage.getItem("token");
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const esAdmin = userRol === "administrador" || userRol === "admin";

  // Mapa de transiciones permitidas entre estados (para pestaña Gestionar)
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

  // ===================== COLUMNAS PESTAÑA "SOLICITUDES" =====================
  const columnsSolicitudes = [
    {
      name: "ID", selector: r => r.id_solicitud, sortable: true,
      width: "70px", center: true,
    },
    {
      name: "Solicitante",
      selector: r => r.usuario?.nombres_apellidos || "-",
      sortable: true, minWidth: "150px", grow: 1, wrap: true,
      omit: !esAdmin,
    },
    {
      name: "Fecha Inicio",
      selector: r => formatDateTime(r.fecha_inicio),
      sortable: true, width: "155px", wrap: true
    },
    {
      name: "Fecha Fin",
      selector: r => formatDateTime(r.fecha_fin),
      sortable: true, width: "155px", wrap: true
    },
    {
      name: "Equipos", width: "220px",
      cell: r => <EquiposPills equipos={r.equipos} />,
    },
    {
      name: "Estado",
      selector: r => r.ultimoEstado || "generado",
      sortable: true, width: "150px",
      cell: r => {
        const c = getBadgeStyle(r.ultimoEstado);
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
      name: "Activo", width: "90px", center: true,
      cell: r => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${r.estado === 1 ? "bg-success" : "bg-danger"}`}
          style={{ fontSize: "0.7rem" }}>
          {r.estado === 1 ? "SÍ" : "NO"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, width: "200px",
      cell: r => (
        <div className="d-flex gap-1 justify-content-center">
          {/* Botón Ver Detalle */}
          <button className="btn btn-sm"
            style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            onClick={() => setVerDetalle(r)} title="Ver detalle">
            <i className="fas fa-eye"></i>
          </button>
          {/* Botón Histórico */}
          <button className="btn btn-sm"
            style={{ background: "#f1f5f9", color: "#64748b", border: "none" }}
            onClick={() => navigate("/estadoxsolicitud", { state: { id_solicitud: r.id_solicitud } })}
            title="Ver historial">
            <i className="fas fa-history"></i>
          </button>
          {/* Botón Editar — solo si estado es generado o aceptado */}
          <button className="btn btn-sm"
            style={{ 
              background: ['generado', 'aceptado'].includes(r.ultimoEstado) ? "#dbeafe" : "#f1f5f9", 
              color: ['generado', 'aceptado'].includes(r.ultimoEstado) ? "#0077B6" : "#94a3b8", 
              border: "none",
              opacity: ['generado', 'aceptado'].includes(r.ultimoEstado) ? 1 : 0.5
            }}
            data-bs-toggle={['generado', 'aceptado'].includes(r.ultimoEstado) ? "modal" : ""}
            data-bs-target={['generado', 'aceptado'].includes(r.ultimoEstado) ? "#modalSolicitud" : ""}
            onClick={() => {
              if (!['generado', 'aceptado'].includes(r.ultimoEstado)) {
                Swal.fire({
                  icon: "info", title: "Edición no permitida",
                  text: `No se puede editar una solicitud que ya está en estado ${r.ultimoEstado.toUpperCase()}.`
                });
              } else {
                setSelectedSolicitud(r);
              }
            }}
            disabled={!['generado', 'aceptado'].includes(r.ultimoEstado)}
            title={['generado', 'aceptado'].includes(r.ultimoEstado) ? "Editar" : `No se puede editar en estado ${r.ultimoEstado}`}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Botón Cancelar por Solicitante — solo si está en generado y es el dueño o admin */}
          {r.ultimoEstado === "generado" && (
            <button className="btn btn-sm"
              style={{ background: "#fef2f2", color: "#dc2626", border: "none" }}
              onClick={() => cancelarPorSolicitante(r.id_solicitud)}
              title="Cancelar solicitud">
              <i className="fas fa-times-circle"></i>
            </button>
          )}
          {/* Botón Activar/Inactivar */}
          <button className="btn btn-sm"
            style={{
              background: r.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: r.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none"
            }}
            onClick={() => toggleEstado(r.id_solicitud, r.estado)}
            title={r.estado === 1 ? "Inactivar" : "Activar"}>
            <i className={`fas ${r.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // ===================== COLUMNAS PESTAÑA "GESTIONAR" (ADMIN) =====================
  const columnsGestionar = [
    { name: "ID", selector: r => r.id_solicitud, sortable: true, width: "80px" },
    {
      name: "Solicitante", width: "250px",
      cell: r => {
        const u = r.usuario;
        if (!u) return <span>-</span>;
        return (
          <div style={{ padding: "6px 0" }}>
            <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "13px" }}>{u.nombres_apellidos}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{u.rol}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{u.email}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Fecha Inicio",
      selector: r => formatDateTime(r.fecha_inicio),
      sortable: true, width: "155px", wrap: true
    },
    {
      name: "Fecha Fin",
      selector: r => formatDateTime(r.fecha_fin),
      sortable: true, width: "155px", wrap: true
    },
    {
      name: "Estado Actual", width: "150px",
      cell: r => {
        const style = getBadgeStyle(r.ultimoEstado);
        return (
          <span style={{
            background: style.bg, color: style.color,
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "99px"
          }}>
            {r.ultimoEstado || "generado"}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      cell: r => {
        const estadoActual = r.ultimoEstado || "generado";
        const siguientes = estadosSiguientes[estadoActual] || [];
        return (
          <div className="d-flex gap-2 py-1 align-items-center flex-wrap">
            {siguientes.length === 0 && <span className="text-muted small ms-1">Finalizado</span>}
            {siguientes.includes("aceptado") && (
              <button className="btn btn-sm"
                onClick={() => cambiarEstadoAdmin(r.id_solicitud, "aceptado")}
                title="Aceptar Solicitud"
                style={{ background: "#dbeafe", color: "#0077B6", border: "none", borderRadius: "20px", padding: "6px 12px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i className="fas fa-check-circle"></i> Aceptar
              </button>
            )}
            {siguientes.includes("cancelado") && (
              <button className="btn btn-sm"
                onClick={() => cambiarEstadoAdmin(r.id_solicitud, "cancelado")}
                title="Rechazar/Cancelar"
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "20px", padding: "6px 12px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i className="fas fa-times-circle"></i> Cancelar
              </button>
            )}
            {siguientes.includes("prestado") && (
              <button className="btn btn-sm"
                onClick={() => cambiarEstadoAdmin(r.id_solicitud, "prestado")}
                title="Entregar Equipo (Prestar)"
                style={{ background: "#fef3c7", color: "#d97706", border: "none", borderRadius: "20px", padding: "6px 12px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i className="fas fa-box"></i> Prestar
              </button>
            )}
            {siguientes.includes("entregado") && (
              <button className="btn btn-sm"
                onClick={() => cambiarEstadoAdmin(r.id_solicitud, "entregado")}
                title="Recibir Equipo (Liberar)"
                style={{ background: "#dcfce7", color: "#16a34a", border: "none", borderRadius: "20px", padding: "6px 12px", fontWeight: "700", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i className="fas fa-undo"></i> Recibir
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true, allowOverflow: true, button: true, width: "280px"
    }
  ];

  // ===================== EFECTOS Y FUNCIONES =====================

  useEffect(() => {
    cargarSolicitudes();
    socket.on('solicitud_actualizada', cargarSolicitudes);
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

  // Toggle estado activo/inactivo
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

  // Cancelar por solicitante — solo si está en estado "generado"
  const cancelarPorSolicitante = async (id_solicitud) => {
    const result = await Swal.fire({
      title: "¿Cancelar esta solicitud?",
      text: "Solo puedes cancelar solicitudes que aún no han sido aceptadas.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Sí, cancelar", cancelButtonText: "No",
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.post(
        `/api/solicitud/cambiarEstado/${id_solicitud}`,
        { id_estado_solicitud: mapaEstadosId["cancelado"] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      Swal.fire({ icon: "success", title: "Solicitud cancelada", timer: 1500, showConfirmButton: false });
      cargarSolicitudes();
    } catch {
      Swal.fire("Error", "No se pudo cancelar la solicitud", "error");
    }
  };

  // Cambiar estado desde pestaña Gestionar (solo admin)
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
      (item.equipos || []).some(e => 
        String(e.nom_equipo || "").toLowerCase().includes(search) ||
        String(e.marca_equipo || "").toLowerCase().includes(search) ||
        String(e.no_placa || "").toLowerCase().includes(search)
      )
    );
  });

  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Solicitudes de Préstamo</h2>
      </div>

      {/* Pestañas */}
      <div style={{ display: "flex", gap: "0", marginBottom: "20px", borderBottom: "2px solid #e2e8f0" }}>
        <button
          onClick={() => setTabActiva("solicitudes")}
          style={{
            padding: "12px 24px", border: "none", cursor: "pointer",
            fontWeight: tabActiva === "solicitudes" ? "700" : "500",
            fontSize: "14px",
            color: tabActiva === "solicitudes" ? "#0077B6" : "#64748b",
            background: tabActiva === "solicitudes" ? "#f0f9ff" : "transparent",
            borderBottom: tabActiva === "solicitudes" ? "3px solid #0077B6" : "3px solid transparent",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s"
          }}
        >
          📋 Solicitudes
        </button>
        {esAdmin && (
          <button
            onClick={() => setTabActiva("gestionar")}
            style={{
              padding: "12px 24px", border: "none", cursor: "pointer",
              fontWeight: tabActiva === "gestionar" ? "700" : "500",
              fontSize: "14px",
              color: tabActiva === "gestionar" ? "#023E8A" : "#64748b",
              background: tabActiva === "gestionar" ? "#f0f9ff" : "transparent",
              borderBottom: tabActiva === "gestionar" ? "3px solid #023E8A" : "3px solid transparent",
              borderRadius: "8px 8px 0 0",
              transition: "all 0.2s",
              display: "inline-flex", alignItems: "center", gap: "6px"
            }}
          >
            👑 Gestionar Solicitudes
          </button>
        )}
      </div>

      {/* ==================== PESTAÑA: SOLICITUDES ==================== */}
      {tabActiva === "solicitudes" && (
        <>
          <div className="row mb-3 align-items-center">
            <div className="col-md-5">
              <input type="text" className="form-control"
                placeholder="Buscar por ID, solicitante o equipo..."
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
          <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
            <DataTable
              columns={columnsSolicitudes}
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
        </>
      )}

      {/* ==================== PESTAÑA: GESTIONAR (ADMIN) ==================== */}
      {tabActiva === "gestionar" && esAdmin && (
        <>
          <div className="row mb-3 align-items-center">
            <div className="col-md-5">
              <input type="text" className="form-control"
                placeholder="Buscar por ID, solicitante o estado..."
                value={filterText} onChange={e => setFilterText(e.target.value)} />
            </div>
          </div>
          <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
            <DataTable
              columns={columnsGestionar}
              data={filtered}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              customStyles={tableCustomStyles}
              highlightOnHover striped responsive
              defaultSortFieldId={1} defaultSortAsc={false}
              noDataComponent={
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
                  <p>No hay solicitudes para gestionar</p>
                </div>
              }
              paginationPerPage={10}
            />
          </div>
        </>
      )}

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
