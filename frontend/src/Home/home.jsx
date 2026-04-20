import React, { useEffect, useState } from "react";
import logo from "../Home/logotipo.jpeg";

const Home = () => {
  const [count, setCount] = useState({ reactivos: 0, equipos: 0, solicitudes: 0, usuarios: 0 });

  const stored = localStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = userData?.user?.rol || userData?.rol;
  const userName = userData?.user?.nombres_apellidos || userData?.nombres_apellidos || "Usuario";
  const esAdmin = userRol !== "Aprendiz";

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
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "60px 56px", maxWidth: "700px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "28px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4FF", boxShadow: "0 0 8px #00D4FF" }} />
            <span style={{ color: "#00D4FF", fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px" }}>
              ADSO · SENA · LABORATORIO AMBIENTAL
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "48px", fontWeight: "800", lineHeight: "1.1", margin: "0 0 16px" }}>
            Hola, <span style={{ background: "linear-gradient(90deg, #00D4FF, #4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {userName.split(" ")[0]}
            </span> 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginBottom: "8px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
            {esAdmin ? `Rol: ${userRol}` : "Rol: Aprendiz"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: "1.8", margin: "0 0 36px", maxWidth: "520px" }}>
            {esAdmin
              ? "Tienes acceso completo al sistema. Gestiona reactivos, equipos, solicitudes, proveedores y más."
              : "Puedes crear solicitudes y consultar el historial de tus solicitudes registradas en el sistema."
            }
          </p>

          {/* Accesos rápidos según rol */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/solicitud" style={{
              background: "linear-gradient(135deg, #00D4FF, #0099bb)",
              borderRadius: "10px", padding: "12px 28px",
              color: "#020d1a", fontSize: "14px", fontWeight: "700",
              textDecoration: "none", display: "inline-block"
            }}>
              📋 Nueva Solicitud
            </a>
            <a href="/estadoxsolicitud" style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px", padding: "12px 28px",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              textDecoration: "none", display: "inline-block"
            }}>
              📁 Historial Solicitudes →
            </a>
          </div>
        </div>

        {/* Logo flotante */}
        <div style={{
          position: "absolute", right: "60px", top: "50%", transform: "translateY(-50%)",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2
        }}>
          <div style={{
            width: "165px", height: "165px", borderRadius: "50%",
            background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }}>
            <img src={logo} alt="Ecosystem" style={{ width: "140px", height: "140px", objectFit: "contain" }} />
          </div>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS APRENDIZ */}
      {!esAdmin && (
        <div style={{ margin: "32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "3px", width: "32px", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", borderRadius: "99px" }} />
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#00A8CC", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Tus accesos</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {[
              { icon: "📋", title: "Nueva Solicitud", desc: "Crea una nueva solicitud de materiales o servicios para el laboratorio.", color: "#00D4FF", light: "#e0f7ff", href: "/solicitud" },
              { icon: "📁", title: "Historial de Solicitudes", desc: "Consulta el estado y seguimiento de todas tus solicitudes registradas.", color: "#4ECDC4", light: "#e0f9f7", href: "/estadoxsolicitud" },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", borderRadius: "16px", padding: "32px 24px",
                  border: "1px solid #f0f4f8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                  cursor: "pointer", height: "100%"
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
                  <div style={{ fontSize: "13px", fontWeight: "700", color: item.color }}>Ir ahora →</div>
                </div>
              </a>
            ))}
          </div>

          {/* Aviso de acceso limitado */}
          <div style={{
            marginTop: "16px", background: "#fff8e1",
            border: "1px solid #ffe082", borderRadius: "12px",
            padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px"
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <p style={{ fontSize: "13px", color: "#7c5e00", margin: 0 }}>
              Como <strong>Aprendiz</strong>, tu acceso está limitado a crear solicitudes y consultar su historial. Para más permisos, contacta al administrador.
            </p>
          </div>
        </div>
      )}

      {/* MÉTRICAS — solo admin */}
      {esAdmin && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px", margin: "32px 0"
        }}>
          {[
            { num: count.reactivos, suffix: "+", label: "Reactivos registrados", color: "#00D4FF" },
            { num: count.equipos, suffix: "+", label: "Equipos gestionados", color: "#4ECDC4" },
            { num: count.solicitudes, suffix: "+", label: "Solicitudes procesadas", color: "#00D4FF" },
            { num: count.usuarios, suffix: "", label: "Desarrolladores", color: "#4ECDC4" },
          ].map((m, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "16px", padding: "24px 20px",
              border: "1px solid #e8f4f8", textAlign: "center",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: "36px", fontWeight: "800", color: m.color, lineHeight: 1 }}>
                {m.num}{m.suffix}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", fontWeight: "500" }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* FUNCIONALIDADES — solo admin */}
      {esAdmin && (
        <div style={{ margin: "8px 0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ height: "3px", width: "32px", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", borderRadius: "99px" }} />
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#00A8CC", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Funcionalidades</p>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0A1628", marginBottom: "24px" }}>¿Qué puedes gestionar?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { icon: "⚗️", title: "Control de Reactivos", desc: "Entradas, salidas y stock en tiempo real con estados automáticos.", color: "#00D4FF", light: "#e0f7ff", href: "/movimientoreactivo" },
              { icon: "🔬", title: "Equipos", desc: "Estado y mantenimiento de equipos del laboratorio actualizado.", color: "#4ECDC4", light: "#e0f9f7", href: "/equipos" },
              { icon: "📋", title: "Solicitudes", desc: "Gestiona y aprueba solicitudes de materiales del laboratorio.", color: "#00D4FF", light: "#e0f7ff", href: "/gestion-solicitudes" },
              { icon: "🏢", title: "Proveedores", desc: "Gestiona proveedores vinculados a los movimientos del laboratorio.", color: "#4ECDC4", light: "#e0f9f7", href: "/proveedor" },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", borderRadius: "16px", padding: "28px 22px",
                  border: "1px solid #f0f4f8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", cursor: "pointer"
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: item.light, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "22px", marginBottom: "16px"
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0A1628", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
                  <div style={{ marginTop: "16px", fontSize: "12px", fontWeight: "700", color: item.color }}>Ir al módulo →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SOBRE EL PROYECTO */}
      <div style={{
        background: "#020d1a", borderRadius: "20px", padding: "48px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center",
        position: "relative", overflow: "hidden", margin: "8px 0 32px"
      }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "3px", width: "32px", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", borderRadius: "99px" }} />
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#00D4FF", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Sobre el proyecto</p>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "16px", lineHeight: "1.3" }}>
            Construido por{" "}
            <span style={{ background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              aprendices ADSO
            </span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", margin: 0 }}>
            Ecosystem nació como proyecto del programa <strong style={{ color: "#4ECDC4" }}>Análisis y Desarrollo de Software</strong> del SENA. Un grupo de 4 aprendices desarrolló esta plataforma para digitalizar y optimizar la gestión del Laboratorio Ambiental.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { icon: "🧪", label: "Laboratorio Ambiental SENA", sub: "Cliente principal del sistema" },
            { icon: "💻", label: "React + Node.js + MySQL", sub: "Stack tecnológico utilizado" },
            { icon: "📱", label: "Diseño responsive", sub: "Acceso desde cualquier dispositivo" },
            { icon: "🔐", label: "Autenticación por roles", sub: "Admin y Aprendiz diferenciados" },
          ].map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "16px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,212,255,0.12)",
              borderRadius: "12px", padding: "14px 18px"
            }}>
              <span style={{ fontSize: "20px" }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{f.label}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EQUIPO */}
      <div style={{ margin: "8px 0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ height: "3px", width: "32px", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", borderRadius: "99px" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#00A8CC", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Equipo</p>
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0A1628", marginBottom: "24px" }}>Aprendices desarrolladores</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { initials: "MB", name: "Miguel Santiago Bocanegra Useche", role: "Gerente del Proyecto", badge: "👑 Gerente", gradient: "linear-gradient(135deg,#00D4FF,#0099bb)", featured: true },
            { initials: "CM", name: "Christian Mosquera", role: "Subgerente del Proyecto", badge: "⭐ Subgerente", gradient: "linear-gradient(135deg,#4ECDC4,#2a9d8f)", featured: false },
            { initials: "LP", name: "Luis Fernando Pinto Niño", role: "Especialista Frontend", badge: "🎨 Frontend", gradient: "linear-gradient(135deg,#00D4FF,#0099bb)", featured: false },
            { initials: "JT", name: "Juan Pablo Tocarema Avila", role: "Especialista Backend", badge: "⚙️ Backend", gradient: "linear-gradient(135deg,#4ECDC4,#2a9d8f)", featured: false },
          ].map((m, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "16px", overflow: "hidden",
              border: m.featured ? "2px solid #00D4FF" : "1px solid #f0f4f8",
              boxShadow: m.featured ? "0 8px 30px rgba(0,212,255,0.15)" : "0 2px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ height: "6px", background: m.gradient }} />
              <div style={{ padding: "24px 20px", textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: m.gradient, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: "800", margin: "0 auto 14px",
                  boxShadow: "0 4px 15px rgba(0,212,255,0.3)"
                }}>
                  {m.initials}
                </div>
                <div style={{
                  display: "inline-block", background: "#f0f9ff",
                  color: "#0099bb", fontSize: "11px", padding: "4px 12px",
                  borderRadius: "99px", marginBottom: "10px", fontWeight: "700"
                }}>
                  {m.badge}
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0A1628", marginBottom: "4px", lineHeight: "1.3" }}>{m.name}</h4>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: "#020d1a", borderRadius: "16px", padding: "28px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={logo} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "contain" }} />
          <div>
            <p style={{ fontSize: "15px", fontWeight: "700", background: "linear-gradient(90deg,#00D4FF,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 2px" }}>Ecosystem</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2025 · Laboratorio Ambiental · SENA</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D4FF", boxShadow: "0 0 10px #00D4FF" }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "500" }}>ADSO · Ficha activa · 2025</span>
        </div>
      </div>

    </div>
  );
};

export default Home;