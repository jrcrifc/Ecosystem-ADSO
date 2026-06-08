// Archivo de historial de accesos y actividades del sistema con filtros

// Importa los hooks de React para manejar estado y efectos secundarios
import { useEffect, useState } from "react";
// Importa DataTable para mostrar los logs en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Define el componente principal de historial de actividades
export default function LogActividades() {
  // Estado que almacena el listado de registros de auditoria
  const [logs, setLogs] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que indica si los logs estan cargando
  const [loading, setLoading] = useState(true);
  // Estado que controla el filtro por tipo de actividad
  const [filterTab, setFilterTab] = useState("todos");

  // Efecto que carga los logs al montar el componente
  useEffect(() => {
    cargarLogs();
  }, []);

  // ===== Obtener registros de auditoria =====

  // Funcion asincrona para obtener los registros de auditoria
  const cargarLogs = async () => {
    try {
      // Activa el estado de carga
      setLoading(true);
      // Realiza la peticion GET al endpoint de auditoria
      const res = await apiAxios.get("/api/auditoria");
      // Actualiza el estado con los datos obtenidos
      setLogs(res.data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar auditoría:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo obtener el historial de auditoría", "error");
    } finally {
      // Desactiva el estado de carga al finalizar
      setLoading(false);
    }
  };

  // ===== Definicion de columnas de la tabla =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString(), sortable: true, width: "180px" },
    { name: "Usuario / Email", selector: (row) => row.usuario, sortable: true, minWidth: "150px" },
    { 
      name: "Acción", 
      selector: (row) => row.accion, 
      sortable: true, 
      width: "150px",
      // Renderizador personalizado para mostrar badge con gradiente segun la accion
      cell: (row) => {
        const accion = row.accion;
        let bg = 'linear-gradient(135deg, #6366f1, #4f46e5)';
        let label = accion;

        // Asigna colores y etiquetas segun el tipo de accion
        if (accion === 'LOGIN') {
          bg = 'linear-gradient(135deg, #10b981, #059669)';
          label = '🔑 LOGIN';
        } else if (accion === 'INACTIVAR_USUARIO') {
          bg = 'linear-gradient(135deg, #f43f5e, #e11d48)';
          label = '🔒 INACTIVAR';
        } else if (accion === 'ACTIVAR_USUARIO') {
          bg = 'linear-gradient(135deg, #0ea5e9, #0284c7)';
          label = '🔓 ACTIVAR';
        } else if (accion === 'APROBAR_USUARIO') {
          bg = 'linear-gradient(135deg, #10b981, #059669)';
          label = '✅ APROBAR';
        } else if (accion === 'RECHAZAR_USUARIO') {
          bg = 'linear-gradient(135deg, #f43f5e, #e11d48)';
          label = '❌ RECHAZAR';
        }

        return (
          <span 
            className="badge" 
            style={{ 
              fontSize: '10px', 
              fontWeight: '800',
              padding: '6px 12px',
              borderRadius: '99px',
              background: bg,
              color: '#fff',
              letterSpacing: '0.5px'
            }}
          >
            {label}
          </span>
        );
      }
    },
    { name: "Módulo", selector: (row) => row.modulo, sortable: true, width: "120px" },
    { name: "Detalles", selector: (row) => row.detalles || "-", sortable: false, wrap: true },
  ];

  // Filtra los logs localmente segun el texto de busqueda y el filtro por tipo
  const filteredLogs = logs.filter((row) => {
    const search = filterText.toLowerCase().trim();
    // Verifica si varios campos coinciden con la busqueda
    const matchesSearch = (
      String(row.usuario || "").toLowerCase().includes(search) ||
      String(row.accion || "").toLowerCase().includes(search) ||
      String(row.modulo || "").toLowerCase().includes(search) ||
      String(row.detalles || "").toLowerCase().includes(search)
    );

    // Sale si no coincide con la busqueda
    if (!matchesSearch) return false;

    // Aplica filtro por tipo de actividad
    if (filterTab === "login") {
      return row.accion === "LOGIN";
    }
    if (filterTab === "otros") {
      return row.accion !== "LOGIN";
    }
    return true;
  });

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4 mb-5">
      {/* Encabezado con barra decorativa y titulo principal */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Historial de Accesos y Actividades</h2>
      </div>

      {/* Tarjeta contenedora del contenido */}
      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
        {/* Botones de filtro por categoria */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            ["todos", "📋 Todos los Registros"],
            ["login", "🔑 Solo Accesos (Login)"],
            ["otros", "⚙️ Otras Actividades"]
          ].map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => setFilterTab(key)} 
              style={{
                padding: "8px 18px", 
                borderRadius: "10px", 
                border: "none", 
                cursor: "pointer",
                fontWeight: "600", 
                fontSize: "13px",
                background: filterTab === key ? "#0077B6" : "#f1f5f9",
                color: filterTab === key ? "#fff" : "#64748b",
                transition: "all 0.2s"
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Barra de busqueda y boton de actualizar */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar en el historial..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ borderRadius: "10px", border: "1px solid #e2e8f0", padding: "10px 15px" }}
            />
          </div>
          <div className="col-md-6 text-end">
            {/* Boton para recargar los logs manualmente */}
            <button className="btn btn-outline-primary" onClick={cargarLogs} disabled={loading} style={{ borderRadius: "10px", padding: "8px 20px" }}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i> Actualizar
            </button>
          </div>
        </div>

        {/* Contenedor de la tabla con bordes redondeados */}
        <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
          <DataTable
            columns={columns}
            data={filteredLogs}
            pagination
            paginationPerPage={15}
            paginationComponentOptions={paginationComponentOptions}
            customStyles={tableCustomStyles}
            highlightOnHover
            striped
            responsive
            // Componente que se muestra cuando no hay datos
            noDataComponent={
              <div className="py-5 text-center text-muted">
                <i className="fas fa-history fa-3x mb-3 opacity-25"></i>
                <p>No hay registros de actividad para mostrar</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
