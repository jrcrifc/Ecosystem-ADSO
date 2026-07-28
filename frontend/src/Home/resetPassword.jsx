import { useState } from "react"
import { useParams } from "react-router-dom"
import apiNode from "../api/axiosConfig"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const { token } = useParams()

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

        try {
            const respuesta = await apiNode.post("/api/auth/reset-password", {
                tokenForPassword: token,
                newPassword
            })
            setMessage(respuesta.data.message)
            setNewPassword("")
            setConfirmPassword("")
        } catch (error) {
            setError(error.response?.data?.message || "No fue posible actualizar la contraseña.")
        }
    }

    return (
        <div className="container py-3 my-3">
            <div className="col-12 col-md-4 m-auto bg-info p-4 rounded-1">
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={updatePassword}>
                    <div className="mb-3">
                        <label className="form-label">Nueva contraseña</label>
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Repetir contraseña</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Actualizar contraseña
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
