// Importa React y los hooks useEffect y useState para efectos y estado
import React, { useEffect, useState } from "react";
// Importa el logo de Ecosystem para mostrarlo en el hero
import ecosystemLogo from "./ecosystem_logo.png";
// Importa el componente de gráficas del dashboard
import DashboardCharts from "./DashboardCharts.jsx";
// Importa la instancia de Axios configurada para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas
import Swal from "sweetalert2";
// Importa Link de React Router para navegación entre páginas
import { Link } from "react-router-dom";

// Define el componente Home que renderiza el dashboard principal del sistema
const Home = () => {
  // Estado que controla la visibilidad del hero con animación de entrada
  const [heroVisible, setHeroVisible] = useState(false);
  // Estado que controla la visibilidad de las secciones inferiores
  const [sectionsVisible, setSectionsVisible] = useState(false);
  // Estado con los datos del resumen de novedades para el administrador
  const [resumenData, setResumenData] = useState({
    reactivosPorVencer: 0,
    usuariosPendientes: 0,
    solicitudesPendientes: 0
  });

  // Lee los datos del usuario desde sessionStorage
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;

  // Obtiene el rol del usuario con fallback a Aprendiz
  const userRol = (userData?.user?.rol || userData?.rol || "Aprendiz");
  const userRolLower = userRol.toLowerCase();
  // Obtiene el nombre del usuario para el saludo del hero
  const userName = userData?.user?.nombres_apellidos || userData?.nombres_apellidos || "Usuario";

  // Banderas booleanas para controlar la visibilidad según el rol
  const esAdmin = userRolLower === "administrador" || userRolLower === "admin";
  const esGestor = userRolLower === "gestor";
  const esInstructor = userRolLower === "instructor";
  const esPasante = userRolLower === "pasante";
  const esAprendiz = userRolLower === "aprendiz";

  // Activa las animaciones de entrada al montar el componente
  useEffect(() => {
    setHeroVisible(true);
    setTimeout(() => setSectionsVisible(true), 400);
  }, []);

  // Efecto que carga el resumen de novedades solo si el usuario es administrador
  useEffect(() => {
    // Sale si el usuario no es administrador
    if (!esAdmin) return;

    // Función asíncrona que obtiene estadísticas y usuarios del backend
    const fetchResumen = async () => {
      try {
        // Realiza peticiones paralelas de estadísticas y lista de usuarios
        const [statsRes, usersRes] = await Promise.all([
          apiAxios.get("/api/dashboard/stats"),
          apiAxios.get("/api/auth/usuarios")
        ]);

        const stats = statsRes.data;
        const users = usersRes.data;

        // Calcula los indicadores: reactivos por vencer, usuarios pendientes y solicitudes activas
        const reactivosPorVencer = stats.vencimientos?.length || 0;
        const usuariosPendientes = users.filter(u => u.estado === "pendiente").length;
        const solicitudesPendientes = stats.solicitudes?.find(s => s.estado === 1)?.count || 0;

        // Actualiza el estado del resumen con los indicadores calculados
        setResumenData({
          reactivosPorVencer,
          usuariosPendientes,
          solicitudesPendientes
        });
      } catch (error) {
        console.error("Error cargando resumen para admin", error);
      }
    };

    fetchResumen();
  }, [esAdmin]);

  // Etiqueta legible para mostrar el rol del usuario en el hero
  const rolLabel = {
    administrador: "Administrador",
    admin: "Administrador",
    gestor: "Gestor de SENA Empresa",
    pasante: "Pasante",
    instructor: "Instructor",
    aprendiz: "Aprendiz",
  };

  // Define las tarjetas de acceso rápido filtradas según el rol del usuario
  const cards = [
    { show: esAprendiz || esInstructor, icon: "📋", title: "Nueva Solicitud", desc: "Crea solicitudes de préstamo.", color: "#0077B6", href: "/solicitud" },
    { show: esAdmin, icon: "📋", title: "Nueva Solicitud", desc: "Registra solicitud por un solicitante.", color: "#0077B6", href: "/solicitud" },
    { show: esAdmin, icon: "📊", title: "Gestión Solicitudes", desc: "Revisa y aprueba solicitudes.", color: "#0096C7", href: "/gestion-solicitudes" },
    { show: esAdmin || esGestor || esPasante, icon: "🧪", title: "Reactivos", desc: "Gestión de stock de reactivos.", color: "#00B4D8", href: "/reactivos" },
    { show: esAdmin || esGestor || esPasante, icon: "🔬", title: "Equipos", desc: "Administración de equipos.", color: "#023E8A", href: "/equipos" },
    { show: esAdmin, icon: "👥", title: "Usuarios", desc: "Administra permisos y roles.", color: "#0353A4", href: "/gestion-usuarios" },
    { show: esAdmin, icon: "🏢", title: "Proveedores", desc: "Administra proveedores.", color: "#48CAE4", href: "/proveedor" },
    { show: esAprendiz || esInstructor, icon: "📁", title: "Mi Historial", desc: "Estado de tus solicitudes.", color: "#1d4ed8", href: "/estadoxsolicitud" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f7ff", minHeight: "100vh", padding: "20px" }}>

      {/* Define la animación fadeUp para las secciones */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Hero de bienvenida con gradiente azul y animación de entrada */}
      <div style={{
        position: "relative", borderRadius: "24px", overflow: "hidden",
        minHeight: "320px", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #0096C7 100%)",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        marginBottom: "30px", boxShadow: "0 20px 40px rgba(2,62,138,0.2)"
      }}>
        {/* Contenido textual del hero */}
        <div style={{ position: "relative", zIndex: 2, padding: "40px", maxWidth: "600px" }}>
          {/* Etiqueta SENA Laboratorio Ambiental */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "20px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48CAE4" }} />
            <span style={{ color: "#CAF0F8", fontSize: "10px", fontWeight: "700", letterSpacing: "2px" }}>
              SENA · LABORATORIO AMBIENTAL
            </span>
          </div>

          {/* Saludo personalizado al usuario */}
          <h1 style={{ color: "#fff", fontSize: "38px", fontWeight: "800", margin: "0 0 10px" }}>
            Hola, {userName.split(" ")[0]} 👋
          </h1>

          {/* Etiqueta con el rol del usuario */}
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px",
            padding: "4px 12px", marginBottom: "15px"
          }}>
            <span style={{ color: "#CAF0F8", fontSize: "12px", fontWeight: "700" }}>
              {rolLabel[userRolLower] || userRol}
            </span>
          </div>

          {/* Texto de bienvenida */}
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Bienvenido a tu panel de control. Selecciona una acción rápida para comenzar.
          </p>
        </div>

        {/* Logo flotante de Ecosystem en la esquina derecha */}
        <div style={{
          position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)",
          width: "120px", height: "120px", borderRadius: "24px",
          background: "rgba(255,255,255,0.1)", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)"
        }}>
          <img src={ecosystemLogo} alt="Ecosystem" style={{ width: "80px", height: "80px", borderRadius: "14px" }} />
        </div>
      </div>

      {/* Resumen de novedades exclusivo para administradores */}
      {esAdmin && (
        <div style={{
          background: "#fff", borderRadius: "18px", padding: "24px",
          border: "1px solid #e2e8f0",
          borderLeft: (resumenData.reactivosPorVencer > 0 || resumenData.usuariosPendientes > 0 || resumenData.solicitudesPendientes > 0) ? "5px solid #0077B6" : "5px solid #10b981",
          marginBottom: "30px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.1s"
        }}>
          {/* Título del resumen */}
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0A1628", margin: "0 0 15px 0" }}>
            📢 Resumen de Novedades
          </h2>
          {/* Indicadores de novedades */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#334155" }}>
            {/* Si todo está al día, muestra mensaje positivo */}
            {(resumenData.reactivosPorVencer === 0 && resumenData.usuariosPendientes === 0 && resumenData.solicitudesPendientes === 0) ? (
              <div style={{ color: "#047857", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✅</span> Todo está al día. No hay pendientes por revisar.
              </div>
            ) : (
              <>
                {/* Muestra usuarios pendientes si existen */}
                {resumenData.usuariosPendientes > 0 && (
                  <div>👤 <b>{resumenData.usuariosPendientes}</b> usuarios pendientes de aprobación.</div>
                )}
                {/* Muestra solicitudes activas si existen */}
                {resumenData.solicitudesPendientes > 0 && (
                  <div>📋 <b>{resumenData.solicitudesPendientes}</b> solicitudes activas en el sistema.</div>
                )}
                {/* Muestra reactivos próximos a vencer si existen */}
                {resumenData.reactivosPorVencer > 0 && (
                  <div style={{ color: "#dc2626" }}>⚠️ <b>{resumenData.reactivosPorVencer}</b> reactivos próximos a vencer.</div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Sección de accesos rápidos con animación */}
      <div style={{
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.1s", marginBottom: "40px"
      }}>
        {/* Encabezado de la sección */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Accesos Rápidos</h2>
        </div>

        {/* Grid de tarjetas de acceso rápido */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {/* Filtra y renderiza las tarjetas visibles según el rol */}
          {cards.filter(c => c.show).map((item, i) => (
            <a key={i} href={item.href} style={{ textDecoration: "none" }}>
              {/* Tarjeta con efecto hover de elevación */}
              <div style={{
                background: "#fff", borderRadius: "18px", padding: "24px",
                border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                cursor: "pointer", height: "100%", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,119,182,0.1)";
                  e.currentTarget.style.borderColor = item.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Ícono de la tarjeta con fondo de color */}
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: item.color + "15", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "22px", marginBottom: "16px",
                  color: item.color
                }}>{item.icon}</div>
                {/* Título de la tarjeta */}
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0A1628", marginBottom: "8px" }}>{item.title}</h3>
                {/* Descripción de la tarjeta */}
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Dashboard de gráficas adaptado por rol */}
      <div style={{
        opacity: sectionsVisible ? 1 : 0, transition: "all 0.7s ease 0.2s", marginBottom: "40px"
      }}>
        <DashboardCharts />
      </div>

      {/* Pie de página con información institucional */}
      <footer
        className="text-center p-4 mt-5"
        style={{
          background: "#0077B6",
          color: "#ffffff",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: "600",
          boxShadow: "0 8px 24px rgba(0, 119, 182, 0.2)",
          marginBottom: "20px"
        }}
      >
        <p className="mb-1">© 2025 Ecosystem - SENA Centro Agropecuario "La Granja"</p>
        <p className="mb-0">
          Para más información, consulta la sección{" "}
          <Link to="/acerca-de" style={{ color: "#e0f2fe", fontWeight: "800", textDecoration: "underline" }}>
            Acerca de Ecosystem
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default Home;