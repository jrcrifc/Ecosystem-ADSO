import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import { FaEnvelope, FaKey, FaLock, FaArrowLeft } from "react-icons/fa";
import logo from "../Home/ecosystem_logo.png";
import fondoLaboratorio from "../Home/fondo.jpeg";

const OlvidarPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Solicitar, 2: Verificar, 3: Cambiar
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiAxios.post("/api/password-reset/solicitar-codigo", { email });
      Swal.fire("Código Enviado", "Si el correo está registrado, recibirás un código de 6 dígitos.", "success");
      setStep(2);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo enviar el código", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiAxios.post("/api/password-reset/verificar-codigo", { email, codigo });
      Swal.fire("Código Válido", "El código es correcto. Ahora ingresa tu nueva contraseña.", "success");
      setStep(3);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Código incorrecto o expirado", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiar = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }
    if (newPassword.length < 8) {
      return Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
    }

    setLoading(true);
    try {
      await apiAxios.post("/api/password-reset/cambiar-password", { 
        email, 
        codigo, 
        nuevo_email: newEmail || undefined,
        nueva_password: newPassword 
      });
      Swal.fire("¡Éxito!", "Tus datos han sido actualizados. Ya puedes iniciar sesión.", "success");
      navigate("/UserLogin");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar la contraseña", "error");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    position: "fixed", top: 0, left: 0,
    minHeight: "100vh", width: "100vw",
    backgroundImage: `url(${fondoLaboratorio})`,
    backgroundPosition: "center", backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  };

  const cardStyle = {
    minWidth: "320px", maxWidth: "400px", width: "90%",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    padding: "40px", borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    textAlign: "center"
  };

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
      <div style={cardStyle}>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/login")}
            style={{ 
              position: "absolute", left: "-10px", top: "0",
              background: "transparent", border: "none", color: "#64748b", cursor: "pointer"
            }}
          >
            <FaArrowLeft />
          </button>
          <img src={logo} alt="Logo" style={{ width: "70px", marginBottom: "10px" }} />
          <h3 style={{ margin: 0, color: "#0f172a", fontWeight: "800" }}>Restablecer</h3>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
            {step === 1 && "Ingresa tu correo para recibir un código"}
            {step === 2 && "Ingresa el código de 6 dígitos enviado"}
            {step === 3 && "Ingresa tus nuevos datos de acceso"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSolicitar}>
            <div className="mb-4 position-relative">
              <FaEnvelope style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerificar}>
            <div className="mb-4 position-relative">
              <FaKey style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="Código de 6 dígitos" 
                required 
                maxLength="6"
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "8px", fontWeight: "bold", fontSize: "18px" }}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {loading ? "Verificando..." : "Verificar Código"}
            </button>
            <p style={{ marginTop: "15px", fontSize: "12px", color: "#64748b" }}>
              ¿No recibiste el código? <span onClick={handleSolicitar} style={{ color: "#0077B6", cursor: "pointer", fontWeight: "bold" }}>Reenviar</span>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCambiar}>
            <div className="mb-3 position-relative">
              <FaEnvelope style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
              <input 
                type="email" 
                className="form-control ps-5" 
                placeholder="Nuevo correo (opcional)" 
                style={inputStyle}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <small className="text-muted" style={{ fontSize: "10px", display: "block", textAlign: "left", marginTop: "4px" }}>
                Déjalo en blanco para mantener el actual.
              </small>
            </div>
            <div className="mb-3 position-relative">
              <FaLock style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
              <FaLock style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
            <button 
              type="submit" 
              className="btn w-100 fw-bold" 
              disabled={loading}
              style={{ background: "#0077B6", color: "#fff", padding: "14px", borderRadius: "12px", border: "none" }}
            >
              {loading ? "Actualizando..." : "Actualizar Cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OlvidarPassword;
