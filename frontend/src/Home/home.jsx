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
  // Estado con los totales de registros para mostrar en las tarjetas
  const [totals, setTotals] = useState({
    solicitudes: 0,
    reactivos: 0,
    equipos: 0,
    usuarios: 0,
    proveedores: 0
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

  // Efecto que carga el resumen de novedades y totales
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await apiAxios.get("/api/dashboard/stats");
        const stats = statsRes.data;
        
        if (stats.totals) {
          setTotals(stats.totals);
        }

        // Si es admin, también calculamos las alertas y usuarios pendientes
        if (esAdmin) {
          const usersRes = await apiAxios.get("/api/auth/usuarios");
          const users = usersRes.data;
          
          const reactivosPorVencer = stats.vencimientos?.length || 0;
          const usuariosPendientes = users.filter(u => u.estado === "pendiente").length;
          const solicitudesPendientes = stats.solicitudes?.find(s => s.estado === 1)?.count || 0;

          setResumenData({
            reactivosPorVencer,
            usuariosPendientes,
            solicitudesPendientes
          });
        }
      } catch (error) {
        console.error("Error cargando dashboard stats", error);
      }
    };
    fetchStats();
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
    { id: "solicitudes", show: esAprendiz || esInstructor, icon: "📋", title: "Nueva Solicitud", desc: "Crea solicitudes de préstamo.", color: "#0077B6", href: "/solicitud" },
    { id: "solicitudes", show: esAdmin, icon: "📋", title: "Nueva Solicitud", desc: "Registra solicitud por un solicitante.", color: "#0077B6", href: "/solicitud" },
    { id: "solicitudes", show: esAdmin, icon: "📊", title: "Gestión Solicitudes", desc: "Revisa y aprueba solicitudes.", color: "#0096C7", href: "/gestion-solicitudes" },
    { id: "reactivos", show: esAdmin || esGestor || esPasante, icon: "🧪", title: "Reactivos", desc: "Gestión de stock de reactivos.", color: "#00B4D8", href: "/reactivos" },
    { id: "equipos", show: esAdmin || esGestor || esPasante, icon: "🔬", title: "Equipos", desc: "Administración de equipos.", color: "#023E8A", href: "/equipos" },
    { id: "usuarios", show: esAdmin, icon: "👥", title: "Usuarios", desc: "Administra permisos y roles.", color: "#0353A4", href: "/gestion-usuarios" },
    { id: "proveedores", show: esAdmin, icon: "🏢", title: "Proveedores", desc: "Administra proveedores.", color: "#48CAE4", href: "/proveedor" },
    { id: "solicitudes", show: esAprendiz || esInstructor, icon: "📁", title: "Mi Historial", desc: "Estado de tus solicitudes.", color: "#1d4ed8", href: "/estadoxsolicitud" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f7ff", minHeight: "100vh", padding: "20px" }}>

      {/* Define la animación fadeUp y estilos del Hero para las secciones */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        .home-hero {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #0096C7 100%);
          margin-bottom: 30px;
          box-shadow: 0 20px 40px rgba(2,62,138,0.2);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }

        .home-hero-content {
          position: relative;
          z-index: 2;
          padding: 40px;
          max-width: 600px;
        }

        .home-hero-title {
          color: #fff;
          font-size: 38px;
          font-weight: 800;
          margin: 0 0 10px;
          line-height: 1.2;
        }

        .home-hero-logo-container {
          position: absolute;
          right: 50px;
          top: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatLogo 4s ease-in-out infinite;
          cursor: pointer;
        }

        .home-hero-logo-container::before {
          content: '';
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(72, 202, 228, 0.4) 0%, rgba(0, 119, 182, 0) 70%);
          animation: pulseAura 3s ease-in-out infinite alternate;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-50%) translateY(-12px) rotate(2.5deg);
          }
        }

        @keyframes pulseAura {
          0% {
            transform: scale(0.9);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 0.95;
          }
        }

        .home-hero-logo {
          width: 260px;
          height: auto;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.25)) drop-shadow(0 0 20px rgba(202, 240, 248, 0.35));
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease;
        }

        .home-hero-logo-container:hover .home-hero-logo {
          transform: scale(1.12) rotate(-3deg);
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 35px rgba(72, 202, 228, 0.85));
        }

        @media (max-width: 768px) {
          .home-hero {
            flex-direction: column;
            align-items: center;
            min-height: auto;
            padding: 30px 20px;
          }

          .home-hero-content {
            padding: 0;
            max-width: 100%;
            text-align: center;
          }

          .home-hero-title {
            font-size: 26px;
          }

          .home-hero-logo-container {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            margin-top: 24px;
            width: 130px;
            height: 130px;
            align-self: center;
            animation: floatLogoMobile 4s ease-in-out infinite;
          }

          @keyframes floatLogoMobile {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(2.5deg);
            }
          }

          .home-hero-logo {
            width: 120px;
            height: auto;
          }
        }
      `}</style>

      {/* Hero de bienvenida con gradiente azul y animación de entrada */}
      <div
        className="home-hero"
        style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(20px)"
        }}
      >
        {/* Contenido textual del hero */}
        <div className="home-hero-content">
          {/* Título */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "20px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48CAE4" }} />
            <span style={{ color: "#CAF0F8", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>
              Laboratorio Ambiental
            </span>
          </div>

          {/* Saludo personalizado al usuario */}
          <h1 className="home-hero-title" style={{ marginBottom: "10px" }}>
            Hola {(() => {
              const hour = new Date().getHours();
              if (hour >= 5 && hour < 12) return "Buenos Días ☀️";
              if (hour >= 12 && hour < 19) return "Buenas Tardes ⛅";
              return "Buenas Noches 🌙";
            })()}
          </h1>

          {/* Etiqueta con el rol del usuario */}
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px",
            padding: "4px 12px", marginBottom: "0"
          }}>
            <span style={{ color: "#CAF0F8", fontSize: "14px", fontWeight: "700", textTransform: "capitalize" }}>
              {rolLabel[userRolLower] || userRol}
            </span>
          </div>
        </div>

        {/* Logo flotante de Ecosystem en la esquina derecha */}
        <div className="home-hero-logo-container">
          <img src={ecosystemLogo} alt="Ecosystem" className="home-hero-logo" />
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: item.color + "15", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "22px", marginBottom: "16px",
                    color: item.color
                  }}>{item.icon}</div>
                  
                  {/* Badge con el total de registros */}
                  {(totals[item.id] !== undefined && totals[item.id] > 0) && (
                    <div style={{
                      background: item.color + "20",
                      color: item.color,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "800"
                    }}>
                      {totals[item.id]} registros
                    </div>
                  )}
                </div>
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