import React, { useState } from "react";
import ecosystemLogo from "./ecosystem_logo.png";
import labOficina from "./labAmbien.jpeg";
import labEquipos from "./lab_equipos.png";
import labFlujo from "./lab_flujo.png";
import labEntrada from "./lab_entrada.png";

const AcercaDe = () => {
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  return (
    <div className="container mt-4 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header institucional */}
      <div className="text-center mb-5">
        <img src={ecosystemLogo} alt="Logo Ecosystem" style={{ width: "160px", borderRadius: "24px", marginBottom: "16px" }} />
        <h1 style={{ fontWeight: "800", color: "#0077B6" }}>Acerca de Ecosystem</h1>
        <p style={{ color: "#0A1628", fontWeight: "600" }}>Sistema de Gestión Integral para el Laboratorio Ambiental</p>
        <div style={{ height: "3px", width: "60px", background: "#0077B6", margin: "0 auto", borderRadius: "99px" }} />
      </div>

      <div className="row g-4">
        {/* Fila 1: Ubicación del Laboratorio (Ancho Completo - Panel Dividido) */}
        <div className="col-12">
          <div className="card border-0 shadow p-0 overflow-hidden" style={{ borderRadius: "24px", border: "1px solid #0077B6", boxShadow: "0 10px 30px rgba(0, 119, 182, 0.15)" }}>
            <div className="row g-0">
              {/* Lado izquierdo: Control corporativo */}
              <div className="col-lg-5 p-5 d-flex flex-column justify-content-center text-white" style={{ background: "#0077B6" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#ffffff", letterSpacing: "2px", textTransform: "uppercase", opacity: "0.8" }}>Sede Oficial</span>
                <h3 className="my-3" style={{ fontWeight: "900", fontSize: "28px", color: "#ffffff" }}>Ubicación del Laboratorio</h3>
                <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: "1.7", marginBottom: "30px", opacity: "0.95" }}>
                  El <strong>Laboratorio Ambiental</strong> se encuentra ubicado dentro de las instalaciones del Centro Agropecuario "La Granja" - SENA Regional Tolima, Espinal.
                  <br /><br />
                  Haz clic en el botón a continuación para abrir la ubicación interactiva y Street View oficial en Google Maps.
                </p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=SENA+Centro+Agropecuario+La+Granja+Espinal+Tolima" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ 
                    borderRadius: "14px", 
                    fontWeight: "800", 
                    fontSize: "14px", 
                    color: "#0077B6", 
                    background: "#ffffff",
                    padding: "12px 24px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    border: "none",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Abrir en Google Maps
                </a>
              </div>

              {/* Lado derecho: Iframe de Google Maps Interactivo */}
              <div className="col-lg-7 p-0" style={{ minHeight: "380px" }}>
                <iframe 
                  src="https://maps.google.com/maps?q=SENA%20Centro%20Agropecuario%20La%20Granja%20Espinal&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: "380px", display: "block" }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Equipo de Desarrollo (Diseño de Tarjetas Grandes - Grid de 4 Columnas) */}
        <div className="col-12 mt-5">
          <h3 className="text-center mb-4" style={{ fontWeight: "800", color: "#0A1628", fontSize: "26px" }}>
            Equipo de Desarrolladores
          </h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 justify-content-center">
            {[
              { r: "Gerente del Proyecto y Full Stack", n: "Miguel Santiago Bocanegra Useche", img: "Miguel santiago Bocanegra Useche.jpeg" },
              { r: "Subgerente", n: "Luis Fernando Pinto Niño", img: "Luis fernando pinto niño.jpeg" },
              { r: "Especialista Frontend", n: "Christiam Ivan Mosquera Cantor", img: "Christiam Ivan Mosquera Cantor.jpeg" },
              { r: "Especialista Backend", n: "Juan Pablo Tocarema Avila", img: null }
            ].map((m, i) => {
              const imgUrl = m.img ? `http://localhost:8000/uploads/${m.img}` : null;
              const initials = m.n.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
              return (
                <div key={i} className="col">
                  <div 
                    className="card border-0 shadow-sm p-4 text-center h-100" 
                    style={{ 
                      borderRadius: "20px", 
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="mb-4" style={{ width: "100%" }}>
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={m.n} 
                          style={{ 
                            width: "100%", 
                            height: "280px", 
                            borderRadius: "16px", 
                            objectFit: "cover", 
                            border: "3px solid #0077B6",
                            boxShadow: "0 8px 24px rgba(0, 119, 182, 0.15)"
                          }} 
                        />
                      ) : (
                        <div style={{ 
                          width: "100%", 
                          height: "280px", 
                          background: "#0077B6", 
                          borderRadius: "16px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontSize: "56px",
                          fontWeight: "800",
                          color: "#ffffff",
                          border: "3px solid #ffffff",
                          boxShadow: "0 8px 24px rgba(0, 119, 182, 0.15)"
                        }}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <h5 className="mb-2" style={{ fontWeight: "800", fontSize: "16px", color: "#0A1628" }}>{m.n}</h5>
                    <span 
                      className="px-3 py-1 d-inline-block rounded-pill" 
                      style={{ 
                        fontSize: "12px", 
                        fontWeight: "700", 
                        color: "#0077B6", 
                        border: "1px solid #0077B6",
                        background: "transparent",
                        width: "fit-content",
                        margin: "0 auto"
                      }}
                    >
                      {m.r}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nuestras Instalaciones (Ancho Completo) */}
        <div className="col-12 mt-5">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 className="text-center mb-4" style={{ fontWeight: "800", color: "#0A1628", fontSize: "22px" }}>Nuestras Instalaciones</h3>
            <div className="row row-cols-1 row-cols-md-3 g-3">
              {[
                { title: "Área de Ensayos y Oficina", img: labOficina },
                { title: "Equipos de Análisis y Reactivos", img: labEquipos },
                { title: "Líneas de Flujo de Trabajo", img: labFlujo }
              ].map((ins, i) => (
                <div key={i} className="col">
                  <div 
                    className="card border-0 shadow-sm overflow-hidden" 
                    style={{ 
                      borderRadius: "16px", 
                      height: "100%", 
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease" 
                    }}
                    onClick={() => setLightboxPhoto({ src: ins.img, caption: ins.title })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img 
                      src={ins.img} 
                      alt={ins.title} 
                      style={{ height: "380px", objectFit: "cover", width: "100%" }} 
                    />
                    <div className="p-3 text-center" style={{ background: "#ffffff" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#0A1628" }}>{ins.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightboxPhoto && (
        <div onClick={() => setLightboxPhoto(null)} style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(10, 22, 40, 0.95)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "zoom-out"
        }}>
          <img src={lightboxPhoto.src} alt={lightboxPhoto.caption} style={{
            maxWidth: "90vw", maxHeight: "80vh", borderRadius: "24px", boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            border: "4px solid #ffffff"
          }} />
          <div style={{
            position: "absolute", bottom: "30px", background: "rgba(0,0,0,0.7)", padding: "10px 24px",
            borderRadius: "99px", color: "#ffffff", fontWeight: "700", fontSize: "16px"
          }}>
            {lightboxPhoto.caption}
          </div>
        </div>
      )}

      <footer 
        className="text-center mt-5 p-4" 
        style={{ 
          background: "#0077B6", 
          color: "#ffffff", 
          borderRadius: "20px", 
          fontSize: "14px", 
          fontWeight: "600",
          boxShadow: "0 8px 24px rgba(0, 119, 182, 0.2)"
        }}
      >
        <p className="mb-0">
          SENA - Centro Agropecuario "La Granja"
          <br />
          <span style={{ opacity: "0.85", fontWeight: "500", fontSize: "13px" }}>Ficha 3140221 ADSO - Regional Tolima</span>
        </p>
      </footer>
    </div>
  );
};

export default AcercaDe;
