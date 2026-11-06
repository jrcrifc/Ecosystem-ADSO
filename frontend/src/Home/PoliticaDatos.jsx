// Importa React y hooks necesarios
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./nuevologoecosystem.png";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

// Componente de Política de Tratamiento de Datos Personales conforme a normativas del SENA y Ley 1581 de 2012
const PoliticaDatos = ({ isPublic = false }) => {
  const navigate = useNavigate();
  const [aceptando, setAceptando] = useState(false);

  // Leer estado del usuario desde sessionStorage
  const stored = sessionStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;
  const token = sessionStorage.getItem("token") || currentUser?.token;
  const isAuth = !!(currentUser && token);

  const aceptaPoliticas = Number(
    currentUser?.acepta_politicas ?? currentUser?.user?.acepta_politicas ?? 0
  );

  const primaryColor = "#0077B6";
  const darkBlue = "#023E8A";

  const handleAceptar = async () => {
    try {
      setAceptando(true);
      await apiAxios.put("/api/auth/aceptar-politica", {
        id_usuario: currentUser?.id_usuario || currentUser?.user?.id_usuario,
        rol: currentUser?.rol || currentUser?.user?.rol
      });

      const userActualizado = {
        ...currentUser,
        acepta_politicas: 1,
        ...(currentUser?.user ? { user: { ...currentUser.user, acepta_politicas: 1 } } : {})
      };
      sessionStorage.setItem("user", JSON.stringify(userActualizado));
      window.dispatchEvent(new CustomEvent("politica_aceptada", { detail: { acepta_politicas: 1 } }));

      Swal.fire({
        icon: "success",
        title: "¡Política Aceptada!",
        text: "Has aceptado satisfactoriamente la Política de Tratamiento de Datos Personales del SENA.",
        confirmButtonColor: "#0077B6",
        timer: 2500,
        showConfirmButton: true
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo registrar la aceptación. Inténtalo de nuevo.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setAceptando(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1e293b",
        ...(isPublic && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 1000,
        }),
      }}
    >
      {/* Barra superior / Navegación */}
      <nav
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Ecosystem SENA" style={{ height: "46px", objectFit: "contain" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "19px", fontWeight: "800", color: primaryColor }}>
              Ecosystem
            </h1>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
              Laboratorio Ambiental • SENA
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => navigate(isAuth ? "/home" : -1)}
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              color: "#334155",
              padding: "8px 18px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-arrow-left me-2"></i> Devolverse
          </button>

          {isAuth ? (
            aceptaPoliticas === 1 ? (
              <span
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                <i className="fas fa-check-circle me-1"></i> Aceptada
              </span>
            ) : (
              <button
                onClick={handleAceptar}
                disabled={aceptando}
                style={{
                  background: "#10b981",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                }}
              >
                <i className="fas fa-check-circle me-1"></i> {aceptando ? "Aceptando..." : "Aceptar Política"}
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/UserLogin")}
              style={{
                background: primaryColor,
                border: "none",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {/* Contenedor principal de lectura */}
      <main style={{ maxWidth: "960px", margin: "32px auto", padding: "0 20px", flex: 1, width: "100%" }}>
        {/* Encabezado */}
        <div
          style={{
            background: "linear-gradient(135deg, #0077B6 0%, #023E8A 100%)",
            color: "#ffffff",
            padding: "36px 32px",
            borderRadius: "16px",
            marginBottom: "28px",
            boxShadow: "0 10px 25px rgba(0, 119, 182, 0.15)",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            MARCO LEGAL Y PROTECCIÓN HABEAS DATA
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginTop: "14px", marginBottom: "8px" }}>
            Política de Tratamiento y Protección de Datos Personales
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "14px", lineHeight: "1.6" }}>
            Servicio Nacional de Aprendizaje – SENA | Centro Agropecuario "La Granja" (Regional Tolima)
            <br />
            Sistema de Información Ecosystem para la Gestión de Laboratorio Ambiental.
          </p>
        </div>

        {/* Tarjeta de Contenido */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "36px 36px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            lineHeight: "1.7",
            fontSize: "14.5px",
            color: "#334155",
          }}
        >
          {/* Introducción */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              1. Alcance y Marco Normativo
            </h3>
            <p>
              En cumplimiento de la <strong>Constitución Política de Colombia</strong> (Artículo 15), la <strong>Ley Estatutaria 1581 de 2012</strong>, 
              su Decreto Reglamentario 1377 de 2013 y la <strong>Resolución SENA No. 01344 de 2017</strong> (por la cual se adopta la Política de Tratamiento 
              y Protección de Datos Personales en el SENA), la plataforma <strong>Ecosystem</strong> garantiza la total confidencialidad, 
              integridad y buen uso de los datos personales suministrados por instructores, aprendices, pasantes, gestores y personal administrativo.
            </p>
          </section>

          {/* Responsable */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              2. Identificación del Responsable del Tratamiento
            </h3>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li><strong>Entidad:</strong> Servicio Nacional de Aprendizaje – SENA</li>
                <li><strong>Sede / Centro:</strong> Centro Agropecuario "La Granja", Espinal - Regional Tolima</li>
                <li><strong>Proyecto / Sistema:</strong> Ecosystem - Gestión Integral de Laboratorio Ambiental (ADSO)</li>
                <li><strong>Canal Oficial Nacional:</strong> servicioalciudadano@sena.edu.co | www.sena.edu.co</li>
              </ul>
            </div>
          </section>

          {/* Finalidad */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              3. Finalidades del Tratamiento de Datos
            </h3>
            <p>Los datos recolectados a través de la plataforma (tales como nombres, documento de identidad, correo electrónico, rol y registros de actividad) serán utilizados exclusivamente para:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Gestionar y autenticar el acceso de usuarios a los módulos del laboratorio ambiental.</li>
              <li>Registrar y auditar la trazabilidad de solicitudes de materiales, reactivos y equipos en prácticas pedagógicas y formativas.</li>
              <li>Generar reportes institucionales, constancias de uso y actas de control interno conforme a los protocolos del laboratorio.</li>
              <li>Notificar oportunamente el estado de solicitudes, aprobaciones o alertas de seguridad relativas a reactivos y equipos.</li>
              <li>Garantizar la seguridad informática y auditoría de eventos del sistema (prevención de fraudes o suplantaciones).</li>
            </ul>
            <div style={{ background: "#fef3c7", padding: "12px 16px", borderRadius: "8px", borderLeft: "4px solid #f59e0b", color: "#92400e", fontSize: "13.5px" }}>
              <strong>Nota de Privacidad:</strong> En ningún caso el SENA ni los administradores del aplicativo compartirán, comercializarán ni transferirán datos personales a terceros sin previa autorización escrita, salvo requerimiento legal o de autoridad judicial competente.
            </div>
          </section>

          {/* Derechos del Titular */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              4. Derechos de los Titulares de la Información (Habeas Data)
            </h3>
            <p>Conforme al Artículo 8 de la Ley 1581 de 2012, todo usuario tiene derecho a:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales ante los responsables o encargados del tratamiento en cualquier momento desde su perfil o solicitud directa.</li>
              <li><strong>Solicitar prueba de la autorización</strong> otorgada para el tratamiento de sus datos.</li>
              <li><strong>Ser informado</strong> respecto del uso que se le ha dado a sus datos personales.</li>
              <li><strong>Revocar la autorización y/o solicitar la supresión</strong> del dato cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales.</li>
              <li><strong>Acceder en forma gratuita</strong> a sus datos personales objeto de tratamiento.</li>
            </ul>
          </section>

          {/* Seguridad */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              5. Medidas de Seguridad de la Información
            </h3>
            <p>
              Ecosystem implementa protocolos técnicos, administrativos y operativos idóneos (cifrado de credenciales, autenticación por tokens seguros JWT, 
              control estricto de roles basados en permisos y bitácoras de auditoría) para evitar la adulteración, pérdida, consulta, 
              uso o acceso no autorizado o fraudulento de la información.
            </p>
          </section>

          {/* Procedimiento */}
          <section className="mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              6. Procedimiento para Consultas, Quejas y Reclamos
            </h3>
            <p>
              El titular podrá ejercer sus derechos de consulta, actualización o retiro mediante comunicación escrita radicada ante el Centro Agropecuario 
              "La Granja" o enviando un mensaje a los canales oficiales institucionales del SENA indicando su nombre completo, número de documento de identificación 
              y la descripción clara de su requerimiento.
            </p>
          </section>

          {/* Vigencia */}
          <section>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: darkBlue, borderBottom: "2px solid #e0f2fe", paddingBottom: "6px" }}>
              7. Vigencia de la Política
            </h3>
            <p className="mb-0">
              La presente política rige a partir de su publicación y la base de datos vinculada a Ecosystem permanecerá vigente mientras subsistan las 
              finalidades para las cuales fueron recolectados los datos o durante el tiempo que exijan las normas de archivo y retención documental del SENA.
            </p>
          </section>

          {/* Cuadro de acción y aceptación */}
          <div className="mt-5 p-4" style={{ background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
              Conformidad y Aceptación
            </h4>
            <p style={{ fontSize: "13.5px", color: "#64748b", maxWidth: "600px", margin: "0 auto 20px" }}>
              Al pulsar "Aceptar Política", confirmas haber leído y autorizas libre, previa y expresamente al SENA el tratamiento de tus datos personales conforme a los lineamientos legales establecidos.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => navigate(isAuth ? "/home" : -1)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-arrow-left me-2"></i> Devolverse
              </button>

              {isAuth && (
                aceptaPoliticas === 1 ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px" }}>
                    <i className="fas fa-check-circle"></i> Ya has aceptado esta política
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAceptar}
                    disabled={aceptando}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      color: "#ffffff",
                      padding: "10px 28px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(16,185,129,0.35)",
                    }}
                  >
                    <i className="fas fa-check-circle me-2"></i> {aceptando ? "Aceptando..." : "Aceptar Política de Tratamiento de Datos"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center p-4 mt-auto"
        style={{
          background: "linear-gradient(135deg, #0077B6 0%, #023E8A 100%)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        <p className="mb-0">
          SENA - Centro Agropecuario "La Granja" • Regional Tolima • Ficha 3140221 ADSO
          <br />
          <span style={{ opacity: "0.85", fontWeight: "500", fontSize: "12px" }}>
            Ecosystem © 2026 - Conforme a la Ley 1581 de 2012 y Resolución SENA 01344 de 2017
          </span>
        </p>
      </footer>
    </div>
  );
};

export default PoliticaDatos;

