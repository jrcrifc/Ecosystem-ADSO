import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="m-0">Mi Perfil</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Avatar */}
              <div className="text-center mb-4">
                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: 100, height: 100, fontSize: 40 }}
                >
                  {user.userEmail?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              {/* Información del usuario */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Email</label>
                  <p className="form-control-plaintext bg-light p-2 rounded">
                    {user.userEmail}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tipo de Usuario</label>
                  <p className="form-control-plaintext bg-light p-2 rounded">
                    <span className="badge bg-info">
                      {user.userType || 'Sin asignar'}
                    </span>
                  </p>
                </div>
              </div>

              {user.admin && (
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Rol</label>
                    <p className="form-control-plaintext bg-light p-2 rounded">
                      <span className="badge bg-danger">Administrador</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">ID Usuario</label>
                  <p className="form-control-plaintext bg-light p-2 rounded">
                    {user.userId || user.id || 'N/A'}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Miembro desde</label>
                  <p className="form-control-plaintext bg-light p-2 rounded">
                    {new Date(user.iat * 1000).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/configuracion')}
                >
                  ⚙️ Configuración
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  ← Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
