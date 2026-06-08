// ============================================================
// 🛡️ MIDDLEWARE DE AUTORIZACIÓN POR ROLES (roleMiddleware)
// Este middleware extiende el control de acceso verificando que el usuario
// autenticado posea un rol específico y aprobado antes de permitir la
// ejecución de ciertas operaciones.
// Define políticas de acceso para Administradores, Gestores, Pasantes, etc.
// ============================================================

// Importa la librería jsonwebtoken para verificar y decodificar tokens JWT
import jwt from "jsonwebtoken";

// Función que genera un middleware de autenticación y autorización por rol
export function autorizar(...rolesPermitidos) {
  // Retorna el middleware de Express que intercepta la petición
  return (req, res, next) => {
    // Ejecuta el bloque en try-catch para manejar errores de verificación
    try {
      // Obtiene el valor de la cabecera Authorization de la petición
      const authHeader = req.get("Authorization");
      // Verifica si la cabecera Authorization está presente
      if (!authHeader) {
        // Responde con error 401 si no hay token
        return res.status(401).json({ message: "No token provided" });
      }

      // Separa la cabecera en partes usando el espacio como delimitador
      const parts = authHeader.split(" ");
      // Verifica que el formato sea "Bearer <token>" con exactamente dos partes
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        // Responde con error 401 si el formato es inválido
        return res.status(401).json({ message: "Invalid authorization format" });
      }

      // Extrae el token de la segunda parte
      const token = parts[1];
      // Verifica que el token no esté vacío
      if (!token) {
        // Responde con error 401 si no hay token
        return res.status(401).json({ message: "No token provided" });
      }

      // Verifica la autenticidad del token usando la clave secreta y decodifica su payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Adjunta los datos del usuario decodificado al objeto req
      req.user = decoded;

      // Verifica si el rol del usuario está dentro de los roles permitidos
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        // Responde con error 403 si el rol no está autorizado
        return res.status(403).json({
          message: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`
        });
      }

      // Continúa con la ejecución del siguiente middleware o controlador
      return next();
    } catch (err) {
      // Retorna error 401 si el token es inválido o está expirado
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
}

// Middleware preconfigurado que solo permite acceso al rol Administrador
export const soloAdmin = autorizar("Administrador");

// Middleware preconfigurado que permite acceso a Admin, Gestor y Pasante
export const adminOGestor = autorizar("Administrador", "Gestor", "Pasante");

// Middleware preconfigurado que permite acceso a cualquier rol válido del sistema
export const todosLosRoles = autorizar("Administrador", "Gestor", "Pasante", "Instructor", "Aprendiz");

// Middleware preconfigurado que permite acceso a Administrador e Instructor
export const adminOInstructor = autorizar("Administrador", "Instructor");
