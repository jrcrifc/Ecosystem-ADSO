import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Verificar si existe un token en localStorage
  const token = localStorage.getItem('token')

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si hay token, mostrar el componente protegido
  return children
}
