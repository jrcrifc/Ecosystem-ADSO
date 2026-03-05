import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig";
import fondoRegistro from "../Home/fondo.jpeg"; // Ajusta la ruta

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    documentos: "",
    nombres: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    try {
      await apiAxios.post("/api/auth", form);
      alert("Usuario registrado correctamente ");
      navigate("/UserLogin");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    }
  };

  const inputStyle = {
    borderRadius: "25px",
    padding: "12px 15px",
    background: "rgba(247, 244, 244, 0.9)",
    border: "1px solid ",
    color: "#fff",
    outline: "none",
  };

  return (
       <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundImage: `url(${fondoRegistro})`,       
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 9999,
      }}
    >
          <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
          background: "rgba(0, 0, 0, 0.6)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
          color: "#fff",
        }}
      >
        <h2 className="text-center mb-4">Registro Usuario</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={registrarUsuario}>
          <input
            className="form-control mb-3"
            name="documentos"
            placeholder="Documento"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            className="form-control mb-3"
            name="nombres"
            placeholder="Nombre completo"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            className="form-control mb-4"
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              background: "linear-gradient(45deg, #00c9a7, #00796b)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Registrarse
          </button>

          <p className="mt-4 text-center">
            ¿Ya tienes cuenta?{" "}
            <span
              style={{ cursor: "pointer", color: "#00e6c3", fontWeight: "bold" }}
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

export default Register;