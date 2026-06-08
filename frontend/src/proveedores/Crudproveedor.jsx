// Archivo CRUD de proveedores con tabla, filtros y modal de creacion/edicion

// Importa los hooks de React para manejar estado y efectos secundarios
import { useEffect, useState } from "react";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa DataTable para mostrar los proveedores en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";
// Importa el formulario de creacion/edicion de proveedores
import ProveedorForm from "./ProveedorFrom.jsx";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Define el componente CRUD de proveedores
const Crudproveedor = () => {
  // Estado que almacena el listado de proveedores
  const [proveedor, setProveedor] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el proveedor seleccionado para editar
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Efecto que carga los proveedores al montar el componente
  useEffect(() => { cargarProveedor(); }, []);

  // ===== Obtener todos los proveedores =====

  // Funcion asincrona para obtener los proveedores desde la API
  const cargarProveedor = async () => {
    try {
      // Realiza la peticion GET al endpoint de proveedores
      const { data } = await apiAxios.get("/api/proveedor");
      // Actualiza el estado con los datos obtenidos
      setProveedor(data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error cargando proveedor", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cargar los proveedores", "error");
    }
  };

  // ===== Alternar estado activo/inactivo de un proveedor =====

  // Funcion asincrona para alternar el estado activo/inactivo de un proveedor
  const toggleEstado = async (id, estadoActual) => {
    // Calcula el nuevo estado (invierte el actual)
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    // Muestra dialogo de confirmacion al usuario
    const confirm = await Swal.fire({
      title: "¿Cambiar estado?", 
      text: `El proveedor pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar",
    });
    // Sale si el usuario cancelo la confirmacion
    if (!confirm.isConfirmed) return;
    try {
      // Envia peticion PUT para actualizar el estado del proveedor
      await apiAxios.put(`/api/proveedor/estado/${id}`, { estado: nuevoEstado });
      // Actualiza el estado local del proveedor modificado
      setProveedor(proveedor.map((p) => p.id_proveedor === id ? { ...p, estado: nuevoEstado } : p));
      // Muestra mensaje de exito
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // ===== Cerrar modal con limpieza de backdrop =====

  // Funcion para cerrar el modal de proveedor y limpiar backdrops residuales
  const hideModal = () => {
    // Obtiene la referencia al elemento del modal
    const modal = document.getElementById("modalProveedor");
    if (modal) {
      // Obtiene o crea la instancia del modal de Bootstrap y lo oculta
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      // Limpieza de clases y estilos residuales de Bootstrap
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  // ===== Definicion de columnas de la tabla =====

  // Define las columnas de la tabla con sus propiedades
  const columnas = [
    { name: "ID",        selector: (row) => row.id_proveedor,   sortable: true, width: "80px" },
    { name: "Nombre",    selector: (row) => row.nom_proveedor,  sortable: true },
    { name: "Apellido",  selector: (row) => row.apel_proveedor, sortable: true },
    { name: "Teléfono",  selector: (row) => row.tel_proveedor,  sortable: true },
    { name: "Dirección", selector: (row) => row.dir_proveedor,  sortable: true },
    {
      name: "Estado", width: "100px", center: true,
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, width: "120px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Boton para editar el proveedor */}
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal" data-bs-target="#modalProveedor" onClick={() => setSelectedProveedor(row)} title="Editar">
            <i className="fas fa-edit"></i>
          </button>
          {/* Boton para activar o inactivar el proveedor */}
          <button className="btn btn-sm" style={{ background: row.estado === 1 ? "#fee2e2" : "#dcfce7", color: row.estado === 1 ? "#dc2626" : "#16a34a", border: "none" }}
            onClick={() => toggleEstado(row.id_proveedor, row.estado)} title={row.estado === 1 ? "Inactivar" : "Activar"}>
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // ===== Filtro local por ID, nombre, apellido, telefono o direccion =====

  // Filtra los proveedores localmente segun el texto de busqueda
  const listaFiltrada = proveedor.filter((p) => {
    const search = filterText.toLowerCase().trim();
    // Verifica si varios campos coinciden con la busqueda
    return (
      String(p.id_proveedor || "").includes(search) ||
      String(p.nom_proveedor || "").toLowerCase().includes(search) ||
      String(p.apel_proveedor || "").toLowerCase().includes(search) ||
      String(p.tel_proveedor || "").toLowerCase().includes(search) ||
      String(p.dir_proveedor || "").toLowerCase().includes(search)
    );
  });

  // Renderiza la interfaz del componente
  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      {/* Encabezado con barra decorativa y titulo principal */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Proveedores</h2>
      </div>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Administra los proveedores del laboratorio</p>

      {/* Barra de herramientas con campo de busqueda y boton de nuevo proveedor */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-7">
          <input type="text" className="form-control" placeholder="Buscar por ID, nombre, apellido, teléfono..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-5 text-end">
          {/* Boton para abrir el modal de nuevo proveedor */}
          <button className="btn" data-bs-toggle="modal" data-bs-target="#modalProveedor"
            onClick={() => setSelectedProveedor(null)}
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}>
            + Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columnas}
          data={listaFiltrada}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={1}
          defaultSortAsc={false}
          // Componente que se muestra cuando no hay datos
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay proveedores registrados</p>
            </div>
          }
          paginationPerPage={10}
        />
      </div>

      {/* Modal de proveedor */}
      <div className="modal fade" id="modalProveedor" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="modal-header" style={{ background: "#023E8A", color: "#fff" }}>
              <h5 className="modal-title fw-bold">{selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              {/* Renderiza el formulario de proveedor */}
              <ProveedorForm selectedProveedor={selectedProveedor} refreshData={cargarProveedor} hideModal={hideModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default Crudproveedor;
