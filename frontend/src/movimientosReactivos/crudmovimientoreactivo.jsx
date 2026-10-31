// Archivo CRUD de movimientos de reactivos con tabla y modales de ingreso y salida

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar los movimientos en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa el formulario de ingreso de reactivos
import IngresoReactivoForm from "./movimientoreactivoform.jsx";
// Importa el formulario de salida de reactivos (Removido, ya se maneja en CrudSalidasReactivos)
// Importa el componente de Salidas completo
import CrudSalidasReactivos from "../salidasReactivos/crudsalidareactivo.jsx";
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
  // Estado para controlar la visibilidad del modal de ingreso
  const [showModal, setShowModal] = useState(false);
  // Estado para manejar la pestaña activa (ingresos o salidas)
  const [activeTab, setActiveTab] = useState("ingresos");

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_movimiento_reactivo, sortable: true, width: "75px", center: true },
    { name: "Reactivo", selector: (row) => row.reactivo?.nom_reactivo || "-", sortable: true, wrap: true, minWidth: "180px" },
    {
      name: "Cant. Inicial",
      sortable: true,
      minWidth: "130px",
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
    { name: "Lote", selector: (row) => row.lote || "-", sortable: true, wrap: true, minWidth: "110px" },
    { name: "Proveedor", selector: (row) => row.proveedor ? `${row.proveedor.nom_proveedor} ${row.proveedor.apel_proveedor}` : "-", sortable: true, wrap: true, minWidth: "160px" },
    { name: "Vencimiento", selector: (row) => row.fecha_vencimiento?.slice(0, 10) || "-", sortable: true, minWidth: "120px" },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
      minWidth: "110px",
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones",
      center: true,
      minWidth: "120px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Boton para editar el movimiento en el modal de ingreso */}
          <button
            className="btn btn-sm"
            style={{ background: "#dbeafe", color: "#0077B6", border: "none", padding: "5px 9px", borderRadius: "6px" }}
            onClick={() => { setSelectedMovimiento(row); setShowModal(true); }}
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
              border: "none",
              padding: "5px 9px",
              borderRadius: "6px"
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

  // ===== Carga inicial con socket =====

  // Efecto que carga los movimientos al montar y configura eventos de socket
  useEffect(() => {
    // Carga inicial de movimientos desde la API
    cargarMovimientos();

    // Escucha eventos de socket para actualizar en tiempo real
    socket.on("movimiento_actualizado", cargarMovimientos);
    socket.on("salida_actualizada", cargarMovimientos);

    // Funcion de limpieza al desmontar el componente
    return () => {
      socket.off("movimiento_actualizado", cargarMovimientos);
      socket.off("salida_actualizada", cargarMovimientos);
    };
  }, []);

  // ===== Obtener movimientos desde la API =====

  // Funcion asincrona para obtener todos los movimientos
  const cargarMovimientos = async () => {
    try {
      // Realiza la peticion GET al endpoint de movimientos
      const res = await apiAxios.get("/api/movimientos");
      // Ordena del ultimo registrado al primero (DESC por ID)
      const lista = Array.isArray(res.data)
        ? [...res.data].sort((a, b) => (b.id_movimiento_reactivo || 0) - (a.id_movimiento_reactivo || 0))
        : [];
      // Actualiza el estado con los datos obtenidos
      setMovimientos(lista);
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

  // ===== Cerrar modal de ingreso =====

  // Funcion para cerrar el modal de ingreso
  const hideModal = () => {
    setShowModal(false);
    setSelectedMovimiento(null);
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
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {/* Encabezado centrado con titulo */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ height: "3px", width: "40px", background: activeTab === "salidas" ? "#DC2626" : "#0077B6", borderRadius: "99px", margin: "0 auto 12px", transition: "background 0.25s ease" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: activeTab === "salidas" ? "#DC2626" : "#0077B6", margin: 0, transition: "color 0.25s ease" }}>
          Gestión de Inventario (Ingresos y Salidas)
        </h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra las entradas de lotes y el control de salidas de reactivos químicos.
        </p>
      </div>

      {/* Pestañas de navegacion modernas */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("ingresos")}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            border: activeTab === "ingresos" ? "none" : "1.5px solid #dbeafe",
            background: activeTab === "ingresos" ? "linear-gradient(135deg, #0077B6, #023E8A)" : "#fff",
            color: activeTab === "ingresos" ? "#fff" : "#0077B6",
            boxShadow: activeTab === "ingresos" ? "0 6px 18px rgba(0, 119, 182, 0.25)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          📥 Ingresos de Reactivos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("salidas")}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            border: activeTab === "salidas" ? "none" : "1.5px solid #fecaca",
            background: activeTab === "salidas" ? "linear-gradient(135deg, #DC2626, #991B1B)" : "#fff",
            color: activeTab === "salidas" ? "#fff" : "#DC2626",
            boxShadow: activeTab === "salidas" ? "0 6px 18px rgba(220, 38, 38, 0.25)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          📤 Salidas de Reactivos
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === "ingresos" && (
        <>
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
            <div className="col-md-7 text-end d-flex gap-2 justify-content-end mt-2 mt-md-0">
              {/* Boton para abrir el modal de nuevo ingreso */}
              <button
                className="btn"
                style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none", padding: "8px 18px" }}
                onClick={() => { setSelectedMovimiento(null); setShowModal(true); }}
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
                  <p>No hay ingresos registrados</p>
                </div>
              }
            />
          </div>
        </>
      )}

      {activeTab === "salidas" && (
        <CrudSalidasReactivos />
      )}

      {/* Modal Ingreso con estilo metalizado unificado */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "600px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  {selectedMovimiento ? "✏️ Editar Ingreso de Reactivo" : "➕ Nuevo Ingreso de Reactivo"}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  Gestiona la entrada de lotes, cantidades y fechas de vencimiento
                </p>
              </div>
              <button
                type="button"
                onClick={hideModal}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "0" }}>
              {/* Renderiza el formulario de ingreso de reactivos */}
              <IngresoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={cargarMovimientos}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default CrudmovimientoReactivo;
