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
          0% { transform: translateY(0) translateX(0px); opacity: 0; }
          10% { opacity: 0.75; }
          50% { transform: translateY(-60vh) translateX(8px); opacity: 0.75; }
          100% { transform: translateY(-120vh) translateX(-8px); opacity: 0; }
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

        @media (max-width: 480px) {
          .password-card {
            padding: 30px 20px !important;
          }
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
          position: fixed; inset: 0; z-index: 1;
          background-image: linear-gradient(rgba(0, 180, 216, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.035) 1px, transparent 1px);
          background-size: 45px 45px; pointer-events: none;
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

      {/* ── BURBUJAS FLOTANTES DE LABORATORIO ── */}
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
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", bottom: "-100px", left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            animation: `bubble ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      <div className="password-card">
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
