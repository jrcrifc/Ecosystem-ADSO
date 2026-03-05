import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import { FaEnvelope, FaLock } from "react-icons/fa";
import fondoLaboratorio from "../Home/fondo.jpeg";

const UserLogin = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gestionarLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiAxios.post("/api/auth/login", {
        email,
        password,
      });

      const { user } = response.data;

      // ✅ GUARDAR USUARIO COMPLETO
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ GUARDAR TOKEN POR SEPARADO (opcional pero recomendado)
      localStorage.setItem("token", user.token);

      // ✅ ACTIVAR AUTENTICACIÓN
      setIsAuth(true);

      // ✅ REDIRECCIÓN CORRECTA (minúscula)
      navigate("/home");

    } catch (err) {
      setError(
        err.response?.data?.message || "Email o contraseña incorrectos"
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
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundImage: `url(${fondoLaboratorio})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 9999,
      }}
    >
      <div
        className="p-5 rounded-4 shadow"
        style={{
          minWidth: "320px",
          maxWidth: "380px",
          width: "90%",
          textAlign: "center",
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          animation: "slideFade 0.8s ease forwards",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="mb-4">
          <img
            src="./src/Home/logotipo.jpeg"
            alt="Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "50%",
              marginBottom: "10px",
              border: "3px solid #00796b",
            }}
          />
          <h2 style={{ fontSize: "1.5rem", color: "#333", fontWeight: 700 }}>
            Laboratorio Ambiental
          </h2>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={gestionarLogin}>
          <div className="mb-3 position-relative">
            <FaEnvelope
              style={{
                position: "absolute",
                top: "12px",
                left: "15px",
                color: "#00796b",
                zIndex: 10,
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control ps-5"
              placeholder="Email"
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3 position-relative">
            <FaLock
              style={{
                position: "absolute",
                top: "12px",
                left: "15px",
                color: "#00796b",
                zIndex: 10,
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control ps-5"
              placeholder="Contraseña"
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold mt-2"
            disabled={loading}
            style={{
              backgroundColor: "#00796b",
              borderRadius: "20px",
              padding: "12px",
              color: "#fff",
              border: "none",
              transition: "0.3s",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

          <p className="mt-3">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#00796b",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Registrarse
            </span>
          </p>
        </form>
      </div>

      <style>
        {`
          * {
            margin: 0 !important;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            height: 100% !important;
            width: 100% !important;
            overflow: hidden !important;
          }

          @keyframes slideFade {
            0% { opacity: 0; transform: translateY(-20px);}
            100% { opacity: 1; transform: translateY(0);}
          }

          .form-control:focus { 
            border-color: #00796b !important;
            box-shadow: 0 0 8px rgba(0,121,107,0.4) !important;
          }

          .btn:hover {
            background-color: #004d40 !important;
            transform: scale(1.02);
          }
        `}
      </style>
    </div>
  );
};

export default UserLogin;