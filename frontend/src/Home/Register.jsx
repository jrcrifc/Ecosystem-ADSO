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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const errorStyle = { color: "#dc2626", fontSize: "11px", marginTop: "4px", fontWeight: "600" };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validación en tiempo real para documento (solo números)
    if (name === "documento" && value !== "" && !/^\d+$/.test(value)) return;

    // Validación en tiempo real para nombres (no números)
    if (name === "nombres_apellidos" && /\d/.test(value)) return;

    // Validación en tiempo real para número de ficha (solo números)
    if (name === "numero_ficha" && value !== "" && !/^\d+$/.test(value)) return;

    // Validación en tiempo real para nombre de ficha (solo letras y espacios, no números)
    if (name === "nombre_ficha" && /\d/.test(value)) return;

    let val = type === "checkbox" ? checked : value;
    
    // Convertir email a minúsculas y sin espacios en tiempo real
    if (name === "email") {
      val = (value || "").replace(/\s/g, "").toLowerCase();
    }

    setForm({ ...form, [name]: val });

    // Mensajes de error inline
    const errors = { ...fieldErrors };
    if (name === "documento") {
      if (value.length > 0 && value.length < 6) errors.documento = "Mínimo 6 dígitos.";
      else delete errors.documento;
    }
    if (name === "nombres_apellidos") {
      if (value && value.trim().split(" ").length < 2) errors.nombres_apellidos = "Ingresa nombres y apellidos completos.";
      else delete errors.nombres_apellidos;
    }
    if (name === "email") {
      if (value && !value.includes("@")) errors.email = "Falta el @ en el correo.";
      else if (value && (!value.includes(".") || value.split(".").pop().length < 2)) errors.email = "Falta el dominio (ej. .com, .co)";
      else delete errors.email;
    }
    if (name === "password") {
      if (value && value.length < 8) errors.password = "Mínimo 8 caracteres.";
      else delete errors.password;
    }
    if (name === "confirmPassword" || name === "password") {
      const p1 = name === "password" ? value : form.password;
      const p2 = name === "confirmPassword" ? value : form.confirmPassword;
      if (p2 && p1 !== p2) errors.confirmPassword = "Las contraseñas no coinciden.";
      else delete errors.confirmPassword;
    }
    setFieldErrors(errors);
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
      style={{
        position: "fixed", top: 0, left: 0,
        height: "100vh", width: "100vw",
        overflowY: "auto", overflowX: "hidden",
        zIndex: 9999,
        display: "grid", placeItems: "center", padding: "20px"
      }}
    >
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

        .register-card {
          width: 100%;
          max-width: 420px;
          padding: 25px 30px;
          border-radius: 24px;
          background: rgba(255,255,255,0.91);
          color: #1f2937;
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.6);
          animation: cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both;
          position: relative;
          z-index: 10;
          margin: auto;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 20px 15px !important;
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
        backgroundImage: `url(${fondoRegistro})`,
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

      <div className="register-card">
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
                value={form.documento} onChange={handleChange} required style={inputStyle} maxLength={11} />
              {fieldErrors.documento && <div style={errorStyle}>{fieldErrors.documento}</div>}
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Nombres y Apellidos Completos</label>
            <input className="form-control" name="nombres_apellidos" placeholder="Ej: Juan Pérez"
              value={form.nombres_apellidos} onChange={handleChange} required style={inputStyle} />
            {fieldErrors.nombres_apellidos && <div style={errorStyle}>{fieldErrors.nombres_apellidos}</div>}
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Correo Electrónico</label>
            <input className="form-control" type="email" name="email" placeholder="ejemplo@gmail.com"
              value={form.email} onChange={handleChange} required style={inputStyle} />
            {fieldErrors.email && <div style={errorStyle}>{fieldErrors.email}</div>}
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
              <div className="position-relative">
                <input className="form-control" type={showPassword ? "text" : "password"} name="password" placeholder="Mínimo 8"
                  value={form.password} onChange={handleChange} required style={{ ...inputStyle, paddingRight: "36px" }} />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    cursor: "pointer", color: "#64748b", fontSize: "16px"
                  }}
                />
              </div>
              {fieldErrors.password && <div style={errorStyle}>{fieldErrors.password}</div>}
            </div>
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Confirmar contraseña</label>
              <div className="position-relative">
                <input className="form-control" type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirma"
                  value={form.confirmPassword} onChange={handleChange} required style={{ ...inputStyle, paddingRight: "36px" }} />
                <i
                  className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    cursor: "pointer", color: "#64748b", fontSize: "16px"
                  }}
                />
              </div>
              {fieldErrors.confirmPassword && <div style={errorStyle}>{fieldErrors.confirmPassword}</div>}
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