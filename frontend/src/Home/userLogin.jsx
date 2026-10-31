import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import { FaUser, FaLock, FaTimes } from "react-icons/fa";
import logo from "../Home/nuevologoecosystem.png";
import fondoLaboratorio from "../Home/laboratorio.webp";

const UserLogin = ({ setIsAuth, setUserData }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ tipo_documento: "CC", documento: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => {
    setForm({ tipo_documento: "CC", documento: "", password: "" });
    setError("");
    setShowLoginModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const gestionarLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        documento: form.documento.trim(),
        password: form.password.trim(),
      };

      if (!data.documento || !data.password) {
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
        default:
          navigate("/home");
      }

      setForm({ tipo_documento: "CC", documento: "", password: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Documento/Correo o contraseña incorrectos";
      setError(errorMsg);
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
    <div className="landing-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500;600&display=swap');
        
        .landing-container {
          position: fixed; top: 0; left: 0;
          height: 100vh; width: 100vw;
          overflow-y: auto; overflow-x: hidden;
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${fondoLaboratorio}) center/cover no-repeat;
          font-family: 'Outfit', 'Inter', sans-serif;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        /* Navbar */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 50px;
          background: transparent;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .landing-nav .brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .landing-nav .brand img {
          height: 60px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
        }
        
        .landing-nav .brand-name {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
        }

        .login-trigger-btn {
          background: #0077B6;
          color: #ffffff;
          border: 2px solid #0077B6;
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0, 119, 182, 0.3);
        }
        
        .login-trigger-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          flex: 1;
          padding: 20px 50px;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          gap: 30px;
        }

        .hero-left {
          flex: 1;
          max-width: 600px;
        }

        .platform-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 16px;
          border-radius: 20px;
          color: #000000;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 20px;
        }
        
        .hero-title span {
          display: block;
          color: #000000;
          text-shadow: 0px 0px 10px rgba(255,255,255,0.8);
          font-size: clamp(1.5rem, 3.8vw, 2.8rem);
          margin-top: 6px;
        }

        .hero-desc {
          font-size: 1.1rem;
          color: #eee;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 500px;
        }

        /* Hero Right */
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          position: relative;
        }

        .floating-element {
          width: 100%;
          max-width: 270px;
          max-height: 320px;
          object-fit: contain;
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
          image-rendering: auto;
          transform: translateZ(0);
          will-change: transform;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateZ(0); }
          50% { transform: translateY(-20px) translateZ(0) scale(1.02); filter: drop-shadow(0 30px 40px rgba(0,0,0,0.25)); }
          100% { transform: translateY(0px) translateZ(0); }
        }

        /* Modal Background */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          padding: 16px;
        }
        
        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        /* Login Card Inside Modal */
        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          transform: translateY(20px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        
        .modal-overlay.show .login-card {
          transform: translateY(0) scale(1);
        }

        .close-modal-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-modal-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .login-btn {
          background: linear-gradient(135deg, #0077B6, #023E8A);
          border-radius: 20px;
          padding: 12px;
          color: #fff;
          border: none;
          width: 100%;
          font-weight: bold;
          margin-top: 10px;
          box-shadow: 0 8px 20px rgba(0, 119, 182, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 119, 182, 0.45);
        }
        
        .input-icon {
          position: absolute; top: 12px; left: 15px; color: #0077B6;
          transition: all 0.3s ease;
        }
        .position-relative:has(.form-control:focus) .input-icon {
          transform: scale(1.22);
        }
        
        @media (max-width: 900px) {
          .hero-section { flex-direction: column; text-align: center; padding: 20px; justify-content: center; }
          .hero-left { margin-bottom: 20px; }
          .hero-desc { margin: 0 auto 24px auto; font-size: 1rem; }
          .hero-right { justify-content: center; }
          .floating-element { max-width: 190px; max-height: 220px; }
          .landing-nav { padding: 16px 20px; }
        }

        @media (max-width: 640px) {
          .landing-nav {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 16px;
            gap: 14px;
          }
          .landing-nav .brand {
            justify-content: center;
          }
          .landing-nav-actions {
            justify-content: center !important;
            width: 100%;
          }
          .landing-nav .brand img { height: 46px; }
          .landing-nav .brand-name { font-size: 21px; }
          .login-trigger-btn { padding: 9px 20px; font-size: 14px; }
          .acerca-btn { padding: 9px 20px !important; font-size: 14px !important; }
          .login-card { padding: 28px 20px; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="brand">
          <img src={logo} alt="Ecosystem Logo" />
          <span className="brand-name">Ecosystem</span>
        </div>
        <div className="landing-nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="acerca-btn"
            onClick={() => navigate('/acerca-de')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.6)',
              padding: '10px 24px',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Acerca de
          </button>
          <button className="login-trigger-btn" onClick={openLoginModal}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-left">
          <div className="platform-badge">
            Laboratorio Ambiental
          </div>
          <h1 className="hero-title">
            Ecosystem
            <span>Gestión de Laboratorio Ambiental</span>
          </h1>
          <p className="hero-desc">
            Control eficiente y avanzado del proceso en el laboratorio. Gestionar equipos,
            Inventario de reactivos, Gestionar solicitudes desde una sola plataforma profesional.
          </p>
        </div>

        <div className="hero-right">
          <img src={logo} alt="Laboratorio 3D" className="floating-element" />
        </div>
      </main>

      {/* Login Modal Overlay */}
      <div className={`modal-overlay ${showLoginModal ? 'show' : ''}`} onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) setShowLoginModal(false);
      }}>
        <div className="login-card">
          <button className="close-modal-btn" onClick={() => setShowLoginModal(false)}>
            <FaTimes />
          </button>

          <div className="mb-4">
            <img src={logo} alt="Logo" style={{ width: "70px", height: "70px", display: "block", margin: "0 auto", objectFit: "contain" }} />
            <h2 className="mt-3" style={{ fontWeight: "800", color: "#0077B6" }}>Bienvenido</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Laboratorio Ambiental SENA</p>
          </div>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: "14px" }}>{error}</div>}

          <form onSubmit={gestionarLogin}>
            <div className="mb-3 position-relative">
              <FaUser className="input-icon" />
              <input type="text" name="documento" value={form.documento} onChange={handleChange}
                className="form-control ps-5" placeholder="Número de Documento o Correo" required style={{ ...inputStyle, width: "100%" }} autoComplete="off" />
            </div>

            <div className="mb-3 position-relative">
              <FaLock className="input-icon" />
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="form-control ps-5" placeholder="Contraseña" required style={{ ...inputStyle, width: "100%" }} autoComplete="new-password" />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <div className="mt-3">
              <Link to="/forgotPassword" style={{ color: "#0077B6", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>
                Olvidé la contraseña
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
