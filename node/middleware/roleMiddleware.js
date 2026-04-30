import jwt from "jsonwebtoken";

/**
 * Middleware genérico de autenticación + autorización por rol.
 * Primero verifica el token JWT, luego verifica que el rol del usuario
 * esté en la lista de roles permitidos.
 *
 * @param  {...string} rolesPermitidos - Roles que pueden acceder a la ruta
 * @returns {Function} Express middleware
 */
export function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      // 1. Verificar token
      const authHeader = req.get("Authorization");
      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid authorization format" });
      }

      const token = parts[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 2. Verificar rol
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({
          message: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`
        });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
}

// ===================== MIDDLEWARES PRE-CONFIGURADOS =====================

/** Solo Administrador */
export const soloAdmin = autorizar("Administrador");

/** Administrador + Gestor + Pasante (módulos de gestión del laboratorio) */
export const adminOGestor = autorizar("Administrador", "Gestor", "Pasante");

/** Todos los roles autenticados (Administrador, Gestor, Pasante, Instructor, Aprendiz) */
export const todosLosRoles = autorizar("Administrador", "Gestor", "Pasante", "Instructor", "Aprendiz");

/** Administrador + Instructor (para módulos académicos si aplica) */
export const adminOInstructor = autorizar("Administrador", "Instructor");
