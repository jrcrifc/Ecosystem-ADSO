// Archivo CRUD de reactivos con tabla, filtros, exportacion PDF/Excel y modal

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar los reactivos en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa el formulario de creacion/edicion de reactivos
import ReactivoForm from "./reactivosform.jsx";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";
// Importa utilidades de exportacion a PDF y Excel
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Define el componente CRUD de reactivos
const CrudReactivos = () => {
  // Estado que almacena el listado de reactivos
  const [reactivos, setReactivos] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el reactivo seleccionado para editar
  const [selectedReactivo, setSelectedReactivo] = useState(null);

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_reactivo, sortable: true, width: "80px", center: true },
    { name: "Nombre", selector: (row) => row.nom_reactivo, sortable: true, minWidth: "220px" },
    { name: "Presentación", selector: (row) => row.presentacion_reactivo, sortable: true, minWidth: "180px" },
    { name: "Cantidad", selector: (row) => row.cantidad_presentacion, sortable: true, minWidth: "150px" },
    { name: "Ubicación (S/C/F)", selector: (row) => `${row.stand || "-"} / ${row.columna || "-"} / ${row.fila || "-"}`, sortable: false, minWidth: "200px" },
    { name: "Color Stand", selector: (row) => row.color_stand, sortable: true, minWidth: "150px" },
    { name: "Clasificación", selector: (row) => row.clasificacion_reactivo, sortable: true, minWidth: "200px" },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
      width: "120px",
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span style={{
          background: row.estado === 1 ? "#dcfce7" : "#fee2e2",
          color: row.estado === 1 ? "#16a34a" : "#dc2626",
          padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700",
          border: `1px solid ${row.estado === 1 ? "#bbf7d0" : "#fecaca"}`
        }}>
          {row.estado === 1 ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, width: "140px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          {/* Boton para editar el reactivo */}
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }} data-bs-toggle="modal" data-bs-target="#modalReactivo" onClick={() => setSelectedReactivo(row)}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Boton para activar o inactivar el reactivo */}
          <button
            className="btn btn-sm"
            style={{
              background: row.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: row.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none"
            }}
            onClick={() => cambiarEstado(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // Efecto que carga los reactivos al montar el componente
  useEffect(() => { cargarReactivos(); }, []);

  // ===== Obtener todos los reactivos =====

  // Funcion asincrona para obtener los reactivos desde la API
  const cargarReactivos = async () => {
    try {
      // Realiza la peticion GET al endpoint de reactivos
      const res = await apiAxios.get("/api/reactivos");
      // Actualiza el estado con los datos obtenidos
      setReactivos(res.data);
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudieron cargar los reactivos", "error");
    }
  };

  // ===== Alternar estado activo/inactivo de un reactivo =====

  // Funcion asincrona para alternar el estado activo/inactivo de un reactivo
  const cambiarEstado = async (reactivo) => {
    // Calcula el nuevo estado (invierte el actual)
    const nuevoEstado = reactivo.estado === 1 ? 0 : 1;
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El reactivo "${reactivo.nom_reactivo}" pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;

    try {
      // Envia peticion PUT para cambiar el estado del reactivo
      await apiAxios.put(`/api/reactivos/estado/${reactivo.id_reactivo}`);
      // Muestra mensaje de exito
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "Activado" : "Inactivado",
        timer: 1500,
        showConfirmButton: false,
      });
      // Recarga la lista de reactivos
      cargarReactivos();
    } catch (error) {
      // Muestra error en consola si falla la operacion
      console.error("Error al cambiar estado:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // ===== Cerrar modal con limpieza de backdrop =====

  // Funcion para cerrar el modal de reactivo y limpiar backdrops residuales
  const hideModal = () => {
    // Obtiene la referencia al elemento del modal
    const modal = document.getElementById("modalReactivo");
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

  // Filtra los reactivos localmente segun el texto de busqueda
  const filtered = reactivos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    // Verifica si el ID, nombre o nombre en ingles coinciden con la busqueda
    return (
      String(item.id_reactivo || "").includes(search) ||
      String(item.nom_reactivo || "").toLowerCase().includes(search) ||
      String(item.nom_reactivo_ingles || "").toLowerCase().includes(search)
    );
  });

  // ===== Formatear datos para exportacion PDF/Excel =====

  // Funcion que transforma los datos al formato requerido para exportacion
  const formatDataForExport = (data) => {
    // Mapea cada fila a un objeto con las columnas para exportar
    return data.map(row => ({
      "ID": row.id_reactivo,
      "Nombre": row.nom_reactivo || "-",
      "Nombre (Inglés)": row.nom_reactivo_ingles || "-",
      "Fórmula": row.formula_reactivo || "-",
      "Presentación": row.presentacion_reactivo || "-",
      "Color Almacenamiento": row.color_almacenamiento || "-",
      "Color Stand": row.color_stand || "-",
      "Stand": row.stand || "-",
      "Columna": row.columna || "-",
      "Fila": row.fila || "-",
      "Clasificación": row.clasificacion_reactivo || "-",
      "Estado": row.estado === 1 ? "Activo" : "Inactivo",
    }));
  };

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {/* Encabezado centrado con titulo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Reactivos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de reactivos, ubicaciones y clasificaciones.
        </p>
      </div>
      {/* Barra de herramientas con busqueda y botones de exportacion */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por ID o nombre..." value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          {/* Boton para exportar a PDF */}
          <button className="btn btn-outline-danger" onClick={() => {
            // Define las columnas para el PDF
            const cols = [
              { header: "ID", dataKey: "ID" },
              { header: "Nombre", dataKey: "Nombre" },
              { header: "Nombre (Inglés)", dataKey: "Nombre (Inglés)" },
              { header: "Fórmula", dataKey: "Fórmula" },
              { header: "Presentación", dataKey: "Presentación" },
              { header: "Color Almacenamiento", dataKey: "Color Almacenamiento" },
              { header: "Color Stand", dataKey: "Color Stand" },
              { header: "Stand", dataKey: "Stand" },
              { header: "Columna", dataKey: "Columna" },
              { header: "Fila", dataKey: "Fila" },
              { header: "Clasificación", dataKey: "Clasificación" },
              { header: "Estado", dataKey: "Estado" },
            ];
            // Llama a la funcion de exportacion a PDF
            exportToPDF(formatDataForExport(filtered), cols, "Inventario_Reactivos", "INVENTARIO DE REACTIVOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          {/* Boton para exportar a Excel */}
          <button className="btn btn-outline-success" onClick={() => exportToExcel(formatDataForExport(filtered), "Inventario_Reactivos")}>
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          {/* Boton para abrir el modal de nuevo reactivo */}
          <button className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }} data-bs-toggle="modal" data-bs-target="#modalReactivo" onClick={() => setSelectedReactivo(null)}>
            + Nuevo Reactivo
          </button>
        </div>
      </div>
      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable columns={columns} data={filtered} pagination paginationPerPage={10} paginationComponentOptions={paginationComponentOptions} customStyles={tableCustomStyles} highlightOnHover striped responsive defaultSortFieldId={1} defaultSortAsc={false} noDataComponent={
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
            <p>No hay reactivos registrados</p>
          </div>
        } />
      </div>
      {/* Modal de reactivo */}
      <div className="modal fade" id="modalReactivo" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{selectedReactivo ? "Editar" : "Nuevo"} Reactivo</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              {/* Renderiza el formulario de reactivo */}
              <ReactivoForm selectedReactivo={selectedReactivo} refreshData={cargarReactivos} hideModal={hideModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default CrudReactivos;
