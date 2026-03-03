import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Login() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
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
    }
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
        <h3>Iniciar sesión</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input value={userEmail} onChange={e => setUserEmail(e.target.value)} type="email" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" required />
          </div>
          <button className="btn btn-primary" type="submit">Entrar</button>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-link text-danger mt-2" onClick={resetDatabase}>
              ⚠️ Reset DB (dev only)
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
