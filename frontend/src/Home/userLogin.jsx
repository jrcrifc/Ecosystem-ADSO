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
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [showModalPolitica, setShowModalPolitica] = useState(false);

  const openLoginModal = () => {
    setForm({ tipo_documento: "CC", documento: "", password: "" });
    setError("");
    setAceptaPoliticas(false);
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

      if (!aceptaPoliticas) {
        setError("Debes aceptar la Política de Tratamiento de Datos del SENA para ingresar.");
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
            <button
              onClick={() => setShowModalPolitica(true)}
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
              Protección de Datos
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

            {/* Checkbox Obligatorio de Políticas de Datos del SENA */}
            <div className="mb-3 p-2 text-start" style={{ background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div className="form-check d-flex align-items-start gap-2 m-0">
                <input
                  className="form-check-input mt-1"
                  type="checkbox"
                  id="aceptaPoliticasLogin"
                  checked={aceptaPoliticas}
                  onChange={(e) => {
                    setAceptaPoliticas(e.target.checked);
                    if (e.target.checked && error.includes("Política de Tratamiento")) setError("");
                  }}
                  required
                  style={{ cursor: "pointer", width: "16px", height: "16px", flexShrink: 0 }}
                />
                <label className="form-check-label" htmlFor="aceptaPoliticasLogin" style={{ fontSize: "12px", color: "#334155", lineHeight: "1.35", cursor: "pointer", textAlign: "left" }}>
                  Acepto la{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowModalPolitica(true);
                    }}
                    style={{ color: "#0077B6", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Política de Tratamiento de Datos SENA
                  </span>{" "}
                  (Ley 1581 de 2012).
                </label>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <div className="mt-3 d-flex justify-content-between align-items-center" style={{ fontSize: "13px" }}>
              <Link to="/forgotPassword" style={{ color: "#0077B6", textDecoration: "none", fontWeight: "600" }}>
                Olvidé la contraseña
              </Link>
              <span
                role="button"
                tabIndex={0}
                onClick={() => setShowModalPolitica(true)}
                style={{ color: "#64748b", textDecoration: "underline", fontSize: "12px", cursor: "pointer" }}
              >
                Política de Datos SENA
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Políticas de Tratamiento de Datos Personales SENA */}
      {showModalPolitica && (
        <div
          onClick={() => setShowModalPolitica(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(10, 22, 40, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
              overflow: "hidden",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            {/* Cabecera del modal */}
            <div
              style={{
                background: "linear-gradient(135deg, #0077B6 0%, #023E8A 100%)",
                color: "#ffffff",
                padding: "16px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                <i className="fas fa-shield-alt me-2"></i> Tratamiento de Datos Personales SENA
              </h5>
              <button
                type="button"
                onClick={() => setShowModalPolitica(false)}
                style={{ background: "none", border: "none", color: "#ffffff", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Contenido con scroll */}
            <div
              style={{
                padding: "22px",
                overflowY: "auto",
                fontSize: "13.5px",
                lineHeight: "1.65",
                color: "#334155",
              }}
            >
              <p>
                De acuerdo con la <strong>Ley 1581 de 2012</strong> (Habeas Data) y la <strong>Resolución SENA No. 01344 de 2017</strong>, 
                los datos recolectados y procesados a través de <strong>Ecosystem</strong> son administrados de manera confidencial y segura por el 
                <strong> SENA - Centro Agropecuario "La Granja" (Regional Tolima)</strong>.
              </p>

              <h6 style={{ fontWeight: "700", color: "#0077B6", marginTop: "14px", fontSize: "13.5px" }}>
                Finalidad del Tratamiento:
              </h6>
              <ul style={{ paddingLeft: "18px", marginBottom: "12px" }}>
                <li>Identificación, control de accesos y seguridad de la sesión.</li>
                <li>Gestión y trazabilidad obligatoria de reactivos, sustancias químicas y equipos del laboratorio ambiental.</li>
                <li>Generación de reportes de auditoría y cumplimiento normativo institucional.</li>
              </ul>

              <h6 style={{ fontWeight: "700", color: "#0077B6", fontSize: "13.5px" }}>
                Derechos del Titular (Habeas Data):
              </h6>
              <p style={{ marginBottom: "12px" }}>
                Usted tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales, así como a revocar la autorización otorgada mediante los canales habilitados por el SENA.
              </p>

              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "12px", borderRadius: "10px", fontSize: "12.5px", color: "#0369a1" }}>
                Para conocer el documento institucional detallado con todas las cláusulas, haz clic aquí:{" "}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setShowModalPolitica(false);
                    navigate("/politica-datos");
                  }}
                  style={{ textDecoration: "underline", fontWeight: "700", cursor: "pointer" }}
                >
                  Ver Política Completa del SENA
                </span>.
              </div>
            </div>

            {/* Pie del modal */}
            <div
              style={{
                padding: "14px 22px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                background: "#f8fafc",
              }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowModalPolitica(false)}
                style={{ borderRadius: "8px", fontWeight: "600", fontSize: "13px" }}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: "#0077B6", borderColor: "#0077B6", borderRadius: "8px", fontWeight: "700", fontSize: "13px" }}
                onClick={() => {
                  setAceptaPoliticas(true);
                  setShowModalPolitica(false);
                }}
              >
                Aceptar Políticas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
