// Importa React y el hook useState para manejar el estado del menú móvil
import React, { useState } from "react";
// Importa hooks de navegación para cambiar de ruta y detectar la ruta actual
import { useNavigate, useLocation } from "react-router-dom";

// Importa el logo de Ecosystem para la cabecera del sidebar
import ecosystemLogo from "./Home/ecosystem_logo.png";
// Importa los estilos CSS del sidebar
import "./Sidebar.css";

// Define el componente Sidebar con la barra lateral de navegación principal
const Sidebar = ({ isAuth, logOut, users, rol, onAprobado }) => {
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  // Hook para obtener la ruta actual y resaltar el item activo
  const location = useLocation();
  // Estado que controla la apertura del sidebar en dispositivos móviles
  const [mobileOpen, setMobileOpen] = useState(false);

  // Función recursiva que extrae el objeto plano del usuario desde estructuras anidadas
  const extractUser = (val) => {
    // Retorna null si el valor es nulo o indefinido
    if (!val) return null;
    // Si es un array, procesa recursivamente el primer elemento
    if (Array.isArray(val)) return extractUser(val[0]);
    // Si tiene propiedad 'user' como objeto, extrae recursivamente
    if (val.user && typeof val.user === 'object') return extractUser(val.user);
    // Si tiene propiedad 'data' como objeto, extrae recursivamente
    if (val.data && typeof val.data === 'object') return extractUser(val.data);
    // Retorna el valor tal cual si no está anidado
    return val;
  };

  // Extrae los datos normalizados del usuario o un objeto vacío como fallback
  const userData = extractUser(users) || {};
  // Obtiene el nombre completo del usuario para mostrarlo en el perfil
  const userName = userData?.nombres_apellidos || "";
  // Obtiene el rol priorizando la prop sobre el dato del usuario
  const rawRol = rol || userData?.rol || "";
  // Normaliza el rol a minúsculas sin espacios para comparaciones
  const userRolClean = String(rawRol).trim().toLowerCase();

  // Determina si el usuario tiene rol de administrador
  const esAdmin = userRolClean === 'administrador';
  // Determina si el usuario es pasante o gestor
  const esGestorPasante = ['pasante', 'gestor'].includes(userRolClean);

  // Maneja la navegación al hacer clic en un item del menú
  const handleNav = (path) => {
    // Redirige al login si el usuario no está autenticado
    if (!isAuth) { navigate("/UserLogin"); return; }
    // Navega a la ruta especificada
    navigate(path);
    // Cierra el menú móvil después de la navegación
    setMobileOpen(false);
  };

  // Verifica si una ruta es la activa comparándola con la ubicación actual
  const isActive = (path) => location.pathname === path;

  // Define los grupos del menú con sus items, visibilidad y roles permitidos
  const menuGroups = [
    {
      key: "general", icon: "🏠", text: "General", show: true,
      items: [
        { icon: "🏠", text: "Inicio", path: "/home", show: true },
        { icon: "👤", text: "Mi Perfil", path: "/perfil", show: true },
        { icon: "ℹ️", text: "Acerca de Ecosystem", path: "/acerca-de", show: true },
      ]
    },
    {
      key: "solicitudes", icon: "📋", text: "Solicitudes", show: !esGestorPasante,
      items: [
        { icon: "📝", text: "Mis Solicitudes",      path: "/solicitud",           show: !esAdmin },
        { icon: "📝", text: "Nueva Solicitud",       path: "/solicitud",           show: esAdmin },
        { icon: "📑", text: "Gestión Solicitudes",   path: "/gestion-solicitudes", show: esAdmin },
        { icon: "🏷️", text: "Estados Solicitud",    path: "/estadoSolicitud",     show: esAdmin },
      ]
    },
    {
      key: "laboratorio", icon: "🧪", text: "Laboratorio",
      show: esAdmin || esGestorPasante,
      items: [
        { icon: "⚗️", text: "Reactivos", path: "/reactivos", show: true },
        { icon: "🔄", text: "Movimiento Reactivos", path: "/movimientoreactivo", show: true },
        { icon: "📊", text: "Control Reactivos", path: "/control-reactivos", show: true },
      ]
    },
    {
      key: "equipos", icon: "🔬", text: "Equipos",
      show: esAdmin || esGestorPasante,
      items: [
        { icon: "💻", text: "Lista de Equipos", path: "/equipos", show: true },
        { icon: "🔧", text: "Estado del Equipo", path: "/estadoequipo", show: true },
        { icon: "⚙️", text: "Gestión Equipos", path: "/gestion-equipo", show: true },
      ]
    },
    {
      key: "registros", icon: "📦", text: "Registros",
      show: esAdmin,
      items: [
        { icon: "🏢", text: "Proveedores", path: "/proveedor", show: true },
        // El ítem de Cuentadantes ha sido eliminado ya que ahora los responsables son los Instructores
      ]
    },
    {
      key: "formacion", icon: "🎓", text: "Formación", show: esAdmin,
      items: [
        { icon: "📚", text: "Programas", path: "/programas", show: true },
        { icon: "📋", text: "Fichas", path: "/fichas", show: true },
        { icon: "🎓", text: "Aprendices", path: "/aprendices", show: true },
        { icon: "👨‍🏫", text: "Instructores", path: "/instructores", show: true },
      ]
    },
    {
      key: "admin", icon: "👑", text: "Administración", show: esAdmin,
      items: [
        { icon: "👥", text: "Gestión Usuarios", path: "/gestion-usuarios", show: true },
        { icon: "📜", text: "Historial de Accesos", path: "/auditoria", show: true },
      ]
    },
  ];

  // Define la clase CSS del avatar según el rol del usuario
  const avatarClass = esAdmin ? "admin" : esGestorPasante ? "gestor" : "default";

  // Obtiene el estado de aprobación del usuario
  const userEstado = userData?.estado || userData?.user?.estado;
  // Determina si el usuario está aprobado (los administradores siempre lo están)
  const esAprobado = userEstado === 'aprobado' || esAdmin;

  return (
    <>
      {/* Botón hamburguesa para abrir o cerrar el sidebar en móviles */}
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle sidebar">
        {/* Muestra el ícono de cerrar o de menú según el estado */}
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay oscuro para cerrar el sidebar al hacer clic fuera en móviles */}
      <div className={`sidebar-overlay ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* Sidebar principal con clase condicional para móvil */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Cabecera con el logo y el nombre de la aplicación */}
        <div className="sidebar-header">
          {/* Contenedor del logo */}
          <div className="sidebar-logo">
            <img src={ecosystemLogo} alt="Ecosystem Logo" />
          </div>
          {/* Nombre y subtítulo de la marca */}
          <div className="sidebar-brand">
            <h5>ECOSYSTEM</h5>
            <small>Laboratorio Ambiental</small>
          </div>
        </div>

        {/* Menú de navegación principal */}
        <nav className="sidebar-menu">
          {/* Filtra los grupos según visibilidad y estado de aprobación del usuario */}
          {menuGroups
            .filter(g => {
              // Oculta el grupo si no debe mostrarse según el rol
              if (!g.show) return false;
              // Si no está aprobado, solo muestra el grupo General
              if (!esAprobado && g.key !== 'general') return false;
              return true;
            })
            .map((group) => {
              return (
                // Contenedor de cada grupo del menú
                <div key={group.key} style={{ marginBottom: "10px" }}>
                  {/* Encabezado del grupo en mayúsculas y color tenue */}
                  <div className="sidebar-group-header" style={{ padding: "10px 18px", color: "rgba(202, 240, 248, 0.5)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {group.text}
                  </div>
                  {/* Submenú siempre abierto con los items del grupo */}
                  <div className="sidebar-submenu open" style={{ opacity: 1, maxHeight: "none" }}>
                    {/* Filtra y renderiza los items visibles */}
                    {group.items.filter(i => i.show).map((item, ii) => (
                      // Item del menú con clase active si corresponde a la ruta actual
                      <div
                        key={ii}
                        className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                        onClick={() => handleNav(item.path)}
                      >
                        {/* Ícono del item */}
                        <span className="sidebar-item-icon" style={{ fontSize: "14px" }}>{item.icon}</span>
                        {/* Texto descriptivo del item */}
                        <span className="sidebar-item-text">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </nav>
      </aside>
    </>
  );
};

// Exporta el componente Sidebar para usarlo en App.jsx
export default Sidebar;
