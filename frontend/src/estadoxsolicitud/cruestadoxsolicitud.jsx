// Archivo de historial de cambios de estado por solicitud

// Importa los hooks de React para manejar estado y efectos secundarios
import { useEffect, useState } from "react";
// Importa useLocation y useNavigate de react-router-dom para navegacion
import { useLocation, useNavigate } from "react-router-dom";
// Importa DataTable para mostrar los registros en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
// Importa el socket para actualizaciones en tiempo real
import socket from "../socket.js";

// Función que formatea una fecha ISO en dos líneas: fecha arriba, hora abajo
const formatDateCompact = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return { fecha: isoString.substring(0, 10), hora: "07:00 AM" };
  }
  const fecha = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { fecha, hora };
};

// Define el componente principal de historial de estados por solicitud
export default function CrudEstadoxSolicitud() {
  // Hook para obtener el estado de la navegacion
  const location = useLocation();
  // Hook para navegar entre rutas
  const navigate = useNavigate();
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
  const esPasante = userRol === "pasante";
  const esGestor = userRol === "gestor";
  // Solo el administrador ve el historial global de todas las solicitudes; los demás solo el suyo
  const puedeVerTodos = esAdmin;

  // Efecto que carga los registros al montar el componente
  useEffect(() => {
    cargarRegistros();
    if (location.state?.id_solicitud) {
      setSelectedSolicitudId(location.state.id_solicitud);
      setFilterText(String(location.state.id_solicitud));
    }
  }, [location.state]);

  // Efecto para escuchar el evento de socket 'solicitud_actualizada' y recargar automaticamente
  useEffect(() => {
    // Handler que recarga los registros cuando el servidor emite el evento
    const handleActualizacion = () => {
      cargarRegistros();
    };
    // Suscribe al evento de actualizacion de solicitud en tiempo real
    socket.on("solicitud_actualizada", handleActualizacion);
    // Limpieza: elimina el listener al desmontar el componente
    return () => {
      socket.off("solicitud_actualizada", handleActualizacion);
    };
  }, []);

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

      // Si el usuario es admin/gestor/pasante, muestra todos los registros
      if (puedeVerTodos) {
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
      name: "Solicitante",
      minWidth: "220px", center: true,
      cell: r => {
        const u = r.solicitud?.usuario;
        if (!u) return <span>-</span>;
        return (
          <div style={{ padding: "6px 0", textAlign: "center" }}>
            <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "13px" }}>{u.nombres_apellidos}</div>
            <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "600", marginTop: "2px" }}>{u.rol}</div>
          </div>
        );
      },
      sortable: true,
      omit: !puedeVerTodos, // Oculta la columna si el usuario solo ve las suyas
    },
    {
      name: "Equipo(s)",
      minWidth: "200px", center: true,
      cell: r => {
        const equipos = r.solicitud?.equipos;
        if (!equipos || equipos.length === 0) return <span className="text-muted small">-</span>;
        return (
          <div style={{ padding: "6px 0", display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
            {equipos.map(eq => (
              <div key={eq.id_equipo} style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600" }}>
                • {eq.nom_equipo}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      name: "Fecha Recogida",
      minWidth: "190px", center: true,
      cell: r => {
        const f = formatDateCompact(r.solicitud?.fecha_inicio);
        if (f === "-") return "-";
        return (
          <div style={{ lineHeight: "1.4", textAlign: "center" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#0f172a" }}>{f.fecha}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{f.hora}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Fecha Devolución",
      minWidth: "210px", center: true,
      cell: r => {
        const f = formatDateCompact(r.solicitud?.fecha_fin);
        if (f === "-") return "-";
        return (
          <div style={{ lineHeight: "1.4", textAlign: "center" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#0f172a" }}>{f.fecha}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{f.hora}</div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Estado",
      minWidth: "130px", center: true,
      cell: (row) => {
        const estadoActual = row.estadoSolicitud?.estado || "generado";
        const c = getBadgeStyle(estadoActual);
        return (
          <span style={{
            padding: "5px 12px", borderRadius: 20, fontSize: "0.75rem",
            fontWeight: 700, backgroundColor: c.bg, color: c.color,
            display: "inline-block"
          }}>
            {estadoActual}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Fecha Cambio",
      minWidth: "160px", center: true,
      cell: r => {
        const f = formatDateCompact(r.createdat);
        if (f === "-") return "-";
        return (
          <div style={{ lineHeight: "1.4", textAlign: "center" }}>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#0f172a" }}>{f.fecha}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{f.hora}</div>
          </div>
        );
      },
      sortable: true,
    },
  ];

  // Filtra los registros localmente segun el texto de busqueda o la solicitud seleccionada
  const filtered = registros.filter((row) => {
    if (selectedSolicitudId && filterText === String(selectedSolicitudId)) {
      return row.solicitud?.id_solicitud === selectedSolicitudId;
    }
    const search = filterText.toLowerCase().trim();
    if (!search) return true;
    return [
      row.solicitud?.id_solicitud?.toString(),
      row.solicitud?.usuario?.nombres_apellidos,
      row.estadoSolicitud?.estado,
      ...(row.solicitud?.equipos?.map(eq => eq.nom_equipo) || [])
    ].some((field) => field?.toLowerCase().includes(search));
  });

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {/* Encabezado con boton de regreso y titulo segun el rol del usuario */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: "32px" }}>
        {/* Boton de flecha para regresar a la pagina de solicitudes */}
        <button
          onClick={() => navigate("/solicitud")}
          title="Volver a Solicitudes"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#e0f2fe",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "20px",
            color: "#0077B6",
            boxShadow: "0 2px 8px rgba(0,119,182,0.15)",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#bae6fd"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#e0f2fe"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
        >
          ←
        </button>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          {puedeVerTodos ? "Historial de Todas las Solicitudes" : "Mi Historial de Solicitudes"}
        </h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          {/* Texto descriptivo segun el rol del usuario */}
          {puedeVerTodos
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
            placeholder="Buscar por ID, estado, equipo o solicitante..."
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
        {selectedSolicitudId && filterText === String(selectedSolicitudId) && (
          <div className="col-md-6 text-end">
            <span className="badge bg-primary px-3 py-2" style={{ fontSize: "14px" }}>
              Filtrando Solicitud #{selectedSolicitudId}
            </span>
          </div>
        )}
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
              <p>No tienes solicitudes registradas</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
