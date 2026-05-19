import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import { FaEnvelope, FaKey, FaLock, FaArrowLeft } from "react-icons/fa";
import logo from "../Home/ecosystem_logo.png";
import fondoLaboratorio from "../Home/laboratorio.png";

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
    height: "100vh", width: "100vw",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
    overflowY: "auto",
    padding: "40px 10px"
  };

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
        /* ── BUBBLES: Burbujas ascendentes ultra suaves sin rotación ── */
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.75;
          }
          50% {
            transform: translateY(-60vh) translateX(8px);
            opacity: 0.75;
          }
          100% {
            transform: translateY(-120vh) translateX(-8px);
            opacity: 0;
          }
        }

        /* ── GRADIENT TEXT FLOW: El título brilla y fluye ── */
        @keyframes textFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .flowing-title {
          background: linear-gradient(120deg, #0077B6, #00B4D8, #6366F1, #0077B6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textFlow 6s linear infinite;
          display: inline-block;
        }

        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        .form-control:focus {
          border-color: #6366F1 !important;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.25) !important;
          background: #fff !important;
        }

        .input-icon {
          transition: all 0.3s ease;
        }
        .position-relative:has(.form-control:focus) .input-icon {
          transform: scale(1.22);
          color: #6366F1 !important;
        }

        /* ── HOLOGRAPHIC GRID ── */
        .hologram-grid {
          position: fixed;
          inset: 0;
          z-index: 1;
          background-image: 
            linear-gradient(rgba(0, 180, 216, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 216, 0.035) 1px, transparent 1px);
          background-size: 45px 45px;
          pointer-events: none;
        }
      `}</style>

      {/* Fondo Estático */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${fondoLaboratorio})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Hologram blueprint overlay */}
      <div className="hologram-grid" />

      {/* ── BURBUJAS FLOTANTES DE LABORATORIO (Sin rotación, grandes y abundantes) ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { size: 45, left: 3, delay: 0.5, dur: 12 },
          { size: 75, left: 8, delay: 2.1, dur: 18 },
          { size: 30, left: 12, delay: 4.3, dur: 10 },
          { size: 90, left: 16, delay: 1.2, dur: 22 },
          { size: 55, left: 21, delay: 3.8, dur: 15 },
          { size: 40, left: 25, delay: 0.8, dur: 11 },
          { size: 80, left: 29, delay: 5.4, dur: 19 },
          { size: 65, left: 33, delay: 2.7, dur: 16 },
          { size: 35, left: 37, delay: 6.1, dur: 13 },
          { size: 85, left: 41, delay: 8.2, dur: 24 },
          { size: 25, left: 45, delay: 0.2, dur: 9 },
          { size: 60, left: 48, delay: 3.3, dur: 14 },
          { size: 45, left: 52, delay: 5.7, dur: 12 },
          { size: 95, left: 56, delay: 1.9, dur: 25 },
          { size: 50, left: 60, delay: 4.1, dur: 15 },
          { size: 30, left: 64, delay: 7.3, dur: 11 },
          { size: 70, left: 68, delay: 2.5, dur: 17 },
          { size: 55, left: 72, delay: 8.9, dur: 14 },
          { size: 40, left: 76, delay: 0.6, dur: 10 },
          { size: 80, left: 80, delay: 6.4, dur: 20 },
          { size: 60, left: 84, delay: 3.1, dur: 15 },
          { size: 35, left: 88, delay: 5.2, dur: 13 },
          { size: 75, left: 92, delay: 1.4, dur: 18 },
          { size: 45, left: 96, delay: 4.8, dur: 12 },
          { size: 85, left: 5, delay: 9.1, dur: 21 },
          { size: 30, left: 10, delay: 11.2, dur: 9 },
          { size: 50, left: 14, delay: 0.1, dur: 14 },
          { size: 70, left: 18, delay: 3.6, dur: 17 },
          { size: 40, left: 23, delay: 6.8, dur: 11 },
          { size: 90, left: 27, delay: 2.3, dur: 23 },
          { size: 55, left: 31, delay: 5.9, dur: 16 },
          { size: 35, left: 35, delay: 8.4, dur: 12 },
          { size: 80, left: 39, delay: 1.7, dur: 20 },
          { size: 60, left: 43, delay: 4.6, dur: 15 },
          { size: 30, left: 47, delay: 7.9, dur: 10 },
          { size: 75, left: 51, delay: 10.3, dur: 19 },
          { size: 50, left: 55, delay: 0.4, dur: 13 },
          { size: 95, left: 59, delay: 3.2, dur: 24 },
          { size: 65, left: 63, delay: 6.1, dur: 18 },
          { size: 40, left: 67, delay: 1.1, dur: 11 },
          { size: 85, left: 71, delay: 5.3, dur: 22 },
          { size: 55, left: 75, delay: 2.8, dur: 14 },
          { size: 30, left: 79, delay: 8.7, dur: 9 },
          { size: 70, left: 83, delay: 4.2, dur: 16 },
          { size: 45, left: 87, delay: 9.6, dur: 12 },
          { size: 90, left: 91, delay: 1.5, dur: 23 },
          { size: 60, left: 95, delay: 6.3, dur: 15 },
          { size: 35, left: 2, delay: 10.1, dur: 11 },
          { size: 80, left: 7, delay: 0.9, dur: 20 },
          { size: 50, left: 11, delay: 5.2, dur: 14 },
          { size: 25, left: 15, delay: 2.4, dur: 8 },
          { size: 75, left: 20, delay: 7.1, dur: 18 },
          { size: 60, left: 24, delay: 3.5, dur: 16 },
          { size: 40, left: 28, delay: 9.8, dur: 12 },
          { size: 95, left: 32, delay: 0.3, dur: 25 },
          { size: 70, left: 36, delay: 5.6, dur: 17 },
          { size: 45, left: 40, delay: 11.5, dur: 13 },
          { size: 85, left: 44, delay: 2.2, dur: 22 },
          { size: 55, left: 49, delay: 8.1, dur: 15 },
          { size: 30, left: 53, delay: 4.7, dur: 10 },
          { size: 80, left: 57, delay: 10.4, dur: 19 },
          { size: 65, left: 61, delay: 1.6, dur: 16 },
          { size: 35, left: 65, delay: 6.9, dur: 12 },
          { size: 90, left: 69, delay: 3.9, dur: 23 },
          { size: 50, left: 73, delay: 9.2, dur: 14 },
          { size: 75, left: 77, delay: 0.7, dur: 19 },
          { size: 40, left: 81, delay: 5.1, dur: 11 },
          { size: 85, left: 85, delay: 11.8, dur: 21 },
          { size: 60, left: 89, delay: 2.6, dur: 15 },
          { size: 30, left: 93, delay: 8.5, dur: 9 },
          { size: 70, left: 97, delay: 4.4, dur: 17 },
          { size: 25, left: 1, delay: 1.1, dur: 8 },
          { size: 80, left: 46, delay: 12.0, dur: 20 },
          { size: 55, left: 50, delay: 6.0, dur: 14 },
          { size: 90, left: 54, delay: 0.0, dur: 22 },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", bottom: "-100px", left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.4)", backdropFilter: "blur(1px)",
            animation: `bubble ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

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
          <img src={logo} alt="Logo" style={{ width: "70px", display: "block", margin: "0 auto 10px" }} />
          <h3 className="flowing-title" style={{ margin: 0, fontWeight: "800" }}>Restablecer</h3>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
            {step === 1 && "Ingresa tu correo para recibir un código"}
            {step === 2 && "Ingresa el código de 6 dígitos enviado"}
            {step === 3 && "Ingresa tus nuevos datos de acceso"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSolicitar}>
            <div className="mb-4 position-relative">
              <FaEnvelope className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
              <FaKey className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
              <FaEnvelope className="input-icon" style={{ position: "absolute", top: "14px", left: "15px", color: "#0077B6" }} />
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
