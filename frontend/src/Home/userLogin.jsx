import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import { FaEnvelope, FaLock } from "react-icons/fa";
import fondoLaboratorio from "../Home/laboratorio.png";
import logo from "../Home/ecosystem_logo.png";

const UserLogin = ({ setIsAuth, setUserData }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const gestionarLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        email: form.email.trim(),
        password: form.password.trim(),
      };

      if (!data.email || !data.password) {
        setError("Todos los campos son obligatorios");
        setLoading(false);
        return;
      }

      const response = await apiAxios.post("/api/auth/login", data);
      const { token, user } = response.data;

      if (!token || !user) throw new Error("Respuesta inválida del servidor");

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify({ ...user, token }));
      setUserData({ ...user, token });

      setUserData(user);
      setIsAuth(true);

      switch (user.rol) {
        case "Administrador":
          navigate("/dashboardAdmin");
          break;
        case "Instructor":
          navigate("/dashboardInstructor");
          break;
        case "Gestor":
          navigate("/dashboardGestor");
          break;
        case "Pasante":
          navigate("/dashboardPasante");
          break;
        case "Aprendiz":
          navigate("/dashboardAprendiz");
          break;
        default:
          navigate("/home");
      }

      setForm({ email: "", password: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Email o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderRadius: "20px",
    padding: "10px 15px",
    background: "#f5f5f5",
    color: "#333",
    border: "1px solid #ccc",
    outline: "none",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed", top: 0, left: 0,
        height: "100vh", width: "100vw",
        padding: "40px 10px", overflowY: "auto",
        zIndex: 9999
      }}
    >
      <style>{`
        /* ── DYNAMIC CARD GLOW: cambia de azul a violeta/indigo suavemente ── */
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

        /* ── Card entrance on load ── */
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        .login-card {
          animation: cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .login-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,119,182,0.45) !important;
        }
        .login-input:focus {
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

      {/* ── FONDO Estático ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${fondoLaboratorio})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Hologram blueprint overlay */}
      <div className="hologram-grid" />

      {/* ── AURAS DE LUZ (Efecto Químico/Laboratorio Estático) ── */}
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

      {/* ── CARD DE LOGIN ── */}
      <div
        className="login-card p-5 rounded-4"
        style={{
          position: "relative", zIndex: 10,
          minWidth: "320px", maxWidth: "390px", width: "90%",
          textAlign: "center",
          background: "rgba(255,255,255,0.91)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,0.6)",
          margin: "auto 0"
        }}
      >

        <div className="mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "16px", border: "2.5px solid #0077B6", display: "block", margin: "0 auto" }} />
          <h2 className="mt-2 flowing-title" style={{ fontWeight: "bold" }}>Ecosystem</h2>
          <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>Laboratorio Ambiental SENA</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={gestionarLogin}>
          <div className="mb-3 position-relative">
            <FaEnvelope className="input-icon" style={{ position: "absolute", top: "12px", left: "15px", color: "#0077B6" }} />
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="form-control ps-5" placeholder="Email" required style={inputStyle} />
          </div>

          <div className="mb-3 position-relative">
            <FaLock className="input-icon" style={{ position: "absolute", top: "12px", left: "15px", color: "#0077B6" }} />
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="form-control ps-5" placeholder="Contraseña" required style={inputStyle} />
          </div>

          <div className="text-end mb-3">
            <span 
              onClick={() => navigate("/olvidar-password")}
              style={{ color: "#64748b", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button type="submit" className="btn w-100 fw-bold mt-2 login-btn" disabled={loading}
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", borderRadius: "20px", padding: "12px", color: "#fff", border: "none", boxShadow: "0 8px 20px rgba(0,119,182,0.35)" }}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

          <p className="mt-3" style={{ color: "#334155", fontSize: "14px" }}>
            ¿No tienes cuenta?{" "}
            <span onClick={() => navigate("/register")}
              style={{ color: "#0077B6", fontWeight: "bold", cursor: "pointer" }}>
              Registrarse
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;