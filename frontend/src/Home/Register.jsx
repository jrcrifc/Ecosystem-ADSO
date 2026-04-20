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
    rol: "Aprendiz"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = {
        documento: form.documento.trim(),
        nombres_apellidos: form.nombres_apellidos.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        rol: form.rol
      };

      if (data.password.length < 8) {
        setError("La contraseña debe tener mínimo 8 caracteres");
        setLoading(false);
        return;
      }

      await apiAxios.post("/api/auth", data);

      setSuccess("✅ Registro exitoso. Espera a que el administrador apruebe tu cuenta.");
      setForm({ documento: "", nombres_apellidos: "", email: "", password: "", rol: "Aprendiz" });

      setTimeout(() => navigate("/UserLogin"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar el usuario");
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
        width: "100%", maxWidth: "380px", padding: "20px 25px",
        borderRadius: "20px", background: "#ffffff", color: "#1f2937",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        maxHeight: "96vh", overflowY: "auto"
      }}>
        <h2 className="text-center mb-3" style={{ fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🚀</span> Crear Cuenta
        </h2>

        {error && <div className="alert alert-danger p-2" style={{ fontSize: "12px", textAlign: "center" }}>{error}</div>}
        {success && <div className="alert alert-success p-2" style={{ fontSize: "12px", textAlign: "center" }}>{success}</div>}

        <form onSubmit={registrarUsuario}>
          {/* Tipo de usuario — sin Administrador */}
          <div className="mb-2">
            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Tipo de usuario</label>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              {["Aprendiz", "Pasante", "Gestor", "Instructor"].map((rolValue) => (
                <div
                  key={rolValue}
                  onClick={() => setForm({ ...form, rol: rolValue })}
                  style={{
                    flex: 1, padding: "8px 3px", borderRadius: "8px",
                    textAlign: "center", cursor: "pointer", fontSize: "11px", fontWeight: "600",
                    border: form.rol === rolValue ? "2px solid #10b981" : "2px solid #e5e7eb",
                    background: form.rol === rolValue ? "#10b981" : "#f9fafb",
                    color: form.rol === rolValue ? "#fff" : "#374151"
                  }}
                >
                  {rolValue}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Documento</label>
            <input className="form-control" name="documento" placeholder="Ej: 123456789"
              value={form.documento} onChange={handleChange} required style={inputStyle} />
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Nombres y Apellidos</label>
            <input className="form-control" name="nombres_apellidos" placeholder="Ej: Miguel Santiago Bocanegra"
              value={form.nombres_apellidos} onChange={handleChange} required style={inputStyle} />
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Correo</label>
            <input className="form-control" type="email" name="email" placeholder="correo@email.com"
              value={form.email} onChange={handleChange} required style={inputStyle} />
          </div>

          <div className="mb-3">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Contraseña</label>
            <input className="form-control" type="password" name="password" placeholder="Mínimo 8 caracteres"
              value={form.password} onChange={handleChange} required style={inputStyle} />
          </div>

          <button type="submit" className="btn w-100" disabled={loading}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", fontWeight: "bold", borderRadius: "10px",
              padding: "10px", fontSize: "14px", border: "none",
              boxShadow: "0 5px 15px rgba(16,185,129,0.25)"
            }}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="mt-3 text-center" style={{ fontSize: "13px", color: "#6b7280" }}>
            ¿Ya tienes cuenta?{" "}
            <span style={{ color: "#10b981", cursor: "pointer", fontWeight: "600" }}
              onClick={() => navigate("/UserLogin")}>
              Iniciar sesión
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