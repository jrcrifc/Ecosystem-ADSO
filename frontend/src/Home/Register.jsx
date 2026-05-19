import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig";
import fondoRegistro from "../Home/laboratorio.png";
import logo from "../Home/ecosystem_logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    documento: "",
    nombres_apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "Aprendiz",
    numero_ficha: "",
    nombre_ficha: "",
    es_sena_empresa: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validación en tiempo real para documento (solo números)
    if (name === "documento" && value !== "" && !/^\d+$/.test(value)) return;

    // Validación en tiempo real para nombres (no números)
    if (name === "nombres_apellidos" && /\d/.test(value)) return;

    const val = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones extra "a prueba de tontos"
    const docTrim = form.documento.trim();
    const nombreTrim = form.nombres_apellidos.trim();
    const emailTrim = form.email.trim().toLowerCase();
    const necesitaFicha = form.rol !== "Administrador";

    if (docTrim.length < 5) return setError("El documento es demasiado corto.");
    if (nombreTrim.split(" ").length < 2) return setError("Por favor, ingresa nombres y apellidos completos.");
    if (form.password !== form.confirmPassword) return setError("Las contraseñas no coinciden.");
    if (form.password.length < 8) return setError("La contraseña debe tener mínimo 8 caracteres.");

    // Validar campos de ficha solo si no es Administrador
    if (necesitaFicha && !form.numero_ficha.trim()) return setError("El número de ficha es obligatorio.");
    if (necesitaFicha && !form.nombre_ficha.trim()) return setError("El nombre de la ficha es obligatorio.");

    setLoading(true);

    try {
      const data = {
        documento: docTrim,
        nombres_apellidos: nombreTrim,
        email: emailTrim,
        password: form.password,
        rol: form.rol,
        numero_ficha: form.numero_ficha.trim(),
        nombre_ficha: form.nombre_ficha.trim(),
        es_sena_empresa: form.es_sena_empresa
      };

      await apiAxios.post("/api/auth", data);

      setSuccess("✅ Registro exitoso. Tu cuenta está en revisión por el administrador.");
      setForm({
        documento: "",
        nombres_apellidos: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "Aprendiz",
        numero_ficha: "",
        nombre_ficha: "",
        es_sena_empresa: false
      });

      setTimeout(() => navigate("/UserLogin"), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar el usuario. Revisa los datos.");
    } finally {
      setLoading(false);
    }
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
        backgroundImage: `url(${fondoRegistro})`,
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

      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "420px", padding: "25px 30px",
        borderRadius: "24px", background: "rgba(255,255,255,0.91)", color: "#1f2937",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(255,255,255,0.6)",
        animation: "cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both",
        margin: "auto 0"
      }}>
        <div className="text-center mb-3">
          <h2 className="flowing-title" style={{ fontWeight: "800", fontSize: "22px", display: "inline-block" }}>
            Crear Cuenta
          </h2>
          <div style={{ marginTop: "10px" }}>
            <img src={logo} alt="Logo" style={{ width: "70px", height: "70px", borderRadius: "14px", border: "2.5px solid #0077B6", display: "block", margin: "0 auto" }} />
          </div>
        </div>

        {error && <div className="alert alert-danger p-2 mb-3" style={{ fontSize: "12px", textAlign: "center", borderRadius: "10px", border: "none", background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
        {success && <div className="alert alert-success p-2 mb-3" style={{ fontSize: "12px", textAlign: "center", borderRadius: "10px", border: "none", background: "#dcfce7", color: "#166534" }}>{success}</div>}

        <form onSubmit={registrarUsuario}>
          {/* Tipo de usuario */}
          <div className="mb-3">
            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px", d: "block" }}>¿Cuál es tu rol?</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Aprendiz", "Pasante", "Gestor", "Instructor"].map((rolValue) => (
                <div
                  key={rolValue}
                  onClick={() => setForm({ ...form, rol: rolValue })}
                  style={{
                    flex: 1, padding: "10px 4px", borderRadius: "12px",
                    textAlign: "center", cursor: "pointer", fontSize: "11px", fontWeight: "700",
                    border: form.rol === rolValue ? "2px solid #0077B6" : "2px solid #f1f5f9",
                    background: form.rol === rolValue ? "#0077B6" : "#f8fafc",
                    color: form.rol === rolValue ? "#fff" : "#64748b",
                    transition: "all 0.2s ease"
                  }}
                >
                  {rolValue}
                </div>
              ))}
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-12">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Documento de Identidad</label>
              <input className="form-control" name="documento" placeholder="Ingresa solo números"
                value={form.documento} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Nombres y Apellidos Completos</label>
            <input className="form-control" name="nombres_apellidos" placeholder="Ej: Juan Pérez"
              value={form.nombres_apellidos} onChange={handleChange} required style={inputStyle} />
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Correo Electrónico</label>
            <input className="form-control" type="email" name="email" placeholder="ejemplo@gmail.com"
              value={form.email} onChange={handleChange} required style={inputStyle} />
          </div>

          {form.rol !== "Administrador" && (
            <div className="mb-2">
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Número de Ficha</label>
                  <input className="form-control" name="numero_ficha" placeholder="Ej: 2558832"
                    value={form.numero_ficha} onChange={handleChange} required style={inputStyle} />
                </div>
                <div className="col-6">
                  <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Nombre de la Ficha</label>
                  <input className="form-control" name="nombre_ficha" placeholder="Ej: ADSO"
                    value={form.nombre_ficha} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div className="form-check d-flex align-items-center gap-2 mb-3 mt-2" style={{ paddingLeft: "5px" }}>
                <input className="form-check-input" type="checkbox" name="es_sena_empresa" id="es_sena_empresa"
                  checked={form.es_sena_empresa} onChange={handleChange} style={{ width: "17px", height: "17px", cursor: "pointer", border: "1px solid #cbd5e1" }} />
                <label className="form-check-label" htmlFor="es_sena_empresa" style={{ fontSize: "12px", fontWeight: "600", color: "#475569", cursor: "pointer", userSelect: "none" }}>
                  ¿Es SENA Empresa? 🏢
                </label>
              </div>
            </div>
          )}

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Contraseña</label>
              <input className="form-control" type="password" name="password" placeholder="Mínimo 8"
                value={form.password} onChange={handleChange} required style={inputStyle} />
            </div>
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Confirmar contraseña</label>
              <input className="form-control" type="password" name="confirmPassword" placeholder="Confirma"
                value={form.confirmPassword} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <button type="submit" className="btn w-100 py-3" disabled={loading}
            style={{
              background: "#0077B6",
              color: "#fff", fontWeight: "800", borderRadius: "14px",
              fontSize: "15px", border: "none",
              boxShadow: "0 10px 20px rgba(0,119,182,0.2)",
              transition: "transform 0.2s"
            }}>
            {loading ? "Creando cuenta..." : "Crear mi Cuenta"}
          </button>

          <p className="mt-4 text-center" style={{ fontSize: "13px", color: "#64748b" }}>
            ¿Ya tienes cuenta?{" "}
            <span style={{ color: "#0077B6", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}
              onClick={() => navigate("/UserLogin")}>
              Inicia sesión aquí
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  background: "#f9fafb", border: "1px solid #e5e7eb",
  borderRadius: "8px", padding: "8px 10px",
  fontSize: "13px", outline: "none"
};

export default Register;