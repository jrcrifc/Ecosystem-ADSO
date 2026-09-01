import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiNode from "../api/axiosConfig"
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa"
import logo from "../Home/nuevologoecosystem.png"
import fondoLaboratorio from "../Home/laboratorio.webp"

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const gestionarResetPassword = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)
        try {
            const respuesta = await apiNode.post('/api/auth/request-reset-password', { email })
            setMessage(respuesta.data.message)
            setSent(true)
        } catch (error) {
            setError(error.response?.data?.message || "Ocurrió un error al enviar el correo")
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        borderRadius: "20px",
        padding: "12px 15px 12px 45px",
        background: "#f5f5f5",
        color: "#333",
        border: "1px solid #ccc",
        outline: "none",
        width: "100%",
        fontSize: "15px",
        transition: "border 0.2s, box-shadow 0.2s",
    }

    return (
        <div style={{
            position: "fixed", top: 0, left: 0,
            height: "100vh", width: "100vw",
            background: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url(${fondoLaboratorio}) center/cover no-repeat`,
            fontFamily: "'Outfit', 'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500;600&display=swap');

                .fp-navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 50px;
                }
                .fp-brand {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    cursor: pointer;
                    text-decoration: none;
                }
                .fp-brand img {
                    width: 48px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                }
                .fp-brand-name {
                    font-size: 22px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.5px;
                }
                .fp-center {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 60px;
                }
                .fp-card {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255,255,255,0.97);
                    backdrop-filter: blur(30px);
                    border: 1px solid rgba(255,255,255,0.6);
                    border-radius: 28px;
                    padding: 44px 40px 40px 40px;
                    text-align: center;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.25);
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                .fp-logo {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    border: 2.5px solid #0077B6;
                    display: block;
                    margin: 0 auto 18px auto;
                    box-shadow: 0 6px 20px rgba(0,119,182,0.2);
                }
                .fp-title {
                    font-size: 22px;
                    font-weight: 800;
                    color: #0077B6;
                    margin: 0 0 6px 0;
                }
                .fp-subtitle {
                    color: #64748b;
                    font-size: 14px;
                    margin: 0 0 26px 0;
                    line-height: 1.5;
                }
                .fp-input-wrap {
                    position: relative;
                    margin-bottom: 18px;
                    text-align: left;
                }
                .fp-input-icon {
                    position: absolute;
                    top: 50%;
                    left: 16px;
                    transform: translateY(-50%);
                    color: #0077B6;
                    font-size: 16px;
                    pointer-events: none;
                    transition: transform 0.2s;
                }
                .fp-input:focus {
                    border: 1.5px solid #0077B6 !important;
                    box-shadow: 0 0 0 3px rgba(0,119,182,0.12) !important;
                    background: #fff !important;
                    outline: none;
                }
                .fp-btn {
                    background: linear-gradient(135deg, #0077B6, #023E8A);
                    border-radius: 20px;
                    padding: 13px;
                    color: #fff;
                    border: none;
                    width: 100%;
                    font-weight: 700;
                    font-size: 16px;
                    margin-top: 6px;
                    box-shadow: 0 8px 20px rgba(0,119,182,0.35);
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
                    letter-spacing: 0.3px;
                }
                .fp-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(0,119,182,0.45);
                }
                .fp-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .fp-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    margin-top: 20px;
                    color: #0077B6;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    cursor: pointer;
                    transition: opacity 0.2s, gap 0.2s;
                    background: none;
                    border: none;
                    padding: 0;
                }
                .fp-back:hover {
                    opacity: 0.75;
                    gap: 10px;
                }
                .fp-divider {
                    border: none;
                    border-top: 1px solid #eee;
                    margin: 22px 0 18px 0;
                }
                .fp-success-icon {
                    color: #10b981;
                    font-size: 52px;
                    margin-bottom: 16px;
                    display: block;
                    animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes popIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to   { transform: scale(1);   opacity: 1; }
                }
                .fp-alert-err {
                    background: #fee2e2;
                    color: #b91c1c;
                    border-radius: 12px;
                    padding: 10px 14px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    text-align: left;
                }
                @media (max-width: 500px) {
                    .fp-card { padding: 32px 20px 28px 20px; }
                    .fp-navbar { padding: 16px 20px; }
                }
            `}</style>

            {/* Navbar */}
            <nav className="fp-navbar">
                <div className="fp-brand" onClick={() => navigate("/UserLogin")}>
                    <img src={logo} alt="Ecosystem Logo" />
                    <span className="fp-brand-name">Ecosystem</span>
                </div>
            </nav>

            {/* Centered Card */}
            <div className="fp-center">
                <div className="fp-card">

                    {!sent ? (
                        <>
                            {/* Logo + Title */}
                            <img src={logo} alt="Logo" className="fp-logo" />
                            <h1 className="fp-title">¿Olvidaste tu contraseña?</h1>
                            <p className="fp-subtitle">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </p>

                            {/* Error */}
                            {error && <div className="fp-alert-err">⚠️ {error}</div>}

                            {/* Form */}
                            <form onSubmit={gestionarResetPassword}>
                                <div className="fp-input-wrap">
                                    <FaEnvelope className="fp-input-icon" />
                                    <input
                                        className="fp-input"
                                        style={inputStyle}
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button type="submit" className="fp-btn" disabled={loading}>
                                    {loading ? "Enviando..." : "Siguiente →"}
                                </button>
                            </form>

                            <hr className="fp-divider" />

                            <button className="fp-back" onClick={() => navigate("/UserLogin")}>
                                <FaArrowLeft /> Volver al inicio de sesión
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <FaCheckCircle className="fp-success-icon" />
                            <h1 className="fp-title" style={{ color: "#10b981" }}>¡Correo enviado!</h1>
                            <p className="fp-subtitle" style={{ marginBottom: "8px" }}>
                                Hemos enviado un enlace de restablecimiento a:
                            </p>
                            <p style={{
                                fontWeight: 700, color: "#0077B6",
                                fontSize: "15px", marginBottom: "24px",
                                wordBreak: "break-all"
                            }}>
                                {email}
                            </p>
                            <p className="fp-subtitle">
                                Revisa tu bandeja de entrada (y la carpeta de spam). El enlace expirará en 15 minutos.
                            </p>

                            <hr className="fp-divider" />

                            <button className="fp-back" onClick={() => navigate("/UserLogin")}>
                                <FaArrowLeft /> Volver al inicio de sesión
                            </button>

                            <div style={{ marginTop: "14px" }}>
                                <button
                                    style={{
                                        background: "none", border: "none",
                                        color: "#64748b", fontSize: "13px",
                                        cursor: "pointer", textDecoration: "underline"
                                    }}
                                    onClick={() => { setSent(false); setEmail(""); }}
                                >
                                    ¿No llegó el correo? Intentar de nuevo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
