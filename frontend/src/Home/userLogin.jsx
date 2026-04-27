import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import { FaEnvelope, FaLock } from "react-icons/fa";
import fondoLaboratorio from "../Home/fondo.jpeg";
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
        minHeight: "100vh", width: "100vw",
        backgroundImage: `url(${fondoLaboratorio})`,
        backgroundPosition: "center", backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 9999,
      }}
    >
      <div
        className="p-5 rounded-4 shadow"
        style={{
          minWidth: "320px", maxWidth: "380px", width: "90%",
          textAlign: "center",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "16px", border: "3px solid #0077B6", boxShadow: "0 4px 15px rgba(0,119,182,0.2)" }} />
          <h2 className="mt-2" style={{ color: "#0f172a", fontWeight: "bold" }}>Ecosystem</h2>
          <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>Laboratorio Ambiental SENA</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={gestionarLogin}>
          <div className="mb-3 position-relative">
            <FaEnvelope style={{ position: "absolute", top: "12px", left: "15px", color: "#0077B6" }} />
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="form-control ps-5" placeholder="Email" required style={inputStyle} />
          </div>

          <div className="mb-3 position-relative">
            <FaLock style={{ position: "absolute", top: "12px", left: "15px", color: "#0077B6" }} />
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="form-control ps-5" placeholder="Contraseña" required style={inputStyle} />
          </div>

          <button type="submit" className="btn w-100 fw-bold mt-2" disabled={loading}
            style={{ background: "#0077B6", borderRadius: "20px", padding: "12px", color: "#fff", border: "none" }}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

          <p className="mt-3">
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