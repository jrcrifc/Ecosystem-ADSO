// Archivo CRUD de movimientos de reactivos con tabla y modales de ingreso y salida

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar los movimientos en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa el formulario de ingreso de reactivos
import IngresoReactivoForm from "./movimientoreactivoform.jsx";
// Importa el formulario de salida de reactivos
import SalidaReactivoForm from "../salidasReactivos/salidareactivoform.jsx";
// Importa el hook de navegacion de React Router
import { useNavigate } from "react-router-dom";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";

// Define el componente CRUD de movimientos de reactivos
const CrudmovimientoReactivo = () => {
  // Hook de navegacion para redirigir a otras rutas
  const navigate = useNavigate();
  // Estado que almacena el listado de movimientos
  const [movimientos, setMovimientos] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el movimiento seleccionado para editar en el modal de ingreso
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  // Estado que almacena la salida seleccionada para editar en el modal de salida
  const [selectedSalida, setSelectedSalida] = useState(null);

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_movimiento_reactivo, sortable: true, width: "80px", center: true },
    { name: "Reactivo", selector: (row) => row.reactivo?.nom_reactivo || "-", sortable: true, minWidth: "200px" },
    {
      name: "Cant. Inicial",
      sortable: true,
      minWidth: "180px",
      // Renderizador personalizado para mostrar cantidad con unidad
      cell: (row) => (
        <span>
          {parseFloat(parseFloat(row.cantidad_inicial || 0).toFixed(3)).toString()}{" "}
          <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "600" }}>
            {row.reactivo?.presentacion_reactivo || ""}
          </span>
        </span>
      )
    },
    { name: "Lote", selector: (row) => row.lote || "-", sortable: true, minWidth: "150px" },
    { name: "Proveedor", selector: (row) => row.proveedor ? `${row.proveedor.nom_proveedor} ${row.proveedor.apel_proveedor}` : "-", sortable: true, minWidth: "200px" },
    { name: "Vencimiento", selector: (row) => row.fecha_vencimiento?.slice(0, 10) || "-", sortable: true, minWidth: "160px" },
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
      name: "Acciones",
      center: true,
      width: "140px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Boton para editar el movimiento en el modal de ingreso */}
          <button
            className="btn btn-sm"
            style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Boton para activar o inactivar el movimiento */}
          <button
            className="btn btn-sm"
            style={{
              background: row.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: row.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none"
            }}
            onClick={() => toggleEstadoMovimiento(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // ===== Carga inicial con socket y limpieza de modales =====

  // Efecto que carga los movimientos al montar y configura eventos de socket y modales
  useEffect(() => {
    // Carga inicial de movimientos desde la API
    cargarMovimientos();

    // Escucha eventos de socket para actualizar en tiempo real
    socket.on("movimiento_actualizado", cargarMovimientos);
    socket.on("salida_actualizada", cargarMovimientos);

    // Obtiene referencias a los elementos del DOM de los modales
    const modalIngreso = document.getElementById("modalIngreso");
    const modalSalida = document.getElementById("modalSalida");

    // Funcion que limpia las clases y estilos residuales de los modales
    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };

    // Manejador que limpia seleccion y backdrop al cerrar modal de ingreso
    const handleIngresoHidden = () => {
      setSelectedMovimiento(null);
      cleanupBackdrop();
    };

    // Manejador que limpia seleccion y backdrop al cerrar modal de salida
    const handleSalidaHidden = () => {
      setSelectedSalida(null);
      cleanupBackdrop();
    };

    // Agrega listeners para el evento hidden.bs.modal en ambos modales
    if (modalIngreso) {
      modalIngreso.addEventListener("hidden.bs.modal", handleIngresoHidden);
    }
    if (modalSalida) {
      modalSalida.addEventListener("hidden.bs.modal", handleSalidaHidden);
    }

    // Funcion de limpieza al desmontar el componente
    return () => {
      socket.off("movimiento_actualizado", cargarMovimientos);
      socket.off("salida_actualizada", cargarMovimientos);
      if (modalIngreso) {
        modalIngreso.removeEventListener("hidden.bs.modal", handleIngresoHidden);
      }
      if (modalSalida) {
        modalSalida.removeEventListener("hidden.bs.modal", handleSalidaHidden);
      }
    };
  }, []);

  // ===== Obtener movimientos desde la API =====

  // Funcion asincrona para obtener todos los movimientos
  const cargarMovimientos = async () => {
    try {
      // Realiza la peticion GET al endpoint de movimientos
      const res = await apiAxios.get("/api/movimientos");
      // Actualiza el estado con los datos obtenidos
      setMovimientos(res.data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar movimientos:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cargar los movimientos de los reactivos", "error");
    }
  };

  // ===== Activar/inactivar un movimiento (ingreso) de reactivo =====

  // Funcion asincrona para alternar el estado activo/inactivo de un movimiento
  const toggleEstadoMovimiento = async (movimiento) => {
    // Calcula el nuevo estado (invierte el actual)
    const nuevoEstado = movimiento.estado === 1 ? 0 : 1;
    // Define la accion segun el nuevo estado
    const accion = nuevoEstado === 1 ? "ACTIVAR" : "INACTIVAR";
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: `¿${accion} Ingreso de Reactivo?`,
      text: nuevoEstado === 0
        ? "Se desactivará este lote de ingreso. Ya no contará en el stock del reactivo ni en el control de inventario."
        : "Se reactivará este lote de ingreso. Volverá a contar en el stock del reactivo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: `Sí, ${accion.toLowerCase()}`,
      cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;

    try {
      // Verifica si se debe inactivar (nuevoEstado = 0)
      if (nuevoEstado === 0) {
        // Envia peticion DELETE para inactivar el movimiento
        await apiAxios.delete(`/api/movimientos/${movimiento.id_movimiento_reactivo}`);
      } else {
        // Envia peticion PUT para reactivar el movimiento
        await apiAxios.put(`/api/movimientos/${movimiento.id_movimiento_reactivo}`, {
          ...movimiento,
          estado: 1,
          id_reactivo: movimiento.id_reactivo || movimiento.reactivo?.id_reactivo,
          cantidad_inicial: movimiento.cantidad_inicial,
        });
      }

      // Emite evento de socket para notificar el cambio
      socket.emit("movimiento_actualizado");
      socket.emit("salida_actualizada");

      // Recarga la lista de movimientos
      cargarMovimientos();
      // Muestra mensaje de exito segun la accion realizada
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "✅ Activado" : "✅ Inactivado",
        text: nuevoEstado === 1
          ? "El movimiento ha sido reactivado y el stock recalculado"
          : "El movimiento ha sido inactivado y el stock recalculado correctamente",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      // Muestra error en consola si falla la operacion
      console.error(error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", `No se pudo ${accion.toLowerCase()} el movimiento`, "error");
    }
  };

  // ===== Cerrar modal de ingreso con limpieza de backdrop =====

  // Funcion para cerrar el modal de ingreso y limpiar backdrops residuales
  const hideModal = () => {
    // Obtiene la referencia al elemento del modal de ingreso
    const modal = document.getElementById("modalIngreso");
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
      
      // Limpieza inmediata para evitar backdrops huerfanos por re-renders rapidos de React
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  // ===== Cerrar modal de salida con limpieza de backdrop =====

  // Funcion para cerrar el modal de salida y limpiar backdrops residuales
  const hideModalSalida = () => {
    // Obtiene la referencia al elemento del modal de salida
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
      
      // Limpieza inmediata para evitar backdrops huerfanos por re-renders rapidos de React
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  // ===== Filtro local por ID, reactivo o lote =====

  // Filtra los movimientos localmente segun el texto de busqueda
  const filtered = movimientos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    // Verifica si el ID, nombre del reactivo o lote coinciden con la busqueda
    return (
      String(item.id_movimiento_reactivo || "").includes(search) ||
      String(item.reactivo?.nom_reactivo || "").toLowerCase().includes(search) ||
      String(item.lote || "").toLowerCase().includes(search)
    );
  });

  // Renderiza la interfaz del componente
  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      {/* Encabezado con barra decorativa y titulo principal */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Movimientos de Reactivos</h2>
      </div>

      {/* Barra de herramientas con campo de busqueda y botones de accion */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, reactivo o lote..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          {/* Boton para navegar al historial de salidas */}
          <button
            className="btn btn-outline-secondary"
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => navigate("/salidas")}
          >
            📜 Ver Historial de Salidas
          </button>
          {/* Boton para abrir el modal de nueva salida */}
          <button
            className="btn"
            style={{ background: "#ef4444", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalSalida"
            onClick={() => setSelectedSalida(null)}
          >
            📤 Nueva Salida
          </button>
          {/* Boton para abrir el modal de nuevo ingreso */}
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(null)}
          >
            + Nuevo Ingreso
          </button>
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
          defaultSortFieldId={1}
          defaultSortAsc={false}
          // Componente que se muestra cuando no hay datos
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay movimientos registrados</p>
            </div>
          }
        />
      </div>

      {/* Modal Ingreso */}
      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            {/* Encabezado del modal con gradiente azul */}
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", border: "none" }}>
              <h5 className="modal-title">
                {selectedMovimiento ? "Editar" : "Nuevo"} Movimiento de Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModal}
              ></button>
            </div>
            <div className="modal-body">
              {/* Renderiza el formulario de ingreso de reactivos */}
              <IngresoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={cargarMovimientos}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Salida */}
      <div className="modal fade" id="modalSalida" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            {/* Encabezado del modal con gradiente rojo */}
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #DC3545, #A4161A)", color: "#fff", border: "none" }}>
              <h5 className="modal-title">Nueva Salida de Reactivo</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModalSalida}
              ></button>
            </div>
            <div className="modal-body">
              {/* Renderiza el formulario de salida de reactivos */}
              <SalidaReactivoForm
                selectedSalida={selectedSalida}
                refreshData={cargarMovimientos}
                hideModal={hideModalSalida}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default CrudmovimientoReactivo;
