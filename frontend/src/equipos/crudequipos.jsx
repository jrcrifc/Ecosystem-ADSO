// Archivo: crudequipos.jsx — CRUD de equipos con tabla, filtros, exportación PDF/Excel y lightbox de fotos

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa useNavigate para redirigir entre rutas
import { useNavigate } from "react-router-dom";
// Importa DataTable para renderizar tablas con paginación
import DataTable from "react-data-table-component";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa el formulario de equipo para usarlo dentro del modal
import EquipoForm from "./EquiposForm.jsx";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Bootstrap para manipular modales
import * as bootstrap from "bootstrap";
// Importa Socket.io para actualizaciones en tiempo real
import socket from "../socket.js";
// Importa utilidades de exportación a PDF y Excel
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Componente principal del CRUD de equipos
export default function CrudEquipo() {
  const navigate = useNavigate();
  // Estado que almacena el listado de equipos
  const [equipos, setEquipos] = useState([]);
  // Estado para el texto de búsqueda
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el equipo seleccionado para editar
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  // Estado que almacena la ruta de la foto ampliada
  const [largePhoto, setLargePhoto] = useState(null);
  // Efecto que carga los equipos al montar y configura listeners de socket y modales
  useEffect(() => {
    getAllEquipos();
    // Escucha cambios en tiempo real para refrescar la tabla
    socket.on('equipo_actualizado', getAllEquipos);
    // Obtiene las referencias a los modales de Bootstrap
    const modalEquipo = document.getElementById("modalEquipo");
    const largePhotoModal = document.getElementById("largePhotoModal");
    // Función que limpia los backdrops huérfanos del modal
    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    // Función que se ejecuta al ocultar el modal de equipo
    const handleEquipoHidden = () => {
      setSelectedEquipo(null);
      cleanupBackdrop();
    };
    // Función que se ejecuta al ocultar el modal de foto ampliada
    const handlePhotoHidden = () => {
      setLargePhoto(null);
      cleanupBackdrop();
    };
    // Agrega listeners de ocultamiento a los modales
    if (modalEquipo) {
      modalEquipo.addEventListener("hidden.bs.modal", handleEquipoHidden);
    }
    if (largePhotoModal) {
      largePhotoModal.addEventListener("hidden.bs.modal", handlePhotoHidden);
    }
    // Limpieza de listeners al desmontar el componente
    return () => {
      socket.off('equipo_actualizado', getAllEquipos);
      if (modalEquipo) {
        modalEquipo.removeEventListener("hidden.bs.modal", handleEquipoHidden);
      }
      if (largePhotoModal) {
        largePhotoModal.removeEventListener("hidden.bs.modal", handlePhotoHidden);
      }
    };
  }, []);
  // Función asíncrona para obtener todos los equipos desde la API
  const getAllEquipos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      const res = await apiAxios.get("/api/equipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };
  // Función para alternar el estado activo/inactivo de un equipo
  const cambiarEstado = async (equipo) => {
    const nuevoEstado = equipo.estado === 1 ? 0 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El equipo pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      await apiAxios.put(
        `/api/equipos/${equipo.id_equipo}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "Activado" : "Inactivado",
        timer: 1500,
        showConfirmButton: false,
      });
      getAllEquipos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };
  // Función para cerrar un modal con limpieza de backdrop
  const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
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
  // Configuración visual de los estados operativos
  const estadoConfig = {
    disponible:      { icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", label: "Disponible" },
    mantenimiento:   { icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Mantenimiento" },
    solicitado:      { icon: "⏳", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Solicitado" },
    prestado:        { icon: "🤝", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", label: "Prestado" },
  };
  // Definición de las columnas de la tabla DataTable
  const columns = [
    { name: "ID", selector: (row) => row.id_equipo, sortable: true, width: "80px", center: true },
    { name: "Grupo", selector: (row) => row.grupo_equipo, sortable: true, minWidth: "180px" },
    { name: "Nombre", selector: (row) => row.nom_equipo, sortable: true, minWidth: "180px" },
    { name: "Marca", selector: (row) => row.marca_equipo || "-", sortable: true, minWidth: "130px" },
    {
      name: "Placa",
      selector: (row) => (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : "Sin placa",
      sortable: true,
      minWidth: "130px",
      // Renderiza la placa o un texto gris si no tiene
      cell: (row) => {
        const placa = (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : null;
        return placa
          ? <span>{placa}</span>
          : <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "12px" }}>Sin placa</span>;
      }
    },
    {
      name: "Cuentadante",
      selector: (row) => row.cuentadante
        ? `${row.cuentadante.nom_cuentadante} ${row.cuentadante.apell_cuentadante}`
        : "-",
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Foto",
      width: "120px",
      center: true,
      // Renderiza la foto del equipo con lightbox al hacer clic
      cell: (row) => (
        <div style={{ padding: "5px", cursor: row.foto_equipo ? "pointer" : "default" }}>
          {row.foto_equipo ? (
            <img
              src={row.foto_equipo.startsWith("http") ? row.foto_equipo : `http://localhost:8000/uploads/${row.foto_equipo}`}
              alt={row.nom_equipo || "Foto del equipo"}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #0077B6",
                transition: "transform 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={() => {
                setLargePhoto(row.foto_equipo);
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("largePhotoModal"));
                modal.show();
              }}
              onError={(e) => { e.target.src = "/img/no-image.png"; }}
            />
          ) : (
            <span style={{ color: "#999", fontSize: "12px" }}>Sin foto</span>
          )}
        </div>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.estadoReal || "disponible",
      sortable: true,
      center: true,
      minWidth: "150px",
      // Renderiza el badge del estado operativo con icono y color
      cell: (row) => {
        const estado = row.estadoReal || "disponible";
        const cfg = estadoConfig[estado] || estadoConfig.disponible;
        return (
          <span style={{
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            padding: "4px 12px", borderRadius: "99px", fontSize: "12px",
            fontWeight: "700"
          }}>
            {cfg.icon} {cfg.label.toUpperCase()}
          </span>
        );
      },
    },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      // Renderiza botones de editar y activar/inactivar según disponibilidad
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm" 
            style={{ 
              background: row.estaOcupado ? "#f1f5f9" : "#dbeafe", 
              color: row.estaOcupado ? "#94a3b8" : "#0077B6", 
              border: "none",
              cursor: row.estaOcupado ? "not-allowed" : "pointer"
            }}
            data-bs-toggle={row.estaOcupado ? "" : "modal"}
            data-bs-target={row.estaOcupado ? "" : "#modalEquipo"}
            onClick={() => {
              if (row.estaOcupado) {
                Swal.fire("Equipo en uso", "No se puede editar un equipo que está solicitado o prestado.", "info");
              } else {
                setSelectedEquipo(row);
              }
            }}
            title={row.estaOcupado ? "Equipo en uso" : "Editar equipo"}
          >
            <i className={`fas ${row.estaOcupado ? "fa-lock" : "fa-edit"}`}></i>
          </button>
          <button
            className="btn btn-sm" 
            style={{ 
              background: row.estaOcupado ? "#f1f5f9" : (row.estado === 1 ? "#fee2e2" : "#dcfce7"), 
              color: row.estaOcupado ? "#94a3b8" : (row.estado === 1 ? "#dc2626" : "#16a34a"), 
              border: "none",
              cursor: row.estaOcupado ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (row.estaOcupado) {
                Swal.fire("Equipo en uso", "No se puede cambiar el estado de un equipo que está solicitado o prestado.", "info");
              } else {
                cambiarEstado(row);
              }
            }}
            title={row.estaOcupado ? "Equipo en uso" : (row.estado === 1 ? "Inactivar" : "Activar")}
          >
            <i className={`fas ${row.estaOcupado ? "fa-lock" : (row.estado === 1 ? "fa-ban" : "fa-check")}`}></i>
          </button>
        </div>
      ),
    },
  ];
  // Función que formatea los datos de equipos para exportación PDF/Excel
  const formatEquiposForExport = (data) => {
    return data.map(row => ({
      "ID": row.id_equipo,
      "Grupo": row.grupo_equipo || "-",
      "Nombre": row.nom_equipo || "-",
      "Marca": row.marca_equipo || "-",
      "Placa": (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : "Sin placa",
      "Cuentadante": row.cuentadante ? `${row.cuentadante.nom_cuentadante} ${row.cuentadante.apell_cuentadante}` : "-",
      "Observaciones": row.observaciones || "-",
      "Estado Equipo": row.estado === 1 ? "Activo" : "Inactivo",
      "Estado Operativo": (row.estadoReal || "disponible").charAt(0).toUpperCase() + (row.estadoReal || "disponible").slice(1),
    }));
  };
  // Filtra los equipos localmente según el texto de búsqueda
  const filteredEquipos = equipos.filter((row) => {
    const search = filterText.toLowerCase().trim();
    const nombreCuentadante = row.cuentadante
      ? `${row.cuentadante.nom_cuentadante} ${row.cuentadante.apell_cuentadante}`
      : "";
    return (
      String(row.id_equipo || "").includes(search) ||
      String(row.nom_equipo || "").toLowerCase().includes(search) ||
      String(row.grupo_equipo || "").toLowerCase().includes(search) ||
      String(row.marca_equipo || "").toLowerCase().includes(search) ||
      String(row.no_placa || "").toLowerCase().includes(search) ||
      nombreCuentadante.toLowerCase().includes(search)
    );
  });
  return (
    <div className="container mt-4" style={{ maxWidth: "1150px" }}>
      {/* Encabezado de la página con título y descripción */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Equipos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de equipos y herramientas del laboratorio.
        </p>
      </div>
      {/* Fila con el campo de búsqueda y botones de acción */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, nombre, grupo, marca, placa o cuentadante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
          <button 
            className="btn btn-outline-primary" 
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => navigate("/gestion-equipo")}
          >
            <i className="fas fa-exchange-alt me-2"></i>Estados
          </button>
          <button className="btn btn-outline-danger" onClick={() => {
            const cols = [
              { header: "ID", dataKey: "ID" },
              { header: "Grupo", dataKey: "Grupo" },
              { header: "Nombre", dataKey: "Nombre" },
              { header: "Marca", dataKey: "Marca" },
              { header: "Placa", dataKey: "Placa" },
              { header: "Cuentadante", dataKey: "Cuentadante" },
              { header: "Observaciones", dataKey: "Observaciones" },
              { header: "Estado Equipo", dataKey: "Estado Equipo" },
              { header: "Estado Operativo", dataKey: "Estado Operativo" },
            ];
            exportToPDF(formatEquiposForExport(filteredEquipos), cols, "Inventario_Equipos", "INVENTARIO DE EQUIPOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          <button className="btn btn-outline-success" onClick={() => exportToExcel(formatEquiposForExport(filteredEquipos), "Inventario_Equipos")}>
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(null)}
          >
            <i className="fas fa-plus me-2"></i>Nuevo Equipo
          </button>
        </div>
      </div>
      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filteredEquipos}
          pagination
          paginationPerPage={10}
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
              <p>No hay equipos registrados</p>
            </div>
          }
        />
      </div>
      {/* Modal editar/crear equipo */}
      <div className="modal fade" id="modalEquipo" tabIndex="-1" aria-labelledby="modalEquipoLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-white" style={{ background: "#023E8A" }}>
              <h5 className="modal-title" id="modalEquipoLabel" style={{ fontWeight: "700" }}>
                {selectedEquipo ? "Editar Equipo" : "Registrar Nuevo Equipo"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalEquipo")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <EquipoForm
                selectedEquipo={selectedEquipo}
                refreshParent={getAllEquipos}
                hideModal={() => hideModal("modalEquipo")}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Lightbox para foto ampliada */}
      <div className="modal fade" id="largePhotoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content" style={{ background: "rgba(0,0,0,0.95)", border: "none", borderRadius: "16px" }}>
            <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
              <h6 style={{ color: "#fff", fontWeight: "600", margin: 0 }}>📷 Vista ampliada</h6>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("largePhotoModal")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center" style={{ padding: "20px 40px 40px" }}>
              {largePhoto && (
                <img
                  src={largePhoto.startsWith("http") ? largePhoto : `http://localhost:8000/uploads/${largePhoto}`}
                  alt="Foto del equipo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => { e.target.src = "/img/no-image.png"; }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
