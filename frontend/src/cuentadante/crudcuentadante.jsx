// Archivo: crudcuentadante.jsx — CRUD de cuentadantes con tabla, filtros y modal de creación/edición

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa DataTable para renderizar tablas con paginación
import DataTable from "react-data-table-component";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa el formulario de cuentadante para usarlo dentro del modal
import CuentadanteForm from "./cuentadanteForm.jsx";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Bootstrap para manipular modales
import * as bootstrap from "bootstrap";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Componente principal del CRUD de cuentadantes
export default function CrudCuentadante() {
  // Estado que almacena el listado de cuentadantes
  const [cuentadantes, setCuentadantes] = useState([]);
  // Estado para el texto de búsqueda
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el cuentadante seleccionado para editar
  const [selectedCuentadante, setSelectedCuentadante] = useState(null);
  // Efecto que carga los cuentadantes al montar el componente
  useEffect(() => {
    cargarCuentadantes();
  }, []);
  // Función asíncrona para obtener todos los cuentadantes desde la API
  const cargarCuentadantes = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.get("/api/cuentadante", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCuentadantes(res.data);
    } catch (error) {
      console.error("Error al cargar cuentadantes:", error);
      Swal.fire("Error", "No se pudieron cargar los cuentadantes", "error");
    }
  };
  // Función para cerrar el modal con limpieza de backdrop
  const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };
  // Función para alternar el estado activo/inactivo de un cuentadante
  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const result = await Swal.fire({
      title: `¿${nuevoEstado === 'activo' ? 'Activar' : 'Inactivar'} cuentadante?`,
      text: `El cuentadante será marcado como ${nuevoEstado}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 'activo' ? "#10b981" : "#f59e0b",
      confirmButtonText: nuevoEstado === 'activo' ? "Sí, activar" : "Sí, inactivar",
      cancelButtonText: "Cancelar"
    });
    // Sale si el usuario canceló la operación
    if (!result.isConfirmed) return;
    try {
      const token = sessionStorage.getItem("token");
      await apiAxios.put(`/api/cuentadante/toggle-estado/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 'activo' ? "Activado" : "Inactivado",
        text: `Cuentadante ${nuevoEstado} correctamente`,
        timer: 1500,
        showConfirmButton: false
      });
      cargarCuentadantes();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado del cuentadante", "error");
    }
  };
  // Definición de las columnas de la tabla DataTable
  const columns = [
    { name: "ID", selector: row => row.id_cuentadante, sortable: true, width: "80px" },
    { name: "Nombre", selector: row => row.nom_cuentadante, sortable: true },
    { name: "Apellido", selector: row => row.apell_cuentadante, sortable: true },
    { name: "Nombre Completo", selector: row => `${row.nom_cuentadante} ${row.apell_cuentadante}`, wrap: true },
    { name: "Telefono", selector: row => row.tel_cuentadante, sortable: true },
    {
      name: "Estado",
      center: true,
      width: "130px",
      // Renderiza el badge del estado con indicador de color
      cell: (row) => {
        const activo = (row.estado || 'activo') === 'activo';
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: "700",
            background: activo ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
            color: activo ? "#059669" : "#d97706",
            border: `1px solid ${activo ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: activo ? "#10b981" : "#f59e0b"
            }} />
            {activo ? "Activo" : "Inactivo"}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      // Renderiza los botones de editar y activar/inactivar
      cell: (row) => {
        const activo = (row.estado || 'activo') === 'activo';
        return (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-sm btn-warning"
              data-bs-toggle="modal"
              data-bs-target="#modalCuentadante"
              onClick={() => setSelectedCuentadante(row)}
              title="Editar"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className={`btn btn-sm ${activo ? 'btn-outline-secondary' : 'btn-outline-success'}`}
              onClick={() => toggleEstado(row.id_cuentadante, row.estado || 'activo')}
              title={activo ? "Inactivar" : "Activar"}
              style={{
                borderRadius: "8px",
                minWidth: "34px",
              }}
            >
              <i className={`fas ${activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} 
                 style={{ fontSize: "16px", color: activo ? "#10b981" : "#94a3b8" }}></i>
            </button>
          </div>
        );
      }
    }
  ];
  // Filtra los cuentadantes localmente según el texto de búsqueda
  const filteredCuentadantes = cuentadantes.filter(row => {
    const search = filterText.toLowerCase().trim();
    return (
      String(row.id_cuentadante || "").includes(search) ||
      String(row.nom_cuentadante || "").toLowerCase().includes(search) ||
      String(row.apell_cuentadante || "").toLowerCase().includes(search) ||
      `${row.nom_cuentadante} ${row.apell_cuentadante}`.toLowerCase().includes(search)
    );
  });
  return (
  <div className="container mt-4">
    {/* Encabezado de la página con barra decorativa y título */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
      <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Cuentadante</h2>
    </div>
    {/* Fila con el campo de búsqueda y botón de nuevo cuentadante */}
    <div className="row mb-4 align-items-center">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID, nombre o apellido..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
        />
      </div>
      <div className="col-md-6 text-end">
        <button
          className="btn"
          style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
          data-bs-toggle="modal"
          data-bs-target="#modalCuentadante"
          onClick={() => setSelectedCuentadante(null)}
        >
          <i className="fas fa-plus me-2"></i>Nuevo Cuentadante
        </button>
      </div>
    </div>
    {/* Contenedor de la tabla con bordes redondeados */}
    <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
      <DataTable
        columns={columns}
        data={filteredCuentadantes}
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
            <p>No hay cuentadantes registrados</p>
          </div>
        }
      />
    </div>
    {/* Modal crear/editar cuentadante */}
    <div className="modal fade" id="modalCuentadante" tabIndex="-1" aria-labelledby="modalCuentadanteLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalCuentadanteLabel">
              {selectedCuentadante ? "Editar Cuentadante" : "Registrar Nuevo Cuentadante"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              onClick={() => hideModal("modalCuentadante")}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <CuentadanteForm
              selectedCuentadante={selectedCuentadante}
              refreshParent={cargarCuentadantes}
              hideModal={() => hideModal("modalCuentadante")}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
