// Archivo CRUD de salidas de reactivos con tabla, filtros y modal de edicion

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar las salidas en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa el formulario de salida de reactivos
import SalidaReactivoForm from "./salidareactivoform.jsx";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";

// Define el componente CRUD de salidas de reactivos
const CrudSalidasReactivos = () => {
  // Estado que almacena el listado de salidas
  const [salidas, setSalidas] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena la salida seleccionada para editar
  const [selectedSalida, setSelectedSalida] = useState(null);

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_salida, sortable: true, width: "80px" },
    {
      name: "Reactivo",
      selector: (row) => row.movimiento?.reactivo?.nom_reactivo || "-",
      sortable: true, minWidth: "200px"
    },
    {
      name: "Lote",
      selector: (row) => row.movimiento?.lote || "-",
      sortable: true, minWidth: "150px"
    },
    {
      name: "Cantidad Salida",
      sortable: true,
      minWidth: "200px",
      // Renderizador personalizado para mostrar cantidad con unidad
      cell: (row) => (
        <span>
          {parseFloat(parseFloat(row.cantidad_salida || 0).toFixed(3)).toString()}{" "}
          <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "600" }}>
            {row.movimiento?.reactivo?.presentacion_reactivo || ""}
          </span>
        </span>
      )
    },
    {
      id: 5,
      name: "Fecha Salida",
      selector: (row) => row.fecha_salida ? new Date(row.fecha_salida).toLocaleString('es-CO') : "-",
      sortable: true, minWidth: "250px"
    },
    {
      name: "Observaciones",
      selector: (row) => row.observaciones || "-",
      sortable: true, minWidth: "200px",
      wrap: true
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      width: "120px",
      center: true,
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span className={`badge ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "11px", padding: "5px 10px", borderRadius: "8px" }}>
          {row.estado === 1 ? "✅ Activa" : "❌ Inactiva"}
        </span>
      )
    },
    {
      name: "Acciones", center: true, width: "120px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          {/* Boton para editar la salida (solo si esta activa) */}
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle={row.estado === 1 ? "modal" : ""}
            data-bs-target={row.estado === 1 ? "#modalSalida" : ""}
            onClick={() => row.estado === 1 && setSelectedSalida(row)}
            title={row.estado === 1 ? "Editar" : "No se puede editar una salida inactiva"}
            disabled={row.estado === 0}
            style={{ opacity: row.estado === 0 ? 0.5 : 1 }}
          >
            <i className="fas fa-pencil"></i>
          </button>
          {/* Boton para inactivar o activar segun el estado actual */}
          {row.estado === 1 ? (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => inactivarSalida(row.id_salida)}
              title="Inactivar"
            >
              <i className="fas fa-ban"></i>
            </button>
          ) : (
            <button
              className="btn btn-sm btn-success"
              onClick={() => activarSalida(row.id_salida)}
              title="Activar"
            >
              <i className="fas fa-check"></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  // Efecto que carga las salidas al montar y configura eventos de socket y modal
  useEffect(() => { 
    // Carga inicial de salidas desde la API
    cargarSalidas(); 
    
    // Escucha eventos de socket para actualizar en tiempo real
    socket.on("salida_actualizada", cargarSalidas);
    socket.on("movimiento_actualizado", cargarSalidas);

    // Obtiene la referencia al elemento del modal de salida
    const modalSalida = document.getElementById("modalSalida");

    // Funcion que limpia las clases y estilos residuales de los modales
    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };

    // Manejador que limpia seleccion y backdrop al cerrar modal
    const handleSalidaHidden = () => {
      setSelectedSalida(null);
      cleanupBackdrop();
    };

    // Agrega listener para el evento hidden.bs.modal en el modal
    if (modalSalida) {
      modalSalida.addEventListener("hidden.bs.modal", handleSalidaHidden);
    }

    // Funcion de limpieza al desmontar el componente
    return () => {
      socket.off("salida_actualizada", cargarSalidas);
      socket.off("movimiento_actualizado", cargarSalidas);
      if (modalSalida) {
        modalSalida.removeEventListener("hidden.bs.modal", handleSalidaHidden);
      }
    };
  }, []);

  // ===== Obtener todas las salidas desde la API =====

  // Funcion asincrona para obtener todas las salidas
  const cargarSalidas = async () => {
    try {
      // Realiza la peticion GET al endpoint de salidas
      const res = await apiAxios.get("/api/salidas");
      // Actualiza el estado con los datos obtenidos
      setSalidas(res.data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar salidas:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudieron cargar las salidas", "error");
    }
  };

  // ===== Inactivar salida y restaurar stock =====

  // Funcion asincrona para inactivar una salida y restaurar el stock
  const inactivarSalida = async (id) => {
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Inactivar Salida?",
      text: "Se desactivará esta salida y se restaurará la cantidad de reactivo al lote correspondiente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;

    try {
      // Envia peticion DELETE para inactivar la salida
      await apiAxios.delete(`/api/salidas/${id}`);
      
      // Emite eventos de socket para notificar el cambio
      socket.emit("salida_actualizada");
      socket.emit("movimiento_actualizado");

      // Recarga la lista de salidas
      cargarSalidas();
      // Muestra mensaje de exito
      Swal.fire({ icon: 'success', title: '✅ Inactivada', text: 'Salida inactivada y stock restaurado correctamente', timer: 2000, showConfirmButton: false });
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo inactivar la salida", "error");
    }
  };

  // ===== Activar salida y descontar stock =====

  // Funcion asincrona para activar una salida y descontar el stock
  const activarSalida = async (id) => {
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Activar Salida?",
      text: "Se volverá a activar esta salida y se descontará la cantidad de reactivo del lote correspondiente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;

    try {
      // Envia peticion PUT para activar la salida
      await apiAxios.put(`/api/salidas/estado/${id}`);
      
      // Emite eventos de socket para notificar el cambio
      socket.emit("salida_actualizada");
      socket.emit("movimiento_actualizado");

      // Recarga la lista de salidas
      cargarSalidas();
      // Muestra mensaje de exito
      Swal.fire({ icon: 'success', title: '✅ Activada', text: 'Salida activada y stock descontado correctamente', timer: 2000, showConfirmButton: false });
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", error.response?.data?.message || "No se pudo activar la salida", "error");
    }
  };

  // ===== Cerrar modal con limpieza de backdrop =====

  // Funcion para cerrar el modal de salida y limpiar backdrops residuales
  const hideModal = () => {
    // Obtiene la referencia al elemento del modal
    const modal = document.getElementById("modalSalida");
    if (modal) {
      // Intenta cerrar con el boton de cerrar del modal
      const closeBtn = modal.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.click();
      } else {
        // Usa Bootstrap API si no encuentra el boton de cerrar
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.hide();
      }
      
      // Limpieza de clases y estilos residuales de Bootstrap
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  // ===== Filtro local por ID, reactivo o lote =====

  // Filtra las salidas localmente segun el texto de busqueda
  const filtered = salidas.filter(item => {
    const search = filterText.toLowerCase().trim();
    // Verifica si el ID, nombre del reactivo o lote coinciden con la busqueda
    return (
      String(item.id_salida || "").includes(search) ||
      String(item.movimiento?.reactivo?.nom_reactivo || "").toLowerCase().includes(search) ||
      String(item.movimiento?.lote || "").toLowerCase().includes(search)
    );
  });

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      {/* Encabezado centrado con titulo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Salidas de Reactivos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Control detallado de los consumos y salidas de inventario.
        </p>
      </div>

      {/* Campo de busqueda para filtrar salidas */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text" className="form-control"
            placeholder="Buscar por ID, reactivo o lote..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-7 text-end">
          {/* Boton removido por redundancia */}
        </div>
      </div>

      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={5}
          defaultSortAsc={false}
          // Componente que se muestra cuando no hay datos
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay salidas registradas</p>
            </div>
          }
        />
      </div>

      {/* Modal de salida */}
      <div className="modal fade" id="modalSalida" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            {/* Encabezado del modal con gradiente segun sea editar o nueva */}
            <div className="modal-header" style={{ 
              background: selectedSalida 
                ? "linear-gradient(135deg, #0077B6, #023E8A)" 
                : "linear-gradient(135deg, #DC3545, #A4161A)", 
              color: "#fff",
              border: "none"
            }}>
              <h5 className="modal-title">
                {selectedSalida ? "Editar" : "Nueva"} Salida de Reactivo
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              {/* Renderiza el formulario de salida */}
              <SalidaReactivoForm
                selectedSalida={selectedSalida}
                refreshData={cargarSalidas}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default CrudSalidasReactivos;
