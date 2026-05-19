import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig";
import fondoRegistro from "../Home/fondo.jpeg";

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
    
    if (docTrim.length < 5) return setError("El documento es demasiado corto.");
    if (nombreTrim.split(" ").length < 2) return setError("Por favor, ingresa nombres y apellidos completos.");
    if (form.password !== form.confirmPassword) return setError("Las contraseñas no coinciden.");
    if (form.password.length < 8) return setError("La contraseña debe tener mínimo 8 caracteres.");

    // Validar campos de ficha
    if (!form.numero_ficha.trim()) return setError("El número de ficha es obligatorio.");
    if (!form.nombre_ficha.trim()) return setError("El nombre de la ficha es obligatorio.");

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
        backgroundImage: `url(${fondoRegistro})`,
        backgroundSize: "cover", backgroundPosition: "center",
        padding: "10px", overflow: "hidden"
      }}
    >
      <div style={{
        width: "100%", maxWidth: "420px", padding: "25px 30px",
        borderRadius: "24px", background: "rgba(255,255,255,0.95)", color: "#1f2937",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        maxHeight: "96vh", overflowY: "auto", backdropFilter: "blur(10px)"
      }}>
        <h2 className="text-center mb-3" style={{ fontWeight: "800", fontSize: "22px", color: "#0077B6" }}>
          🚀 Crear Cuenta
        </h2>

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

          <div className="mb-2" style={{ animation: "fadeIn 0.3s ease-out" }}>
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

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Contraseña</label>
              <input className="form-control" type="password" name="password" placeholder="Mínimo 8"
                value={form.password} onChange={handleChange} required style={inputStyle} />
            </div>
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Repetir</label>
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