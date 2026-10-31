// Archivo CRUD de salidas de reactivos con tabla, filtros y modal de edicion

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar las salidas en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa el formulario de salida de reactivos
import SalidaReactivoForm from "./salidareactivoform.jsx";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";
// Importa el hook useNavigate de react-router-dom
import { useNavigate } from "react-router-dom";

// Define el componente CRUD de salidas de reactivos
const CrudSalidasReactivos = () => {
  // Hook de navegacion
  const navigate = useNavigate();
  // Estado que almacena el listado de salidas
  const [salidas, setSalidas] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena la salida seleccionada para editar
  const [selectedSalida, setSelectedSalida] = useState(null);
  // Estado para controlar la visibilidad del modal de salida
  const [showModal, setShowModal] = useState(false);

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_salida, sortable: true, width: "75px", center: true },
    {
      name: "Reactivo",
      selector: (row) => row.movimiento?.reactivo?.nom_reactivo || "-",
      sortable: true,
      wrap: true,
      minWidth: "180px"
    },
    {
      name: "Lote",
      selector: (row) => row.movimiento?.lote || "-",
      sortable: true,
      minWidth: "120px"
    },
    {
      name: "Cantidad Salida",
      sortable: true,
      minWidth: "150px",
      // Renderizador personalizado para mostrar cantidad con unidad
      cell: (row) => (
        <span>
          {parseFloat(parseFloat(row.cantidad_salida || 0).toFixed(3)).toString()}{" "}
          <span style={{ fontSize: "11px", color: "#DC2626", fontWeight: "600" }}>
            {row.movimiento?.reactivo?.presentacion_reactivo || ""}
          </span>
        </span>
      )
    },
    {
      id: 5,
      name: "Fecha Salida",
      selector: (row) => row.fecha_salida ? new Date(row.fecha_salida).toLocaleString('es-CO') : "-",
      sortable: true,
      minWidth: "180px"
    },
    {
      name: "Observaciones",
      selector: (row) => row.observaciones || "-",
      sortable: true,
      minWidth: "180px",
      wrap: true
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      minWidth: "110px",
      center: true,
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      )
    },
    {
      name: "Acciones",
      center: true,
      minWidth: "120px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Boton para editar la salida (solo si esta activa) */}
          <button
            className="btn btn-sm"
            style={{ 
              background: row.estado === 1 ? "#dbeafe" : "#f1f5f9", 
              color: row.estado === 1 ? "#0077B6" : "#94a3b8", 
              border: "none",
              padding: "5px 9px",
              borderRadius: "6px",
              cursor: row.estado === 0 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (row.estado === 1) {
                setSelectedSalida(row);
                setShowModal(true);
              }
            }}
            title={row.estado === 1 ? "Editar" : "No se puede editar una salida inactiva"}
            disabled={row.estado === 0}
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Boton para inactivar o activar segun el estado actual */}
          <button
            className="btn btn-sm"
            style={{
              background: row.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: row.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none",
              padding: "5px 9px",
              borderRadius: "6px"
            }}
            onClick={() => row.estado === 1 ? inactivarSalida(row.id_salida) : activarSalida(row.id_salida)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // Efecto que carga las salidas al montar y configura eventos de socket
  useEffect(() => { 
    // Carga inicial de salidas desde la API
    cargarSalidas(); 
    
    // Escucha eventos de socket para actualizar en tiempo real
    socket.on("salida_actualizada", cargarSalidas);
    socket.on("movimiento_actualizado", cargarSalidas);

    // Funcion de limpieza al desmontar el componente
    return () => {
      socket.off("salida_actualizada", cargarSalidas);
      socket.off("movimiento_actualizado", cargarSalidas);
    };
  }, []);

  // ===== Obtener todas las salidas desde la API =====

  // Funcion asincrona para obtener todas las salidas
  const cargarSalidas = async () => {
    try {
      // Realiza la peticion GET al endpoint de salidas
      const res = await apiAxios.get("/api/salidas");
      // Ordena del ultimo registrado al primero (DESC por ID)
      const lista = Array.isArray(res.data)
        ? [...res.data].sort((a, b) => (b.id_salida || 0) - (a.id_salida || 0))
        : [];
      // Actualiza el estado con los datos obtenidos
      setSalidas(lista);
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

  // ===== Cerrar modal =====

  // Funcion para cerrar el modal de salida
  const hideModal = () => {
    setShowModal(false);
    setSelectedSalida(null);
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
    <div style={{ padding: "0" }}>
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
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end mt-2 mt-md-0">
          {/* Boton para abrir el modal de nueva salida */}
          <button
            className="btn"
            style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none", padding: "8px 18px" }}
            onClick={() => { setSelectedSalida(null); setShowModal(true); }}
          >
            + Nueva Salida
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
              <p>No hay salidas registradas</p>
            </div>
          }
        />
      </div>

      {/* Modal de salida con estilo metalizado rojo unificado */}
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
            {/* Encabezado del modal con gradiente rojo metalizado */}
            <div style={{ 
              background: "linear-gradient(135deg, #DC2626, #991B1B)", 
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  {selectedSalida ? "✏️ Editar Salida de Reactivo" : "📤 Nueva Salida de Reactivo"}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "12px" }}>
                  Registra el consumo de reactivos con rotación inteligente de lotes (FEFO)
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
              {/* Renderiza el formulario de salida */}
              <SalidaReactivoForm
                selectedSalida={selectedSalida}
                refreshData={cargarSalidas}
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
export default CrudSalidasReactivos;
