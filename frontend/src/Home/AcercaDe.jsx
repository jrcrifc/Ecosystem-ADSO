import React from "react";
import ecosystemLogo from "./ecosystem_logo.png";

const AcercaDe = () => {
  return (
    <div className="container mt-4 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header institucional */}
      <div className="text-center mb-5">
        <img src={ecosystemLogo} alt="Logo Ecosystem" style={{ width: "100px", borderRadius: "20px", marginBottom: "16px" }} />
        <h1 style={{ fontWeight: "800", color: "#0077B6" }}>Acerca de Ecosystem</h1>
        <p className="text-muted">Sistema de Gestión Integral para el Laboratorio Ambiental</p>
        <div style={{ height: "3px", width: "60px", background: "#0077B6", margin: "0 auto", borderRadius: "99px" }} />
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Información del Proyecto */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
            <h3 style={{ fontWeight: "700", color: "#0A1628" }}>Nuestro Proyecto</h3>
            <p className="mt-3" style={{ lineHeight: "1.8", color: "#475569" }}>
              <strong>Ecosystem</strong> es una solución tecnológica desarrollada como proyecto integrador por los aprendices del programa <strong>Análisis y Desarrollo de Software (ADSO)</strong> del SENA Centro Agropecuario "La Granja" - Regional Tolima.
            </p>
            <p style={{ lineHeight: "1.8", color: "#475569" }}>
              Este software nace de la necesidad de modernizar y automatizar los procesos internos del <strong>Laboratorio Ambiental</strong>, permitiendo un control preciso de inventarios, gestión de equipos y trazabilidad total de las solicitudes de préstamo.
            </p>

            <div className="mt-4 p-3" style={{ background: "#f0f7ff", borderRadius: "14px", border: "1px solid #dbeafe" }}>
              <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0077B6" }}>🎯 Objetivo Principal</h5>
              <p className="mb-0" style={{ fontSize: "13px", color: "#334155" }}>
                Optimizar la gestión de recursos del laboratorio mediante una interfaz intuitiva, segura y alineada con los estándares de calidad ISO 25010.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Equipo de Desarrollo */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px", height: "100%" }}>
            <h3 style={{ fontWeight: "700", color: "#0A1628" }}>Equipo de Desarrollo</h3>
            <div className="mt-4">
              {[
                { r: "Gerente de Proyecto", n: "Miguel Santiago Bocanegra", e: "👨‍💼" },
                { r: "Subgerente", n: "Luis Fernando Pinto Niño", e: "👩‍💻" },
                { r: "Especialista Frontend", n: "Cristiam Ivan Mosquera Cantor", e: "🎨" },
                { r: "Especialista Backend", n: "Juan Pablo Tocarema Avila", e: "⚙️" }
              ].map((m, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: "40px", height: "40px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                    {m.e}
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ fontWeight: "700", fontSize: "14px" }}>{m.n}</h6>
                    <span style={{ fontSize: "12px", color: "#0077B6" }}>{m.r}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tecnologías */}
        <div className="col-12">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
            <h3 className="text-center mb-4" style={{ fontWeight: "700", color: "#0A1628" }}>Tecnologías Utilizadas</h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {["React JS 19", "Node.js", "Express", "MySQL", "Sequelize ORM", "Bootstrap 5", "JWT Auth", "SweetAlert2"].map((t, i) => (
                <span key={i} className="px-3 py-2" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center mt-5 text-muted" style={{ fontSize: "12px" }}>
        <p>SENA - Centro Agropecuario "La Granja"<br />Ficha 3140221 ADSO - Regional Tolima</p>
      </footer>
    </div>
  );
};

export default AcercaDe;
