// Importa React para usar JSX en el componente
import React from "react";
// Importa Link de React Router para navegación sin recargar la página
import { Link } from "react-router-dom";
// Importa el componente de notificaciones Campanita
import Campanita from "./FormularioAcceso/Campanita.jsx";

// Define el componente TopBar que renderiza la barra superior con perfil y notificaciones
const TopBar = ({ userData, userRol, logOut, onAprobado }) => {
  // Verifica si el usuario tiene rol de Administrador
  const esAdmin = userRol === 'Administrador';
  // Verifica si el usuario es Pasante o Gestor
  const esGestorPasante = ['Pasante', 'Gestor'].includes(userRol);
  // Obtiene el nombre completo del usuario desde los datos
  const userName = userData?.nombres_apellidos;
  // Define el color de fondo del avatar según el rol del usuario
  const avatarBg = esAdmin ? "#023E8A" : esGestorPasante ? "#0077B6" : "#00B4D8";

  return (
    // Barra superior con diseño flex, fondo blanco y posición sticky
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "16px",
      padding: "12px 24px",
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 50,
      marginBottom: "8px",
    }}>
      {/* Campanita de notificaciones en tiempo real */}
      <Campanita userData={userData} onAprobado={onAprobado} userRol={userRol} />

      {/* Separador vertical entre notificaciones y perfil */}
      <div style={{ width: "1px", height: "32px", background: "#e2e8f0" }} />

      {/* Enlace al perfil del usuario */}
      <Link to="/perfil" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          cursor: "pointer",
        }}>
          {/* Avatar con la inicial del nombre del usuario */}
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "800", fontSize: "14px", color: "#fff",
            background: avatarBg,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            {/* Muestra la primera letra del nombre o un signo de interrogación */}
            {userName ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          {/* Contenedor con nombre y rol */}
          <div>
            {/* Nombre completo del usuario */}
            <p style={{
              margin: 0, fontSize: "13px", fontWeight: "600", color: "#0f172a",
              textTransform: "capitalize", lineHeight: "1.2",
            }}>
              {userName || "Usuario"}
            </p>
            {/* Rol con emoji según el tipo de usuario */}
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
              {esAdmin ? "👑" : esGestorPasante ? "⚙️" : "🎓"} {userRol}
            </p>
          </div>
        </div>
      </Link>

      {/* Botón de cerrar sesión */}
      <button
        onClick={logOut}
        title="Cerrar sesión"
        style={{
          background: "transparent", border: "1px solid #fee2e2",
          borderRadius: "8px", padding: "6px 10px",
          cursor: "pointer", color: "#ef4444", fontSize: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        // Cambia el fondo y borde al pasar el mouse
        onMouseEnter={(e) => { e.target.style.background = "#fef2f2"; e.target.style.borderColor = "#fca5a5"; }}
        // Restaura los estilos al retirar el mouse
        onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#fee2e2"; }}
      >
        {/* Ícono de apagado/encendido */}
        ⏻
      </button>
    </div>
  );
};

// Exporta el componente TopBar para usarlo en App.jsx
export default TopBar;
