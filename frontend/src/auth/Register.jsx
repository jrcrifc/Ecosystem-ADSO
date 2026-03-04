import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Register() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('aprendiz')
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
    if (!validateEmail(correo)) {
      setError('Ingresa un email válido')
      return
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener mínimo 6 caracteres')
      return
    }

    setLoading(true)
    try {
      console.log('📤 Enviando:', { userEmail: correo, password: '***', userType })
      const response = await apiAxios.post('/api/users/register', { 
        userEmail: correo, 
        password, 
        userType 
      })
      console.log('✅ Respuesta:', response.data)
      const { token } = response.data
      if (token) {
        localStorage.setItem('token', token)
        // Disparar evento personalizado para que BarraNav se actualice
        window.dispatchEvent(new Event('tokenUpdated'))
        setSuccess('✅ Registro exitoso. Iniciando sesión...')
        setTimeout(() => navigate('/'), 1200)
      } else {
        setSuccess('✅ Registro exitoso. Redirigiendo a login...')
        setTimeout(() => navigate('/login'), 1200)
      }
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message)
      setError(err.response?.data?.msg || err.message || 'Error en el registro')
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Registrarse</h3>
        {error && <div className="alert alert-danger" role="alert"><strong>❌ Error:</strong> {error}</div>}
        {success && <div className="alert alert-success" role="alert"><strong>✅ {success}</strong></div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input 
              value={correo} 
              onChange={e => setCorreo(e.target.value)} 
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
            <small className="form-text text-muted">Mínimo 6 caracteres</small>
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo de Usuario</label>
            <select 
              value={userType} 
              onChange={e => setUserType(e.target.value)} 
              className="form-control" 
              disabled={loading}
              required
            >
                <option value="aprendiz">Aprendiz</option>
                <option value="gestor">Gestor</option>
                <option value="instructor">Instructor</option>
                <option value="pasante">Pasante</option>
            </select>
          </div>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={loading}
              style={{fontWeight:'600'}}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={handleBackToLogin}
              disabled={loading}
              style={{fontWeight:'600'}}
            >
              Volver al login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
