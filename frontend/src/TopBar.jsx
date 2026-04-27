import React from "react";
import Campanita from "./FormularioAcceso/Campanita.jsx";

const TopBar = ({ userData, userRol, logOut, onAprobado }) => {
  const esAdmin = userRol === 'Administrador';
  const esGestorPasante = ['Pasante', 'Gestor'].includes(userRol);
  const userName = userData?.nombres_apellidos;
  const avatarBg = esAdmin ? "#023E8A" : esGestorPasante ? "#0077B6" : "#00B4D8";

  return (
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
      {/* Notificaciones */}
      <Campanita userData={userData} onAprobado={onAprobado} userRol={userRol} />

      {/* Separador */}
      <div style={{ width: "1px", height: "32px", background: "#e2e8f0" }} />

      {/* Perfil */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        cursor: "default",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "800", fontSize: "14px", color: "#fff",
          background: avatarBg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          {userName ? userName.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <p style={{
            margin: 0, fontSize: "13px", fontWeight: "600", color: "#0f172a",
            textTransform: "capitalize", lineHeight: "1.2",
          }}>
            {userName || "Usuario"}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
            {esAdmin ? "👑" : esGestorPasante ? "⚙️" : "🎓"} {userRol}
          </p>
        </div>
      </div>

      {/* Logout */}
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
        onMouseEnter={(e) => { e.target.style.background = "#fef2f2"; e.target.style.borderColor = "#fca5a5"; }}
        onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#fee2e2"; }}
      >
        ⏻
      </button>
    </div>
  );
};

export default TopBar;
