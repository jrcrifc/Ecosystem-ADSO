import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Parsear token JWT
  const parseToken = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const userData = parseToken(token)
    if (!userData) {
      navigate('/login')
      return
    }

    setUser(userData)
    setLoading(false)
  }, [navigate])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!currentPassword) {
      setError('Ingresa tu contraseña actual')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setError('La nueva contraseña debe tener mínimo 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await apiAxios.post('/api/users/change-password', {
        userEmail: user.userEmail,
        currentPassword,
        newPassword
      })

      setSuccess('✅ Contraseña actualizada exitosamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/perfil')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cambiar contraseña')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await apiAxios.delete('/api/users/delete', {
        data: { userEmail: user.userEmail }
      })

      setSuccess('Cuenta eliminada. Redirigiendo...')
      localStorage.removeItem('token')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al eliminar cuenta')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="alert alert-danger">No hay sesión activa</div>
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Card de cambio de contraseña */}
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h4 className="m-0">🔐 Cambiar Contraseña</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label">Contraseña Actual</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <small className="form-text text-muted">
                    Mínimo 6 caracteres
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  style={{ fontWeight: '600' }}
                >
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>

          {/* Card de cuenta */}
          <div className="card shadow mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="m-0">📧 Información de Cuenta</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {user.userEmail}
              </p>
              <p>
                <strong>Tipo de Usuario:</strong>{' '}
                <span className="badge bg-primary">{user.userType}</span>
              </p>
              {user.admin && (
                <p>
                  <strong>Rol:</strong>{' '}
                  <span className="badge bg-danger">Administrador</span>
                </p>
              )}
            </div>
          </div>

          {/* Card de peligro */}
          <div className="card shadow border-danger mb-4">
            <div className="card-header bg-danger text-white">
              <h5 className="m-0">⚠️ Zona de Peligro</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Eliminar tu cuenta permanentemente. Esta acción no se puede deshacer.
              </p>
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleDeleteAccount}
              >
                🗑️ Eliminar Cuenta
              </button>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-between">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/perfil')}
            >
              ← Volver al Perfil
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
