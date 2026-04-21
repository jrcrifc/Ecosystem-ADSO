import React, { useEffect, useState } from "react";
import logo from "../Home/logotipo.jpeg";

const Home = () => {
  const [count, setCount] = useState({ reactivos: 0, equipos: 0, solicitudes: 0, usuarios: 0 });

  const stored = localStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  
  // Normalización del rol y nombre
  const userRol = (userData?.user?.rol || userData?.rol || "Aprendiz").toLowerCase();
  const userName = userData?.user?.nombres_apellidos || userData?.nombres_apellidos || "Usuario";
  
  // Definición de permisos
  const esAdmin = userRol === "administrador" || userRol === "admin";
  const esGestor = userRol === "gestor";
  const esInstructor = userRol === "instructor";
  const esPasante = userRol === "pasante";
  const esAprendiz = userRol === "aprendiz";

  useEffect(() => {
    const targets = { reactivos: 120, equipos: 45, solicitudes: 200, usuarios: 4 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        reactivos: Math.floor(targets.reactivos * ease),
        equipos: Math.floor(targets.equipos * ease),
        solicitudes: Math.floor(targets.solicitudes * ease),
        usuarios: Math.floor(targets.usuarios * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  // CONFIGURACIÓN DE TARJETAS POR ROL
  const cards = [
    { 
      show: esAprendiz || esPasante || esAdmin,
      icon: "📋", title: "Nueva Solicitud", desc: "Crea una nueva solicitud de materiales o servicios.", color: "#00D4FF", light: "#e0f7ff", href: "/solicitud" 
    },
    { 
      show: esGestor || esAdmin,
      icon: "⚙️", title: "Control de Inventario", desc: "Gestiona el stock de reactivos y entrada de insumos.", color: "#f59e0b", light: "#fef3c7", href: "/movimientoreactivo" 
    },
    { 
      show: esGestor || esAdmin || esInstructor,
      icon: "📊", title: "Gestión de Solicitudes", desc: "Revisa, aprueba o rechaza solicitudes pendientes.", color: "#10b981", light: "#d1fae5", href: "/gestion-solicitudes" 
    },
    { 
      show: esInstructor || esAdmin,
      icon: "👨‍🏫", title: "Seguimiento Fichas", desc: "Consulta el consumo de materiales por grupos y fichas.", color: "#6366f1", light: "#e0e7ff", href: "/reportes-instructor" 
    },
    { 
      show: esAdmin,
      icon: "🏢", title: "Proveedores", desc: "Administra la base de datos de proveedores vinculados.", color: "#4ECDC4", light: "#e0f9f7", href: "/proveedor" 
    },
    { 
      show: true, // Siempre visible para todos
      icon: "📁", title: "Historial Personal", desc: "Consulta el estado de tus movimientos registrados.", color: "#4ECDC4", light: "#e0f9f7", href: "/estadoxsolicitud" 
    },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "0 0 40px" }}>

      {/* HERO */}
      <div style={{
        position: "relative", borderRadius: "20px", overflow: "hidden",
        minHeight: "420px", display: "flex", alignItems: "center",
        background: "#020d1a"
      }}>
        <img src={logo} alt="bg" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center", opacity: 0.18,
          filter: "blur(2px) saturate(1.5)"
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(120deg, rgba(0,10,30,0.97) 40%, rgba(0,180,220,0.08) 100%)"
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "60px 56px", maxWidth: "700px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "28px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4FF" }} />
            <span style={{ color: "#00D4FF", fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px" }}>
              SENA · PANEL {userRol.toUpperCase()}
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "48px", fontWeight: "800", lineHeight: "1.1", margin: "0 0 16px" }}>
            Hola, <span style={{ background: "linear-gradient(90deg, #00D4FF, #4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {userName.split(" ")[0]}
            </span> 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: "1.8", margin: "0 0 36px", maxWidth: "520px" }}>
            Bienvenido a Ecosystem. Tienes acceso al panel de <strong>{userRol}</strong>, donde podrás gestionar las actividades del Laboratorio Ambiental según tus permisos.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/solicitud" style={{
              background: "linear-gradient(135deg, #00D4FF, #0099bb)",
              borderRadius: "10px", padding: "12px 28px",
              color: "#020d1a", fontSize: "14px", fontWeight: "700", textDecoration: "none"
            }}>📋 Nueva Solicitud</a>
          </div>
        </div>
      </div>

      {/* ACCESOS DINÁMICOS POR ROL */}
      <div style={{ padding: "0 56px", marginTop: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ height: "3px", width: "32px", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", borderRadius: "99px" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#00A8CC", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            Funciones para {userRol}
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {cards.filter(card => card.show).map((item, i) => (
            <a key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", borderRadius: "16px", padding: "32px 24px",
                border: "1px solid #f0f4f8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                cursor: "pointer", height: "100%", transition: "transform 0.2s"
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: item.light, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "24px", marginBottom: "16px"
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0A1628", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: "0 0 16px" }}>{item.desc}</p>
                <div style={{ fontSize: "13px", fontWeight: "700", color: item.color }}>Entrar →</div>
              </div>
            </a>
          ))}
        </div>

        {/* Aviso para roles con acceso limitado */}
        {(esAprendiz || esPasante) && (
          <div style={{
            marginTop: "24px", background: "#fff8e1", border: "1px solid #ffe082",
            borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px"
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <p style={{ fontSize: "13px", color: "#7c5e00", margin: 0 }}>
              Tu nivel de acceso actual es de <strong>Lectura/Solicitud</strong>. Si requieres permisos administrativos, contacta al equipo de gestión.
            </p>
          </div>
        )}
      </div>

      {/* MÉTRICAS (Visibles para Admin, Gestor e Instructor) */}
      {(esAdmin || esGestor || esInstructor) && (
        <div style={{ padding: "0 56px", margin: "32px 0" }}>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            {[
              { num: count.reactivos, label: "Reactivos", color: "#00D4FF" },
              { num: count.equipos, label: "Equipos", color: "#4ECDC4" },
              { num: count.solicitudes, label: "Solicitudes", color: "#00D4FF" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e8f4f8", textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "800", color: m.color }}>{m.num}+</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ margin: "40px 56px 0", background: "#020d1a", borderRadius: "16px", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={logo} alt="logo" style={{ width: "40px", borderRadius: "8px" }} />
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2025 · Ecosystem Laboratorio Ambiental · SENA</p>
        </div>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>ADSO · Ficha Activa</span>
      </div>

    </div>
  );
};

export default Home;