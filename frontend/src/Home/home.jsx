import React, { useEffect, useState } from "react";
import ecosystemLogo from "./ecosystem_logo.png";
import DashboardCharts from "./DashboardCharts.jsx";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [resumenData, setResumenData] = useState({
    reactivosPorVencer: 0,
    usuariosPendientes: 0,
    solicitudesPendientes: 0
  });

  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;

  const userRol = (userData?.user?.rol || userData?.rol || "Aprendiz");
  const userRolLower = userRol.toLowerCase();
  const userName = userData?.user?.nombres_apellidos || userData?.nombres_apellidos || "Usuario";

  const esAdmin = userRolLower === "administrador" || userRolLower === "admin";
  const esGestor = userRolLower === "gestor";
  const esInstructor = userRolLower === "instructor";
  const esPasante = userRolLower === "pasante";
  const esAprendiz = userRolLower === "aprendiz";

  useEffect(() => {
    setHeroVisible(true);
    setTimeout(() => setSectionsVisible(true), 400);
  }, []);

  // RESUMEN DE NOVEDADES PARA EL ADMINISTRADOR (EN PANTALLA)
  useEffect(() => {
    if (!esAdmin) return;

    const fetchResumen = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiAxios.get("/api/dashboard/stats"),
          apiAxios.get("/api/auth/usuarios")
        ]);

        const stats = statsRes.data;
        const users = usersRes.data;

        const reactivosPorVencer = stats.vencimientos?.length || 0;
        const usuariosPendientes = users.filter(u => u.estado === "pendiente").length;
        const solicitudesPendientes = stats.solicitudes?.find(s => s.estado === 1)?.count || 0;

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

  const rolLabel = {
    administrador: "Administrador",
    admin: "Administrador",
    gestor: "Gestor de SENA Empresa",
    pasante: "Pasante",
    instructor: "Instructor",
    aprendiz: "Aprendiz",
  };

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
      
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ===== HERO ===== */}
      <div style={{
        position: "relative", borderRadius: "24px", overflow: "hidden",
        minHeight: "320px", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #0096C7 100%)",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        marginBottom: "30px", boxShadow: "0 20px 40px rgba(2,62,138,0.2)"
      }}>
        <div style={{ position: "relative", zIndex: 2, padding: "40px", maxWidth: "600px" }}>
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

          <h1 style={{ color: "#fff", fontSize: "38px", fontWeight: "800", margin: "0 0 10px" }}>
            Hola, {userName.split(" ")[0]} 👋
          </h1>

          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px",
            padding: "4px 12px", marginBottom: "15px"
          }}>
            <span style={{ color: "#CAF0F8", fontSize: "12px", fontWeight: "700" }}>
              {rolLabel[userRolLower] || userRol}
            </span>
          </div>

          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Bienvenido a tu panel de control. Selecciona una acción rápida para comenzar.
          </p>
        </div>

        {/* Logo Flotante */}
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

      {/* ===== RESUMEN DE NOVEDADES EN PANTALLA (ADMINISTRADOR) ===== */}
      {esAdmin && (resumenData.reactivosPorVencer > 0 || resumenData.usuariosPendientes > 0 || resumenData.solicitudesPendientes > 0) && (
        <div style={{
          background: "#fff", borderRadius: "18px", padding: "24px",
          border: "1px solid #e2e8f0", borderLeft: "5px solid #0077B6",
          marginBottom: "30px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.1s"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0A1628", margin: "0 0 15px 0" }}>
            📢 Resumen de Novedades
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#334155" }}>
            {resumenData.usuariosPendientes > 0 && (
              <div>👤 <b>{resumenData.usuariosPendientes}</b> usuarios pendientes de aprobación.</div>
            )}
            {resumenData.solicitudesPendientes > 0 && (
              <div>📋 <b>{resumenData.solicitudesPendientes}</b> solicitudes activas en el sistema.</div>
            )}
            {resumenData.reactivosPorVencer > 0 && (
              <div style={{ color: "#dc2626" }}>⚠️ <b>{resumenData.reactivosPorVencer}</b> reactivos próximos a vencer.</div>
            )}
          </div>
        </div>
      )}

      {/* ===== ACCESOS RÁPIDOS (AHORA ARRIBA) ===== */}
      <div style={{
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.1s", marginBottom: "40px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Accesos Rápidos</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {cards.filter(c => c.show).map((item, i) => (
            <a key={i} href={item.href} style={{ textDecoration: "none" }}>
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
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: item.color + "15", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "22px", marginBottom: "16px",
                  color: item.color
                }}>{item.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0A1628", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ===== DASHBOARD (ADAPTADO POR ROL) ===== */}
      <div style={{
        opacity: sectionsVisible ? 1 : 0, transition: "all 0.7s ease 0.2s", marginBottom: "40px"
      }}>
        <DashboardCharts />
      </div>

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