import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig";
import fondoRegistro from "../Home/fondo.jpeg";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    documentos: "",
    nombres: "",
    email: "",
    password: "",
    rol: "Aprendiz"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        ...form,
        documentos: form.documentos.trim(),
        nombres: form.nombres.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      };

      if (data.password.length < 8) {
        setError("La contraseña debe tener mínimo 8 caracteres");
        setLoading(false);
        return;
      }

      await apiAxios.post("/api/auth", data);
      alert("✅ Usuario registrado correctamente");
      navigate("/UserLogin");

    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${fondoRegistro})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "10px", // Margen mínimo para que no toque bordes en móvil
        overflow: "hidden" // Asegura que no haya scroll en el contenedor padre
      }}
    >
      <div
        className="custom-scrollbar" // Clase para scroll, pero estilizado o nulo
        style={{
          width: "100%",
          maxWidth: "380px", // 🤏 Un poco más estrecho para verse más pequeño (antes 400px)
          padding: "20px 25px", // 🤏 Padding vertical reducido (antes 30px)
          borderRadius: "20px",
          background: "#ffffff",
          color: "#1f2937",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)", // Sombra más suave
          border: "1px solid rgba(0,0,0,0.03)",
          maxHeight: "96vh", // Ocupa casi todo el alto si es necesario
          overflowY: "auto",  // Mantenemos scroll interno, pero vamos a ocultar la barra con CSS global si lo deseas.
          scrollbarWidth: "none", // Oculta barra en Firefox
          msOverflowStyle: "none" // Oculta barra en IE/Edge
        }}
      >
        <h2 className="text-center mb-3" style={{ fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🚀</span> Crear Cuenta
        </h2>

        {error && <div className="alert alert-danger p-2" style={{ fontSize: "12px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={registrarUsuario}>

          {/* ROL */}
          <div className="mb-2">
            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>
              Tipo de usuario
            </label>

            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              {["Aprendiz", "Pasante", "Instructor"].map((rolValue) => (
                <div
                  key={rolValue}
                  onClick={() => setForm({ ...form, rol: rolValue })}
                  style={{
                    flex: 1,
                    padding: "8px 3px", // 🤏 Botones más compactos (vertical)
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "11px", // Fuente un punto más pequeña
                    fontWeight: "600",
                    border: form.rol === rolValue ? "2px solid #10b981" : "2px solid #e5e7eb",
                    background: form.rol === rolValue ? "#10b981" : "#f9fafb",
                    color: form.rol === rolValue ? "#fff" : "#374151"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {rolValue}
                </div>
              ))}
            </div>
          </div>

          {/* INPUTS - MÁRGENES mb-2 PARA QUE ESTÉN MÁS JUNTOS */}
          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Documento</label>
            <input
              className="form-control"
              name="documentos"
              placeholder="Ej: 123456789"
              value={form.documentos}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Nombres y Apellidos</label>
            <input
              className="form-control"
              name="nombres"
              placeholder="Ej: Juan Pérez"
              value={form.nombres}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Correo</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="correo@email.com"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3"> {/* mb-3 antes del botón final */}
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Contraseña</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="btn w-100"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "10px", // Bordes más suaves, no tan circulares
              padding: "10px", // 🤏 Un poco menos de padding vertical
              fontSize: "14px", // Fuente un punto más pequeña
              border: "none",
              boxShadow: "0 5px 15px rgba(16,185,129,0.25)", // Sombra más contenida
              transition: "all 0.2s ease"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="mt-3 text-center" style={{ fontSize: "13px", color: "#6b7280" }}>
            ¿Ya tienes cuenta?{" "}
            <span
              style={{ color: "#10b981", cursor: "pointer", fontWeight: "600" }}
              onClick={() => navigate("/UserLogin")}
            >
              Iniciar sesión
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "8px 10px", // 🤏 Input más delgado
  fontSize: "13px",    // 🤏 Fuente más pequeña en inputs
  transition: "all 0.15s ease",
  outline: "none"
};

export default Register;