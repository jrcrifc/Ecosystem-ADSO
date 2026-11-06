import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const ModalAvisoPolitica = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener estado numérico de acepta_politicas
  const aceptaPoliticas = Number(
    userData?.acepta_politicas ?? userData?.user?.acepta_politicas ?? 0
  );

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Si ya aceptó la política (acepta_politicas === 1), nunca mostrar nada
  const yaAcepto = aceptaPoliticas === 1;

  // No mostrar modal si estamos leyendo la política en /politica-datos
  const enPaginaPolitica = location.pathname === "/politica-datos";

  useEffect(() => {
    if (yaAcepto) {
      setIsOpen(false);
      return;
    }

    // Si aún no ha aceptado y no está en la página de lectura, abrir automáticamente
    if (!enPaginaPolitica) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    // "si no la acepta debe seguir saliendole cada rato, como un spam"
    // Temporizador recurrente cada 35 segundos para volver a abrir el aviso si no ha aceptado
    const interval = setInterval(() => {
      // Re-verificar estado actual en sessionStorage por si aceptó en otra pestaña
      const stored = sessionStorage.getItem("user");
      const currentStored = stored ? JSON.parse(stored) : null;
      const estadoActual = Number(
        currentStored?.acepta_politicas ?? currentStored?.user?.acepta_politicas ?? 0
      );

      if (estadoActual === 1) {
        setIsOpen(false);
        clearInterval(interval);
        return;
      }

      if (window.location.pathname !== "/politica-datos") {
        setIsOpen(true);
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [yaAcepto, enPaginaPolitica, location.pathname]);

  // Si ya aceptó o está en la pestaña de política, no renderizar nada
  if (yaAcepto || enPaginaPolitica) {
    return null;
  }

  const nombreUsuario =
    userData?.nombres_apellidos || userData?.user?.nombres_apellidos || "Usuario";
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const userRol = userData?.rol || userData?.user?.rol;

  // Acción para aceptar la política directamente desde la ventanita
  const handleAceptarDirecto = async () => {
    try {
      setLoading(true);
      await apiAxios.put("/api/auth/aceptar-politica", {
        id_usuario: userId,
        rol: userRol
      });

      // Actualizar en sessionStorage
      const stored = sessionStorage.getItem("user");
      const current = stored ? JSON.parse(stored) : {};
      const updated = {
        ...current,
        acepta_politicas: 1,
        ...(current.user ? { user: { ...current.user, acepta_politicas: 1 } } : {})
      };
      sessionStorage.setItem("user", JSON.stringify(updated));

      // Actualizar estado en React
      if (setUserData) {
        setUserData(updated);
      }

      // Notificar a toda la ventana
      window.dispatchEvent(
        new CustomEvent("politica_aceptada", { detail: { acepta_politicas: 1 } })
      );

      setIsOpen(false);

      Swal.fire({
        icon: "success",
        title: "¡Política Aceptada!",
        text: "Has aceptado la Política de Tratamiento de Datos del SENA. Ya no te aparecerá este aviso.",
        confirmButtonColor: "#0077B6",
        timer: 2500,
        showConfirmButton: true
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo registrar la aceptación. Inténtalo de nuevo.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };

  // Acción para ir a la pestaña de tratamiento de datos
  const handleIrAPolitica = () => {
    setIsOpen(false);
    navigate("/politica-datos");
  };

  return (
    <>
      {/* Banner flotante de aviso preventivo en la parte superior */}
      <div
        style={{
          background: "linear-gradient(90deg, #b91c1c 0%, #ea580c 100%)",
          color: "#ffffff",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12.5px",
          fontWeight: "600",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 1050,
          animation: "fadeIn 0.3s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: "14px" }}></i>
          <span>
            <strong>Atención:</strong> Tienes pendiente la aceptación de la <u>Política de Tratamiento de Datos Personales del SENA</u> (Ley 1581 de 2012).
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#ffffff",
            color: "#b91c1c",
            border: "none",
            borderRadius: "6px",
            padding: "4px 12px",
            fontWeight: "700",
            fontSize: "11.5px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Revisar y Aceptar
        </button>
      </div>

      {/* Ventanita Emergente Modal (Popup) */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(10, 22, 40, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            {/* Cabecera estilizada */}
            <div
              style={{
                background: "linear-gradient(135deg, #0077B6 0%, #023E8A 100%)",
                color: "#ffffff",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}
                >
                  🛡️
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>
                    Política de Tratamiento de Datos
                  </h5>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: "500" }}>
                    SENA • Ley 1581 de 2012 • Habeas Data
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Cerrar temporalmente (volverá a salir)"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "24px",
                  cursor: "pointer",
                  lineHeight: 1,
                  opacity: 0.8
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                &times;
              </button>
            </div>

            {/* Contenido principal */}
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                fontSize: "13.5px",
                lineHeight: "1.65",
                color: "#334155"
              }}
            >
              <div
                style={{
                  background: "#f0f9ff",
                  borderLeft: "4px solid #0077B6",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px"
                }}
              >
                <p style={{ margin: 0, fontSize: "13.5px", color: "#0369a1", fontWeight: "600" }}>
                  Hola, <strong>{nombreUsuario}</strong>:
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#075985" }}>
                  Para continuar utilizando la plataforma Ecosystem, es indispensable que conozcas y aceptes el tratamiento seguro y confidencial de tus datos personales conforme a la normatividad institucional.
                </p>
              </div>

              <p style={{ marginBottom: "12px" }}>
                En cumplimiento de la <strong>Ley 1581 de 2012</strong> y la <strong>Resolución SENA No. 01344 de 2017</strong>, tus datos serán utilizados exclusivamente para la gestión académica, trazabilidad y control de inventarios de reactivos y equipos en el Laboratorio Ambiental.
              </p>

              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "12px",
                  color: "#92400e",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start"
                }}
              >
                <i className="fas fa-info-circle mt-1" style={{ fontSize: "14px" }}></i>
                <div>
                  <strong>Aviso:</strong> Si no aceptas la política ahora, esta ventanita continuará apareciendo periódicamente como recordatorio obligatorio hasta que confirmes tu aceptación.
                </div>
              </div>
            </div>

            {/* Acciones del pie */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                background: "#f8fafc"
              }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsOpen(false)}
                style={{ borderRadius: "8px", fontWeight: "600", fontSize: "12.5px" }}
              >
                Posponer
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleIrAPolitica}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #0077B6",
                    color: "#0077B6",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-file-alt me-1"></i> Ver Política Completa
                </button>

                <button
                  type="button"
                  onClick={handleAceptarDirecto}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(16,185,129,0.3)"
                  }}
                >
                  <i className="fas fa-check-circle me-1"></i>{" "}
                  {loading ? "Aceptando..." : "Aceptar Política"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAvisoPolitica;

