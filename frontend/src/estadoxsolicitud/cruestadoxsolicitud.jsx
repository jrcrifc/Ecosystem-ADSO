// Archivo de historial de cambios de estado por solicitud

// Importa los hooks de React para manejar estado y efectos secundarios
import { useEffect, useState } from "react";
// Importa useLocation de react-router-dom para recibir parametros de navegacion
import { useLocation } from "react-router-dom";
// Importa DataTable para mostrar los registros en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Parsea la fecha desde el string ISO sin conversion de zona horaria
// Evita el bug de UTC que muestra un dia menos en UTC-5 (Colombia)
const formatFechaISO = (isoString) => {
  // Retorna guion si la cadena esta vacia o es nula
  if (!isoString) return "-";
  // Extrae solo la parte de la fecha (primeros 10 caracteres)
  const parte = isoString.substring(0, 10);
  // Divide la fecha en anio, mes y dia
  const [year, month, day] = parte.split("-");
  // Retorna la fecha en formato dia/mes/anio
  return `${parseInt(day)}/${parseInt(month)}/${year}`;
};

// Define el componente principal de historial de estados por solicitud
export default function CrudEstadoxSolicitud() {
  // Hook para obtener el estado de la navegacion
  const location = useLocation();
  // Estado que almacena el listado de registros del historial
  const [registros, setRegistros] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena la solicitud seleccionada para filtrar (si viene por navegacion)
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);

  // Obtiene los datos del usuario almacenados en sessionStorage
  const stored = sessionStorage.getItem("user");
  // Parsea los datos del usuario o lo deja como nulo si no existe
  const userData = stored ? JSON.parse(stored) : null;
  // Extrae el rol del usuario y lo convierte a minusculas
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  // Extrae el ID del usuario desde distintas posibles estructuras
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  // Determina si el usuario es administrador
  const esAdmin = userRol === "administrador" || userRol === "admin";

  // Efecto que carga los registros al montar el componente
  useEffect(() => {
    cargarRegistros();
    if (location.state?.id_solicitud) {
      setSelectedSolicitudId(location.state.id_solicitud);
      setFilterText(String(location.state.id_solicitud));
    }
  }, [location.state]);

  // ===== Obtener historial (todas las solicitudes o solo las del usuario) =====

  // Funcion asincrona para obtener los registros del historial
  const cargarRegistros = async () => {
    try {
      // Obtiene el token de autenticacion desde sessionStorage
      const token = sessionStorage.getItem("token");
      // Realiza la peticion GET al endpoint de historial con token Bearer
      const res = await apiAxios.get("/api/estadoxsolicitud", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si el usuario es admin, muestra todos los registros
      if (esAdmin) {
        setRegistros(res.data);
      } else {
        // Filtra solo las solicitudes que pertenecen al usuario actual
        const misSolicitudes = res.data.filter(r =>
          r.solicitud?.id_usuario === userId
        );
        setRegistros(misSolicitudes);
      }
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar historial:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cargar el historial de estados", "error");
    }
  };

  // ===== Estilo visual para cada estado =====

  // Funcion que retorna colores de fondo y texto segun el estado
  const getBadgeStyle = (estado) => {
    // Mapa de estilos visuales para cada posible estado
    const map = {
      generado: { bg: "#f1f5f9", color: "#475569" },
      aceptado: { bg: "#dbeafe", color: "#0077B6" },
      prestado: { bg: "#fffbeb", color: "#d97706" },
      entregado: { bg: "#ecfdf5", color: "#059669" },
      devuelto: { bg: "#ecfdf5", color: "#059669" },
      cancelado: { bg: "#fef2f2", color: "#dc2626" },
      rechazado: { bg: "#fef2f2", color: "#dc2626" },
    };
    // Retorna el estilo del estado o uno por defecto si no existe
    return map[estado] || { bg: "#f1f5f9", color: "#475569" };
  };

  // ===== Definicion de columnas de la tabla =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_estadoxsolicitud,
      sortable: true,
      width: "80px",
    },
    {
      name: "Solicitante",
      selector: (row) => row.solicitud?.usuario?.nombres_apellidos || "-",
      sortable: true,
      minWidth: "220px",
      // Oculta la columna si el usuario no es admin
      omit: !esAdmin,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => formatFechaISO(row.solicitud?.fecha_inicio),
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Fecha Fin",
      selector: (row) => formatFechaISO(row.solicitud?.fecha_fin),
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Estado",
      selector: (row) => row.estadoSolicitud?.estado || "-",
      sortable: true,
      width: "160px",
      // Renderizador personalizado para mostrar el badge de estado
      cell: (row) => {
        const style = getBadgeStyle(row.estadoSolicitud?.estado);
        return (
          <span style={{
            background: style.bg, color: style.color,
            fontSize: "11px", fontWeight: "700",
            padding: "5px 15px", borderRadius: "99px",
          }}>
            {row.estadoSolicitud?.estado || "-"}
          </span>
        );
      }
    },
    {
      name: "Fecha Cambio",
      selector: (row) => row.createdat ? new Date(row.createdat).toLocaleString() : "-",
      sortable: true,
      minWidth: "220px"
    },
  ];

  // Filtra los registros localmente segun el texto de busqueda o la solicitud seleccionada
  const filtered = registros.filter((row) => {
    if (selectedSolicitudId) {
      return row.solicitud?.id_solicitud === selectedSolicitudId;
    }
    const search = filterText.toLowerCase().trim();
    if (!search) return true;
    return [
      row.solicitud?.id_solicitud?.toString(),
      row.solicitud?.usuario?.nombres_apellidos,
      row.estadoSolicitud?.estado
    ].some((field) => field?.toLowerCase().includes(search));
  });

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      {/* Encabezado centrado con titulo segun el rol del usuario */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          {esAdmin ? "Historial de Todas las Solicitudes" : "Mi Historial de Solicitudes"}
        </h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          {/* Texto descriptivo segun el rol del usuario */}
          {esAdmin
            ? "Vista completa de todos los cambios de estado de solicitudes del sistema."
            : "Aquí puedes ver el estado de tus solicitudes realizadas."
          }
        </p>
      </div>

      {/* Campo de busqueda para filtrar registros */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, estado o solicitante..."
            value={filterText}
            onChange={(e) => {
              const val = e.target.value;
              setFilterText(val);
              if (selectedSolicitudId && val !== String(selectedSolicitudId)) {
                setSelectedSolicitudId(null);
              }
            }}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
      </div>

      {/* Alerta de filtro activo si se viene de una solicitud especifica */}
      {selectedSolicitudId && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3" style={{ borderRadius: "10px" }}>
          <span>
            <strong>Filtro activo:</strong> Mostrando el historial de la solicitud <strong>#{selectedSolicitudId}</strong>.
          </span>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => {
              setSelectedSolicitudId(null);
              setFilterText("");
            }}
          >
            Ver todas
          </button>
        </div>
      )}

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
              <p>No tienes solicitudes registradas</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
