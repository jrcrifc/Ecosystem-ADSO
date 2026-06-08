// Archivo: HistorialEstadoEquipo.jsx — Historial cronológico de cambios de estado de equipos

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa useNavigate para redirigir entre rutas
import { useNavigate } from "react-router-dom";
// Importa DataTable para renderizar tablas con paginación
import DataTable from "react-data-table-component";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Componente principal del historial de estados de equipo
export default function HistorialEstadoEquipo() {
  const navigate = useNavigate();
  // Estado que almacena el listado de registros de cambios de estado
  const [registros, setRegistros] = useState([]);
  // Estado para el texto de búsqueda
  const [filterText, setFilterText] = useState("");
  // Obtiene el token de autenticación desde sessionStorage
  const token = sessionStorage.getItem("token");
  // Crea el objeto de headers con el token para las peticiones
  const headers = { Authorization: `Bearer ${token}` };
  // Efecto que carga los registros al montar el componente
  useEffect(() => { cargarRegistros(); }, []);
  // Función asíncrona para obtener el historial de cambios de estado desde la API
  const cargarRegistros = async () => {
    try {
      const res = await apiAxios.get("/api/estadoxequipo", { headers });
      setRegistros(res.data);
    } catch {
      Swal.fire("Error", "No se pudo cargar el historial", "error");
    }
  };
  // Función que devuelve la clase de color Bootstrap según el estado
  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':    return 'bg-success';
      case 'no disponible': return 'bg-danger';
      case 'mantenimiento': return 'bg-warning text-dark';
      default:              return 'bg-secondary';
    }
  };
  // Definición de las columnas de la tabla DataTable
  const columns = [
    { name: "ID", selector: r => r.id_estadoxequipo, sortable: true, width: "80px" },
    { name: "Equipo", selector: r => r.equipo?.nom_equipo || "-", sortable: true, minWidth: "200px" },
    { name: "Marca", selector: r => r.equipo?.marca_equipo || "-", sortable: true, minWidth: "150px" },
    { name: "Placa", selector: r => r.equipo?.no_placa || "-", sortable: true, minWidth: "150px" },
    {
      name: "Estado",
      sortable: true,
      width: "150px",
      // Renderiza el badge del estado con colores de Bootstrap
      cell: r => (
        <span className={`badge ${getBadgeColor(r.estadoEquipo?.estado)}`} style={{ fontSize: "0.75rem", padding: "6px 12px", borderRadius: "20px" }}>
          {r.estadoEquipo?.estado || "-"}
        </span>
      )
    },
    { name: "Fecha Cambio", selector: r => r.createdAt ? new Date(r.createdAt).toLocaleString() : "-", sortable: true, minWidth: "250px" },
  ];
  // Filtra los registros localmente según el texto de búsqueda
  const filtered = registros.filter(r => {
    const search = filterText.toLowerCase().trim();
    return (
      String(r.id_estadoxequipo || "").includes(search) ||
      String(r.id_equipo || "").includes(search) ||
      String(r.equipo?.nom_equipo || "").toLowerCase().includes(search) ||
      String(r.equipo?.marca_equipo || "").toLowerCase().includes(search) ||
      String(r.equipo?.no_placa || "").toLowerCase().includes(search) ||
      String(r.estadoEquipo?.estado || "").toLowerCase().includes(search)
    );
  });
  return (
    <div className="container mt-4" style={{ maxWidth: "1100px" }}>
      {/* Encabezado de la página con título y descripción */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Historial de Estados de Equipos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Registro cronológico de los cambios de estado de cada equipo en el sistema.
        </p>
      </div>
      {/* Fila con campo de búsqueda y botones de navegación */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-7">
          <input type="text" className="form-control"
            placeholder="Buscar por ID, equipo, placa o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-5 text-end">
          <div className="btn-group" role="group" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #0077B6" }}>
            <button 
              type="button" 
              className="btn" 
              style={{ background: "#fff", color: "#0077B6", fontWeight: "600", fontSize: "13px" }}
              onClick={() => navigate("/gestion-equipo")}
            >
              <i className="fas fa-edit me-2"></i>Gestión
            </button>
            <button type="button" className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", fontSize: "13px" }}>
              <i className="fas fa-history me-2"></i>Historial
            </button>
          </div>
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
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay registros de cambios de estado</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
