import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import apiNode from "../api/axiosConfig"
import logo from "./nuevologoecosystem.png"
import fondoLaboratorio from "./laboratorio.webp"
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

const ResetPassword = () => {
    const navigate = useNavigate()
    const { token } = useParams()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [aceptaPoliticas, setAceptaPoliticas] = useState(false)
    const [showModalPolitica, setShowModalPolitica] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const updatePassword = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")

        if (newPassword.length < 8) {
            setError("La contraseña debe tener mínimo 8 caracteres.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return
        }

        if (!aceptaPoliticas) {
            setError("Debes aceptar la Política de Tratamiento de Datos Personales del SENA para continuar.")
            return
        }

        setLoading(true)
        try {
            const respuesta = await apiNode.post("/api/auth/reset-password", {
                tokenForPassword: token,
                newPassword
            })
            setMessage(respuesta.data.message || "¡Contraseña actualizada correctamente!")
            setNewPassword("")
            setConfirmPassword("")
            setTimeout(() => {
                navigate("/UserLogin")
            }, 2500)
        } catch (err) {
            setError(err.response?.data?.message || "No fue posible actualizar la contraseña.")
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        borderRadius: "12px",
        padding: "12px 14px 12px 42px",
        background: "#f8fafc",
        color: "#1e293b",
        border: "1px solid #cbd5e1",
        outline: "none",
        width: "100%",
        fontSize: "14px",
    }

    return (
        <div style={{
            position: "fixed", top: 0, left: 0,
            height: "100vh", width: "100vw",
            background: `linear-gradient(rgba(10, 22, 40, 0.72), rgba(10, 22, 40, 0.72)), url(${fondoLaboratorio}) center/cover no-repeat`,
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
            overflowY: "auto"
        }}>
            <div style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "36px 32px",
                maxWidth: "460px",
                width: "100%",
                boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}>
                {/* Logo y Encabezado */}
                <div className="text-center mb-4">
                    <img src={logo} alt="Ecosystem SENA" style={{ height: "65px", objectFit: "contain", marginBottom: "12px" }} />
                    <h3 style={{ fontWeight: "800", color: "#0077B6", fontSize: "22px", margin: 0 }}>
                        Restablecer Contraseña
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
                        Laboratorio Ambiental SENA • Ecosystem
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 d-flex align-items-center gap-2" style={{ fontSize: "13px", borderRadius: "10px" }}>
                        <FaExclamationCircle className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="alert alert-success py-2 d-flex align-items-center gap-2" style={{ fontSize: "13px", borderRadius: "10px" }}>
                        <FaCheckCircle className="flex-shrink-0" />
                        <div>
                            <div>{message}</div>
                            <small style={{ color: "#166534" }}>Redirigiendo al inicio de sesión...</small>
                        </div>
                    </div>
                )}

                <form onSubmit={updatePassword}>
                    {/* Campo Nueva Contraseña */}
                    <div className="mb-3 position-relative">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                            Nueva contraseña
                        </label>
                        <div className="position-relative">
                            <FaLock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                            <input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                className="form-control"
                                placeholder="Mínimo 8 caracteres"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Repetir Contraseña */}
                    <div className="mb-3 position-relative">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                            Confirmar nueva contraseña
                        </label>
                        <div className="position-relative">
                            <FaLock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                className="form-control"
                                placeholder="Repite tu contraseña"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkbox Obligatorio de Políticas de Datos del SENA */}
                    <div className="mb-4 p-2" style={{ background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div className="form-check d-flex align-items-start gap-2">
                            <input
                                className="form-check-input mt-1"
                                type="checkbox"
                                id="aceptaPoliticasReset"
                                checked={aceptaPoliticas}
                                onChange={(e) => {
                                    setAceptaPoliticas(e.target.checked)
                                    if (e.target.checked && error.includes("Política de Tratamiento")) setError("")
                                }}
                                required
                                style={{ cursor: "pointer", width: "17px", height: "17px", flexShrink: 0 }}
                            />
                            <label className="form-check-label" htmlFor="aceptaPoliticasReset" style={{ fontSize: "12px", color: "#334155", lineHeight: "1.4", cursor: "pointer" }}>
                                Acepto la{" "}
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowModalPolitica(true)
                                    }}
                                    style={{ color: "#0077B6", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}
                                >
                                    Política de Tratamiento de Datos del SENA
                                </span>{" "}
                                conforme a la Ley 1581 de 2012 para el uso seguro de mi cuenta.
                            </label>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        className="btn w-100 py-3"
                        disabled={loading || !!message}
                        style={{
                            background: "#0077B6",
                            color: "#ffffff",
                            fontWeight: "700",
                            borderRadius: "12px",
                            fontSize: "14px",
                            border: "none",
                            boxShadow: "0 6px 16px rgba(0, 119, 182, 0.25)",
                        }}
                    >
                        {loading ? "Actualizando..." : "Actualizar Contraseña"}
                    </button>

                    <div className="text-center mt-3">
                        <button
                            type="button"
                            onClick={() => navigate("/UserLogin")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#64748b",
                                fontSize: "13px",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Políticas de Tratamiento de Datos */}
            {showModalPolitica && (
                <div
                    onClick={() => setShowModalPolitica(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(10, 22, 40, 0.65)",
                        backdropFilter: "blur(4px)",
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
                            borderRadius: "16px",
                            maxWidth: "580px",
                            width: "100%",
                            maxHeight: "85vh",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Cabecera del modal */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, #0077B6 0%, #023E8A 100%)",
                                color: "#ffffff",
                                padding: "16px 20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                                Tratamiento de Datos Personales SENA
                            </h5>
                            <button
                                type="button"
                                onClick={() => setShowModalPolitica(false)}
                                style={{ background: "none", border: "none", color: "#ffffff", fontSize: "20px", cursor: "pointer" }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div
                            style={{
                                padding: "20px",
                                overflowY: "auto",
                                fontSize: "13px",
                                lineHeight: "1.6",
                                color: "#334155",
                            }}
                        >
                            <p>
                                Conforme a la <strong>Ley 1581 de 2012</strong> y la <strong>Resolución SENA No. 01344 de 2017</strong>, 
                                al restablecer sus credenciales en <strong>Ecosystem</strong> autoriza al SENA (Centro Agropecuario "La Granja") a procesar de forma segura sus datos.
                            </p>
                            <h6 style={{ fontWeight: "700", color: "#0077B6", marginTop: "12px", fontSize: "13px" }}>Finalidades:</h6>
                            <ul style={{ paddingLeft: "18px", marginBottom: "12px" }}>
                                <li>Control de acceso, autenticación y seguridad de su cuenta.</li>
                                <li>Auditoría y trazabilidad de préstamos de reactivos y uso de equipos en el laboratorio ambiental.</li>
                                <li>Comunicaciones institucionales sobre solicitudes y alertas operativas.</li>
                            </ul>
                            <h6 style={{ fontWeight: "700", color: "#0077B6", fontSize: "13px" }}>Sus Derechos:</h6>
                            <p style={{ marginBottom: "12px" }}>
                                Tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales ante el responsable en cualquier momento.
                            </p>
                            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "10px", borderRadius: "8px", fontSize: "12px", color: "#0369a1" }}>
                                Puedes leer la versión completa en la sección{" "}
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        setShowModalPolitica(false)
                                        navigate("/politica-datos")
                                    }}
                                    style={{ textDecoration: "underline", fontWeight: "700", cursor: "pointer" }}
                                >
                                    Política de Datos SENA completa
                                </span>.
                            </div>
                        </div>

                        {/* Pie del modal */}
                        <div
                            style={{
                                padding: "12px 20px",
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
                            >
                                Cerrar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ background: "#0077B6", borderColor: "#0077B6" }}
                                onClick={() => {
                                    setAceptaPoliticas(true)
                                    setShowModalPolitica(false)
                                }}
                            >
                                Aceptar Políticas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResetPassword
