// Importa Express para crear las rutas del servidor
import express from "express";
// Importa el middleware de autenticación JWT
import authMiddleware from "../middleware/authMiddleware.js";
// Importa los controladores para listar usuarios y cambiar estados
import { getUsuarios, cambiarEstado } from "../controller/adminController.js";

// Crea una nueva instancia del Router
const router = express.Router();

// Middleware que restringe el acceso solo a usuarios con rol de Administrador
const soloAdmin = (req, res, next) => {
  // Verifica si el usuario autenticado tiene rol de Administrador
  if (req.user.rol !== "Administrador") {
    // Responde con error 403 si no es administrador
    return res.status(403).json({ message: "Acceso denegado: Se requiere rol de Administrador" });
  }
  // Continúa con la siguiente función si es administrador
  next();
};

// Define la ruta GET /api/admin/usuarios para obtener todos los usuarios
router.get("/usuarios", authMiddleware, soloAdmin, getUsuarios);

// Define la ruta PATCH /api/admin/usuarios/:id/estado para cambiar el estado de un usuario
router.patch("/usuarios/:id/estado", authMiddleware, soloAdmin, cambiarEstado);

// Exporta el router para ser usado en la aplicación
export default router;