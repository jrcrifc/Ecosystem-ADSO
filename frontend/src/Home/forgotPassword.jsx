import { useState } from "react"
import apiNode from "../api/axiosConfig"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const gestionarResetPassword = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        try {
            const respuesta = await apiNode.post('/api/auth/request-reset-password', {
                email: email
            })
            setMessage(respuesta.data.message)
        } catch(error) {
            setError(error.response?.data?.message || "Ocurrió un error")
        }
    }

    return (
        <div className="container py-3 my-3">
            <div className="col-12 col-md-4 m-auto bg-info p-4 rounded-1">
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={gestionarResetPassword}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
