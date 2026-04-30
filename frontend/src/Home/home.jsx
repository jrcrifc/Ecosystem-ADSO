import React, { useEffect, useState } from "react";
import ecosystemLogo from "./ecosystem_logo.png";
import labOficina from "./labAmbien.jpeg";
import labEquipos from "./lab_equipos.png";
import labFlujo from "./lab_flujo.png";

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

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

  const labPhotos = [
    { src: labOficina, caption: "Oficina y área de trabajo del laboratorio" },
    { src: labEquipos, caption: "Zona de equipos y análisis de muestras" },
    { src: labFlujo, caption: "Cámara de flujo laminar e instrumentación" },
  ];

  useEffect(() => {
    setHeroVisible(true);
    setTimeout(() => setSectionsVisible(true), 400);

    // Auto-rotate gallery
    const galleryTimer = setInterval(() => {
      setGalleryIndex(prev => (prev + 1) % labPhotos.length);
    }, 5000);
    return () => clearInterval(galleryTimer);
  }, []);

  const rolLabel = {
    administrador: "Administrador",
    admin: "Administrador",
    gestor: "Gestor de Laboratorio",
    pasante: "Pasante",
    instructor: "Instructor",
    aprendiz: "Aprendiz",
  };

  const rolDesc = {
    administrador: "Gestiona usuarios, aprueba solicitudes y controla todos los módulos del sistema.",
    admin: "Gestiona usuarios, aprueba solicitudes y controla todos los módulos del sistema.",
    gestor: "Controla inventarios de reactivos, equipos y registra movimientos del laboratorio.",
    pasante: "Apoya la gestión del laboratorio y tiene acceso a los módulos de inventario.",
    instructor: "Supervisa prácticas y puede gestionar solicitudes de equipos para formación.",
    aprendiz: "Solicita préstamos de equipos y materiales para tus prácticas en el laboratorio.",
  };

  const cards = [
    { show: esAprendiz || esPasante || esAdmin, icon: "📋", title: "Nueva Solicitud", desc: "Crea solicitudes de préstamo de equipos o materiales.", color: "#0077B6", href: "/solicitud" },
    { show: esGestor || esAdmin, icon: "🧪", title: "Control de Inventario", desc: "Gestiona el stock de reactivos y movimientos.", color: "#00B4D8", href: "/movimientoreactivo" },
    { show: esGestor || esAdmin || esInstructor, icon: "📊", title: "Gestión de Solicitudes", desc: "Revisa, aprueba o rechaza solicitudes pendientes.", color: "#0096C7", href: "/gestion-solicitudes" },
    { show: esAdmin, icon: "👥", title: "Gestión de Usuarios", desc: "Aprueba, inactiva o administra los usuarios del sistema.", color: "#023E8A", href: "/gestion-usuarios" },
    { show: esAdmin, icon: "🏢", title: "Proveedores", desc: "Administra proveedores vinculados al laboratorio.", color: "#0353A4", href: "/proveedor" },
    { show: true, icon: "📁", title: "Mi Historial", desc: "Consulta el estado de tus solicitudes.", color: "#48CAE4", href: "/estadoxsolicitud" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f7ff", minHeight: "100vh" }}>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ===== HERO ===== */}
      <div style={{
        position: "relative", borderRadius: "20px", overflow: "hidden",
        minHeight: "380px", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #0096C7 100%)",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Water pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.5) 35px, rgba(255,255,255,0.5) 70px)`,
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "52px 48px", maxWidth: "640px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "24px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48CAE4" }} />
            <span style={{ color: "#CAF0F8", fontSize: "11px", fontWeight: "700", letterSpacing: "2px" }}>
              SENA · LABORATORIO AMBIENTAL
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "44px", fontWeight: "800", lineHeight: "1.15", margin: "0 0 8px" }}>
            Bienvenido, {userName.split(" ")[0]}
          </h1>

          {/* Rol badge */}
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px",
            padding: "6px 16px", marginBottom: "20px"
          }}>
            <span style={{ color: "#CAF0F8", fontSize: "13px", fontWeight: "700" }}>
              {rolLabel[userRolLower] || userRol}
            </span>
          </div>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: "1.8", margin: "0 0 32px", maxWidth: "480px" }}>
            {rolDesc[userRolLower] || "Bienvenido a Ecosystem, tu plataforma de gestión del laboratorio ambiental."}
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/solicitud" style={{
              background: "#fff", borderRadius: "10px", padding: "12px 28px",
              color: "#023E8A", fontSize: "13px", fontWeight: "700", textDecoration: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.15)", transition: "transform 0.2s"
            }}>📋 Nueva Solicitud</a>
            <a href="/estadoxsolicitud" style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "10px", padding: "12px 28px",
              color: "#fff", fontSize: "13px", fontWeight: "600", textDecoration: "none",
              transition: "all 0.2s"
            }}>📁 Mi Historial</a>
          </div>
        </div>

        {/* Logo */}
        <div style={{
          position: "absolute", right: "50px", bottom: "40px",
          width: "130px", height: "130px", borderRadius: "24px",
          background: "rgba(255,255,255,0.08)", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <img src={ecosystemLogo} alt="Ecosystem" style={{ width: "85px", height: "85px", borderRadius: "14px" }} />
        </div>
      </div>

      {/* ===== ¿QUÉ ES ECOSYSTEM? ===== */}
      <div style={{
        padding: "0", marginTop: "28px",
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.1s"
      }}>
        <div style={{
          background: "#fff", borderRadius: "18px", padding: "36px 40px",
          border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "#0077B6", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "24px", flexShrink: 0, color: "#fff"
            }}>🌿</div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: "800", color: "#0A1628" }}>
                ¿Qué es Ecosystem?
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: "14px", color: "#475569", lineHeight: "1.8" }}>
                <strong>Ecosystem</strong> es una plataforma web desarrollada por aprendices del programa
                <strong> Análisis y Desarrollo de Software (ADSO)</strong> del SENA, diseñada para la
                gestión integral del <strong>Laboratorio Ambiental</strong>. Centraliza el control de
                préstamos de equipos, inventario de reactivos, seguimiento de solicitudes y administración
                de usuarios, garantizando trazabilidad y eficiencia en cada operación.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                {[
                  { icon: "💧", text: "Control de análisis de muestras de agua y procesos ambientales" },
                  { icon: "🧪", text: "Inventario de reactivos con entradas, salidas y alertas de stock" },
                  { icon: "🔬", text: "Gestión de equipos con estados, mantenimiento e historial" },
                  { icon: "📋", text: "Solicitudes de préstamo con flujo de aprobación completo" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "10px", alignItems: "center",
                    background: "#f0f7ff", borderRadius: "10px",
                    padding: "10px 14px", border: "1px solid #dbeafe"
                  }}>
                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: "12px", color: "#334155", lineHeight: "1.5" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== GALERÍA DEL LABORATORIO ===== */}
      <div style={{
        marginTop: "28px",
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.2s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#0077B6", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            Nuestro Laboratorio
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {labPhotos.map((photo, i) => (
            <div key={i} style={{
              position: "relative", borderRadius: "16px", overflow: "hidden",
              aspectRatio: "4/3", cursor: "pointer",
              boxShadow: galleryIndex === i ? "0 8px 30px rgba(0,119,182,0.2)" : "0 1px 4px rgba(0,0,0,0.06)",
              border: galleryIndex === i ? "2px solid #0077B6" : "2px solid transparent",
              transition: "all 0.3s ease"
            }}
              onClick={() => setLightboxPhoto(photo)}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <img src={photo.src} alt={photo.caption} style={{
                width: "100%", height: "100%", objectFit: "cover"
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(2,62,138,0.85))",
                padding: "20px 14px 12px", color: "#fff", fontSize: "11.5px",
                fontWeight: "600"
              }}>
                {photo.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ACCESOS RÁPIDOS ===== */}
      <div style={{
        marginTop: "28px",
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#0077B6", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            Accesos rápidos
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {cards.filter(c => c.show).map((item, i) => (
            <a key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", borderRadius: "14px", padding: "22px 20px",
                border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                cursor: "pointer", height: "100%", transition: "all 0.25s ease"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,119,182,0.1)";
                  e.currentTarget.style.borderColor = item.color + "40";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.03)";
                  e.currentTarget.style.borderColor = "#dbeafe";
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: item.color + "12", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "18px", marginBottom: "12px"
                }}>{item.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0A1628", marginBottom: "4px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6", margin: "0 0 10px" }}>{item.desc}</p>
                <div style={{ fontSize: "12px", fontWeight: "700", color: item.color }}>Entrar →</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ===== EQUIPO ===== */}
      <div style={{
        marginTop: "28px",
        opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease 0.4s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ height: "3px", width: "24px", background: "#0353A4", borderRadius: "99px" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#0353A4", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            Equipo de Desarrollo
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px" }}>
          {[
            { nombre: "Gerente", rol: "Gerente del Proyecto", emoji: "👨‍💼", color: "#023E8A" },
            { nombre: "Subgerente", rol: "Subgerente", emoji: "👩‍💼", color: "#0077B6" },
            { nombre: "Frontend Dev", rol: "Especialista Frontend", emoji: "🎨", color: "#0096C7" },
            { nombre: "Backend Dev", rol: "Especialista Backend", emoji: "⚙️", color: "#00B4D8" },
          ].map((m, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "14px", padding: "24px 16px",
              border: "1px solid #dbeafe", textAlign: "center",
              transition: "transform 0.2s", cursor: "default"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 12px",
                background: m.color, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", boxShadow: `0 4px 12px ${m.color}30`
              }}><span>{m.emoji}</span></div>
              <h4 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "700", color: "#0A1628" }}>{m.nombre}</h4>
              <span style={{
                fontSize: "10px", fontWeight: "600", color: "#0077B6",
                background: "#dbeafe", padding: "2px 10px", borderRadius: "99px"
              }}>{m.rol}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FOOTER PROFESIONAL ===== */}
      <footer style={{
        marginTop: "40px", background: "#023E8A", borderRadius: "18px",
        padding: "0", overflow: "hidden"
      }}>
        {/* Top section */}
        <div style={{
          padding: "32px 36px 24px", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <img src={ecosystemLogo} alt="logo" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>Ecosystem</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>
              Plataforma de gestión integral para el Laboratorio Ambiental del SENA.
              Desarrollado con tecnologías modernas por el equipo ADSO.
            </p>
          </div>

          {/* Módulos */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
              Módulos
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {["Solicitudes", "Reactivos", "Equipos", "Proveedores"].map((mod, i) => (
                <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{mod}</span>
              ))}
            </div>
          </div>

          {/* Tecnologías */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
              Tecnologías
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {["React 19", "Node.js + Express", "Sequelize ORM", "MySQL"].map((tech, i) => (
                <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
              Institución
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>SENA Regional</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Programa ADSO</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Laboratorio Ambiental</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "14px 36px", display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "8px"
        }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © 2025 Ecosystem — Todos los derechos reservados
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
            Versión 1.0 · Ficha ADSO
          </p>
        </div>
      </footer>

      {/* Spacer */}
      <div style={{ height: "24px" }} />

      {/* ===== LIGHTBOX ===== */}
      {lightboxPhoto && (
        <div onClick={() => setLightboxPhoto(null)} style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.92)", display: "flex",
          alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", animation: "fadeIn 0.2s ease",
        }}>
          <button onClick={() => setLightboxPhoto(null)} style={{
            position: "absolute", top: "20px", right: "24px",
            background: "transparent", border: "none", color: "#fff",
            fontSize: "28px", cursor: "pointer", zIndex: 10000,
          }}>✕</button>
          <div style={{ textAlign: "center", maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <img src={lightboxPhoto.src} alt={lightboxPhoto.caption} style={{
              maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain",
              borderRadius: "14px", boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
            }} />
            <p style={{
              color: "#fff", fontSize: "14px", fontWeight: "500",
              marginTop: "16px", opacity: 0.8,
            }}>{lightboxPhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;