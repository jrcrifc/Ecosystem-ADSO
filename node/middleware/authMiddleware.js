// ============================================================
// 🔐 MIDDLEWARE DE AUTENTICACIÓN (authMiddleware)
// Este middleware intercepta las peticiones entrantes a rutas protegidas.
// Extrae el token JWT de la cabecera 'Authorization', lo verifica usando la clave secreta,
// y si es válido, inyecta la información del usuario decodificada en el objeto 'req.user'
// para que pueda ser utilizada por los controladores posteriores.
// ============================================================

// Importa la librería jsonwebtoken para verificar y decodificar tokens JWT
import jwt from "jsonwebtoken";

// Middleware de autenticación que intercepta peticiones a rutas protegidas
export default async function authMiddleware(req, res, next) {
    // Ejecuta el bloque en try-catch para manejar errores de verificación
    try {
        // Obtiene el valor de la cabecera Authorization de la petición
        const autMeader = req.get("Authorization");

        // Verifica si la cabecera Authorization está presente
        if (!autMeader) {
            // Responde con error 401 si no hay token
            return res.status(401).json({ message: "No token provided" });
        }

        // Separa la cabecera en partes usando el espacio como delimitador
        const parts = autMeader.split(" ");
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
        
        // Adjunta los datos del usuario decodificado al objeto req para uso en controladores posteriores
        req.user = decoded;
        
        // Continúa con la ejecución del siguiente middleware o controlador
        return next();
    } catch (err) {
        // Retorna error 401 si el token es inválido, está expirado o la firma no coincide
        return res.status(401).json({ message: "token invalido o expirado" });
    }
}