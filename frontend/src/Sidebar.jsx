import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Campanita from "./FormularioAcceso/Campanita.jsx";
import ecosystemLogo from "./Home/ecosystem_logo.png";
import "./Sidebar.css";

const Sidebar = ({ isAuth, logOut, users, rol, onAprobado }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userData = Array.isArray(users) ? users[0] : (users?.user || users?.data || users);
  const userName = userData?.nombres_apellidos;
  const userRol = rol || userData?.rol;

  const esAdmin = userRol === 'Administrador';
  const esGestorPasante = ['Pasante', 'Gestor'].includes(userRol);

  const handleNav = (path) => {
    if (!isAuth) { navigate("/UserLogin"); return; }
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // ===== MENU — TODO DESPLEGABLE =====
  const menuGroups = [
    {
      key: "general", icon: "🏠", text: "General", show: true,
      items: [
        { icon: "🏠", text: "Inicio", path: "/home", show: true },
        { icon: "ℹ️", text: "Acerca de Ecosystem", path: "/acerca-de", show: true },
      ]
    },
    {
      key: "solicitudes", icon: "📋", text: "Solicitudes", show: ['Aprendiz', 'Instructor', 'Administrador'].includes(userRol),
      items: [
        { icon: "📝", text: "Mis Solicitudes", path: "/solicitud", show: true },
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
        { icon: "📋", text: "Historial Equipos", path: "/historial-equipo", show: true },
        { icon: "⚙️", text: "Gestión Equipos", path: "/gestion-equipo", show: true },
      ]
    },
    {
      key: "registros", icon: "📦", text: "Registros",
      show: esAdmin || esGestorPasante,
      items: [
        { icon: "🏢", text: "Proveedores", path: "/proveedor", show: true },
        { icon: "👤", text: "Cuentadantes", path: "/cuentadante", show: true },
      ]
    },
    {
      key: "admin", icon: "👑", text: "Administración", show: esAdmin,
      items: [
        { icon: "👥", text: "Gestión Usuarios", path: "/gestion-usuarios", show: true },
        { icon: "📑", text: "Gestión Solicitudes", path: "/gestion-solicitudes", show: true },
        { icon: "🏷️", text: "Estados Solicitud", path: "/estadoSolicitud", show: true },
      ]
    },
  ];

  const avatarClass = esAdmin ? "admin" : esGestorPasante ? "gestor" : "default";

  return (
    <>
      {/* Mobile Toggle */}
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle sidebar">
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      <div className={`sidebar-overlay ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={ecosystemLogo} alt="Ecosystem Logo" />
          </div>
          <div className="sidebar-brand">
            <h5>ECOSYSTEM</h5>
            <small>Laboratorio Ambiental</small>
          </div>
        </div>

        {/* Menu — Todo ABIERTO */}
        <nav className="sidebar-menu">
          {menuGroups.filter(g => g.show).map((group) => {
            const hasActiveChild = group.items.some(i => isActive(i.path));
            return (
              <div key={group.key} style={{ marginBottom: "10px" }}>
                <div className="sidebar-group-header" style={{ padding: "10px 18px", color: "rgba(202, 240, 248, 0.5)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {group.text}
                </div>
                <div className="sidebar-submenu open" style={{ opacity: 1, maxHeight: "none" }}>
                  {group.items.filter(i => i.show).map((item, ii) => (
                    <div
                      key={ii}
                      className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                      onClick={() => handleNav(item.path)}
                    >
                      <span className="sidebar-item-icon" style={{ fontSize: "14px" }}>{item.icon}</span>
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

export default Sidebar;
