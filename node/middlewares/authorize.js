// middleware para autorizar por roles (usa req.user que provee authMiddleware)
export const requireRole = (...allowedRoles) => {
  // normalizar roles permitidos a minúsculas
  const allowed = allowedRoles.map(r => (r || '').toString().toLowerCase())
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ msg: 'No autenticado' })
      // admin siempre tiene permisos completos
      if (req.user.admin) return next()
      const userType = (req.user.userType || '').toString().toLowerCase()
      if (allowed.includes(userType)) return next()
      return res.status(403).json({ msg: 'Permisos insuficientes' })
    } catch (err) {
      console.error('authorize middleware error:', err)
      return res.status(500).json({ msg: 'Error al comprobar permisos' })
    }
  }
}
