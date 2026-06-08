// Importa el hook de estado para manejar datos del formulario
import { useState } from "react";
// Importa el hook de navegación para redirigir al usuario
import { useNavigate } from "react-router-dom";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig.js";
// Importa SweetAlert2 para mostrar notificaciones y alertas
import Swal from "sweetalert2";
// Importa iconos de react-icons para la interfaz
import { FaEnvelope, FaKey, FaLock, FaArrowLeft } from "react-icons/fa";
// Importa el logo de Ecosystem para mostrarlo en la tarjeta
import logo from "../Home/ecosystem_logo.png";
// Importa la imagen de fondo del laboratorio
import fondoLaboratorio from "../Home/laboratorio.png";

// Componente de recuperación de contraseña en 3 pasos
const OlvidarPassword = () => {
  // Hook de navegación para redirigir después de completar el flujo
  const navigate = useNavigate();
  // Controla el paso actual del flujo: 1=Solicitar, 2=Verificar, 3=Cambiar
  const [step, setStep] = useState(1);
  // Almacena el correo electrónico ingresado por el usuario
  const [email, setEmail] = useState("");
  // Almacena el código de verificación de 6 dígitos
  const [codigo, setCodigo] = useState("");
  // Almacena el nuevo correo opcional del usuario
  const [newEmail, setNewEmail] = useState("");
  // Almacena la nueva contraseña ingresada
  const [newPassword, setNewPassword] = useState("");
  // Almacena la confirmación de la nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState("");
  // Indica si hay una operación en curso (envío, verificación o cambio)
  const [loading, setLoading] = useState(false);

  // Paso 1: Solicita un código de verificación al correo del usuario
  const handleSolicitar = async (e) => {
    // Evita la recarga del formulario al enviar
    e.preventDefault();
    // Activa el estado de carga
    setLoading(true);
    try {
      // Envía solicitud de código al backend con el correo ingresado
      await apiAxios.post("/api/password-reset/solicitar-codigo", { email });
      // Muestra mensaje de éxito al usuario
      Swal.fire("Código Enviado", "Si el correo está registrado, recibirás un código de 6 dígitos.", "success");
      // Avanza al paso de verificación
      setStep(2);
    } catch (err) {
      // Muestra error si no se pudo enviar el código
      Swal.fire("Error", err.response?.data?.message || "No se pudo enviar el código", "error");
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Paso 2: Verifica que el código ingresado por el usuario sea correcto
  const handleVerificar = async (e) => {
    // Evita la recarga del formulario al enviar
    e.preventDefault();
    // Activa el estado de carga
    setLoading(true);
    try {
      // Envía el correo y código al backend para validación
      await apiAxios.post("/api/password-reset/verificar-codigo", { email, codigo });
      // Muestra mensaje de código válido
      Swal.fire("Código Válido", "El código es correcto. Ahora ingresa tu nueva contraseña.", "success");
      // Avanza al paso de cambio de contraseña
      setStep(3);
    } catch (err) {
      // Muestra error si el código es incorrecto o expiró
      Swal.fire("Error", err.response?.data?.message || "Código incorrecto o expirado", "error");
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Paso 3: Cambia la contraseña (y opcionalmente el email) del usuario
  const handleCambiar = async (e) => {
    // Evita la recarga del formulario al enviar
    e.preventDefault();
    // Validación local: las contraseñas deben coincidir
    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }
    // Validación local: longitud mínima de 8 caracteres
    if (newPassword.length < 8) {
      return Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
    }
    // Activa el estado de carga
    setLoading(true);
    try {
      // Envía los datos al backend para actualizar la contraseña
      await apiAxios.post("/api/password-reset/cambiar-password", { 
        email, 
        codigo, 
        nuevo_email: newEmail || undefined,
        nueva_password: newPassword 
      });
      // Muestra mensaje de éxito al usuario
      Swal.fire("¡Éxito!", "Tus datos han sido actualizados. Ya puedes iniciar sesión.", "success");
      // Redirige al login
      navigate("/UserLogin");
    } catch (err) {
      // Muestra error si no se pudo cambiar la contraseña
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar la contraseña", "error");
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Estilos del contenedor principal que cubre toda la pantalla
  const containerStyle = {
    position: "fixed", top: 0, left: 0,
    height: "100vh", width: "100vw",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
    overflowY: "auto",
    padding: "40px 10px"
  };

  // Estilos de la tarjeta con efecto glassmorphism y animación de entrada
  const cardStyle = {
    position: "relative", zIndex: 10,
    minWidth: "320px", maxWidth: "400px", width: "90%",
    background: "rgba(255,255,255,0.91)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255,255,255,0.6)",
    padding: "40px", borderRadius: "24px",
    textAlign: "center",
    animation: "cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both",
    margin: "auto 0"
  };

  // Estilos base para los inputs del formulario
  const inputStyle = {
    borderRadius: "12px",
    padding: "12px 15px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.2s ease"
  };

  return (
    <div style={containerStyle}>
      <style>{`
        // Animación de burbujas ascendentes ultra suaves sin rotación
        @keyframes bubble {
          0% { transform: translateY(0) translateX(0px); opacity: 0; }
          10% { opacity: 0.75; }
          50% { transform: translateY(-60vh) translateX(8px); opacity: 0.75; }
          100% { transform: translateY(-120vh) translateX(-8px); opacity: 0; }
        }
        // Animación de gradiente para el título que brilla y fluye
        @keyframes textFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        // Estilo del título con gradiente animado
        .flowing-title {
          background: linear-gradient(120deg, #0077B6, #00B4D8, #6366F1, #0077B6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textFlow 6s linear infinite;
          display: inline-block;
        }
        // Animación de entrada de la tarjeta desde abajo
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        // Clase de la tarjeta de contraseña con glassmorphism
        .password-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 24px;
          background: rgba(255,255,255,0.91);
          color: #1f2937;
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.6);
          animation: cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both;
          position: relative;
          z-index: 10;
          text-align: center;
          margin: auto;
        }
        // Ajuste de padding para pantallas pequeñas
        @media (max-width: 480px) {
          .password-card {
            padding: 30px 20px !important;
          }
        }
        // Efecto de foco en los inputs
        .form-control:focus {
          border-color: #6366F1 !important;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.25) !important;
          background: #fff !important;
        }
        // Transición suave para los iconos de input
        .input-icon {
          transition: all 0.3s ease;
        }
        // Escala el icono cuando el input tiene foco
        .position-relative:has(.form-control:focus) .input-icon {
          transform: scale(1.22);
          color: #6366F1 !important;
        }
        // Grid holográfico de fondo
        .hologram-grid {
          position: fixed; inset: 0; z-index: 1;
          background-image: linear-gradient(rgba(0, 180, 216, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.035) 1px, transparent 1px);
          background-size: 45px 45px; pointer-events: none;
        }
      `}</style>

      {/*
        Fondo estático con la imagen del laboratorio
        cubre toda la pantalla detrás de la tarjeta
      */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${fondoLaboratorio})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/*
        Overlay de cuadrícula holográfica para efecto visual
      */}
      <div className="hologram-grid" />

      {/*
        Contenedor de burbujas flotantes animadas
        que ascienden desde la parte inferior de la pantalla
      */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { size: 45, left: 3, delay: 0.5, dur: 12 }, { size: 75, left: 18, delay: 2.1, dur: 18 },
          { size: 30, left: 25, delay: 4.3, dur: 10 }, { size: 90, left: 36, delay: 1.2, dur: 22 },
          { size: 55, left: 45, delay: 3.8, dur: 15 }, { size: 40, left: 52, delay: 0.8, dur: 11 },
          { size: 80, left: 63, delay: 5.4, dur: 19 }, { size: 65, left: 72, delay: 2.7, dur: 16 },
          { size: 35, left: 81, delay: 6.1, dur: 13 }, { size: 85, left: 91, delay: 8.2, dur: 24 },
          { size: 60, left: 12, delay: 3.3, dur: 14 }, { size: 50, left: 30, delay: 4.1, dur: 15 },
          { size: 70, left: 68, delay: 2.5, dur: 17 }, { size: 40, left: 76, delay: 0.6, dur: 10 },
          { size: 80, left: 88, delay: 6.4, dur: 20 }, { size: 45, left: 96, delay: 4.8, dur: 12 },
          { size: 30, left: 10, delay: 11.2, dur: 9 }, { size: 90, left: 54, delay: 2.3, dur: 23 },
          { size: 75, left: 20, delay: 7.1, dur: 18 }, { size: 55, left: 50, delay: 6.0, dur: 14 },
          // Mapea cada burbuja con su posición, tamaño y animación
        ].map((p, i) => (
          <div key={i} style={{
            // Posiciona la burbuja en la parte inferior con desplazamiento horizontal
            position: "absolute", bottom: "-100px", left: `${p.left}%`,
            // Define el tamaño circular de la burbuja
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            // Alterna el color de fondo entre azul translúcido y blanco
            background: i % 2 === 0 ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.12)",
            // Borde semitransparente para efecto de vidrio
            border: "1.5px solid rgba(255,255,255,0.4)",
            // Aplica la animación de ascenso con duración y delay personalizados
            animation: `bubble ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/*
        Tarjeta principal que contiene los 3 pasos del formulario
      */}
      <div className="password-card">
        <div style={{ position: "relative", marginBottom: "24px" }}>
          {/*
            Botón de retroceso: vuelve al paso anterior o al login
          */}
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/login")}
            style={{ 
              position: "absolute", left: "-10px", top: "0",
              background: "transparent", border: "none", color: "#64748b", cursor: "pointer"
            }}
          >
            <FaArrowLeft />
          </button>
          {/*
            Logo de Ecosystem centrado en la tarjeta
          */}
          <img src={logo} alt="Logo" style={{ width: "70px", display: "block", margin: "0 auto 10px" }} />
          {/*
            Título animado con gradiente
          */}
          <h3 className="flowing-title" style={{ margin: 0, fontWeight: "800" }}>Restablecer</h3>
          {/*
            Subtítulo dinámico según el paso actual
          */}
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
            {step === 1 && "Ingresa tu correo para recibir un código"}
            {step === 2 && "Ingresa el código de 6 dígitos enviado"}
            {step === 3 && "Ingresa tus nuevos datos de acceso"}
          </p>
        </div>

        {/*
          Paso 1: Formulario para solicitar código de verificación
        */}
        {step === 1 && (
          <form onSubmit={handleSolicitar}>
            <div className="mb-4 position-relative">
              {/*
                Icono de sobre dentro del campo de email
              */}
              <FaEnvelope className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              {/*
                Input de correo electrónico con validación required
              */}
              <input 
                type="email" 
                className="form-control ps-5" 
                placeholder="Tu correo electrónico" 
                required 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/*
              Botón para enviar la solicitud de código
            */}
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {/*
                Texto del botón cambia mientras se envía
              */}
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        )}

        {/*
          Paso 2: Formulario para verificar el código recibido
        */}
        {step === 2 && (
          <form onSubmit={handleVerificar}>
            <div className="mb-4 position-relative">
              {/*
                Icono de llave dentro del campo de código
              */}
              <FaKey className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              {/*
                Input para código de 6 dígitos con formato centrado y espaciado
              */}
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="Código de 6 dígitos" 
                required 
                maxLength="6"
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "8px", fontWeight: "bold", fontSize: "18px" }}
                value={codigo}
                // Solo permite dígitos eliminando cualquier carácter no numérico
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {/*
              Botón para verificar el código ingresado
            */}
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {/*
                Texto del botón cambia mientras se verifica
              */}
              {loading ? "Verificando..." : "Verificar Código"}
            </button>
            {/*
              Enlace para reenviar el código si no llegó
            */}
            <p style={{ marginTop: "15px", fontSize: "12px", color: "#64748b" }}>
              ¿No recibiste el código? <span onClick={handleSolicitar} style={{ color: "#0077B6", cursor: "pointer", fontWeight: "bold" }}>Reenviar</span>
            </p>
          </form>
        )}

        {/*
          Paso 3: Formulario para cambiar contraseña y opcionalmente email
        */}
        {step === 3 && (
          <form onSubmit={handleCambiar}>
            <div className="mb-3 position-relative">
              {/*
                Campo para nuevo correo (opcional)
              */}
              <FaEnvelope className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              <input 
                type="email" 
                className="form-control ps-5" 
                placeholder="Nuevo correo (opcional)" 
                style={inputStyle}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              {/*
                Indicación de que puede dejarse en blanco
              */}
              <small className="text-muted" style={{ fontSize: "10px", display: "block", textAlign: "left", marginTop: "4px" }}>
                Déjalo en blanco para mantener el actual.
              </small>
            </div>
            <div className="mb-3 position-relative">
              {/*
                Campo para nueva contraseña
              */}
              <FaLock className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              <input 
                type="password" 
                className="form-control ps-5" 
                placeholder="Nueva contraseña" 
                required 
                style={inputStyle}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-4 position-relative">
              {/*
                Campo para confirmar la nueva contraseña
              */}
              <FaLock className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              <input 
                type="password" 
                className="form-control ps-5" 
                placeholder="Confirmar contraseña" 
                required 
                style={inputStyle}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/*
              Botón para actualizar la cuenta con los nuevos datos
            */}
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {/*
                Texto del botón cambia mientras se actualiza
              */}
              {loading ? "Actualizando..." : "Actualizar Cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OlvidarPassword;
