import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

// animated background gradient
const waveStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: 'linear-gradient(135deg, #28a745, #20c997, #17a2b8)',
  backgroundSize: '200% 200%',
  animation: 'waveBg 8s ease infinite'
};

const keyframes = `
  @keyframes waveBg {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }
`;


export default function Login() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validar email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Validar contraseña (mínimo 6 caracteres)
  const validatePassword = (pwd) => {
    return pwd.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!validateEmail(userEmail)) {
      setError('Ingresa un email válido')
      return
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener mínimo 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const res = await apiAxios.post('/api/users/login', { userEmail, password })
      console.log('Login response:', res)
      const { token } = res.data
      console.log('Token recibido:', token)
      localStorage.setItem('token', token)
      console.log('Token guardado en localStorage')
      setSuccess('Inicio de sesión correcto')
      // Disparar evento personalizado para que BarraNav se actualice
      window.dispatchEvent(new Event('tokenUpdated'))
      // dejar breve feedback visible antes de redirigir
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      console.error('Login error:', err.response || err)
      setError(err.response?.data?.msg || 'Error en el login')
      setLoading(false)
    }
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const resetDatabase = async () => {
    try {
      await apiAxios.post('/api/users/reset')
      alert('Base de datos de usuarios reiniciada (desarrollo)')
    } catch (err) {
      console.error(err)
      alert('Error al resetear base de datos: ' + (err.response?.data?.msg || err.message))
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm" style={{ borderColor: '#28a745' }}>
          <div className="card-body">
            <h3 className="card-title text-center text-success">Iniciar sesión</h3>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
            <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input 
              value={userEmail} 
              onChange={e => setUserEmail(e.target.value)} 
              type="email" 
              className="form-control" 
              disabled={loading}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              className="form-control" 
              disabled={loading}
              required 
            />
          </div>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-success" 
              type="submit" 
              style={{fontWeight:'600'}}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
            <button 
              className="btn btn-outline-success" 
              type="button"
              onClick={handleRegister}
              disabled={loading}
              style={{fontWeight:'600'}}
            >
              Crear cuenta
            </button>
          </div>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-link text-danger mt-2 w-100" onClick={resetDatabase} disabled={loading}>
              ⚠️ Reset DB (dev only)
            </button>
          )}
        </form>
      </div>
    </div>
      </div>
    </div>
  )
}
