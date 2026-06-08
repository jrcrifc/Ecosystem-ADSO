// Importa Express para crear las rutas del servidor
import express from "express";
// Importa el modelo de usuario para consultas en la base de datos
import UserModel from "../models/userModel.js";
// Importa express-validator para validar los campos de entrada
import { check } from "express-validator";
// Importa multer para la carga de archivos Excel
import multer from "multer";
// Importa los controladores de autenticación y gestión de usuarios
import {
  RegisterUser, LoginUser, GetPendientes, 
  GetTodos, AprobarUsuario, RechazarUsuario, ToggleActivoUsuario,
  GetProfile, UpdateProfile, ChangePassword, ImportarExcel
} from "../controller/userController.js";
// Importa los middlewares de autorización por roles
import { soloAdmin, adminOGestor } from '../middleware/roleMiddleware.js';
// Importa el middleware de autenticación JWT
import authMiddleware from '../middleware/authMiddleware.js';

// Configura multer en memoria para recibir el archivo Excel de importación masiva
const upload = multer({ storage: multer.memoryStorage() });
// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta POST /api/auth para registrar un nuevo usuario con validaciones
router.post("/", [
  // Valida que el email tenga un formato correcto
  check("email", "Ingrese un email válido").isEmail(),
  // Valida que la contraseña tenga al menos 8 caracteres
  check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
], RegisterUser);

// Define la ruta POST /api/auth/login para iniciar sesión y obtener el token JWT
router.post("/login", LoginUser);

// Define la ruta GET /api/auth/usuarios para listar todos los usuarios
router.get("/usuarios", adminOGestor, GetTodos);

// Define la ruta GET /api/auth/usuarios/pendientes para listar usuarios pendientes de aprobación
router.get("/usuarios/pendientes", soloAdmin, GetPendientes);

// Define la ruta PUT /api/auth/usuarios/:id/aprobar para aprobar un usuario
router.put("/usuarios/:id/aprobar", soloAdmin, AprobarUsuario);

// Define la ruta PUT /api/auth/usuarios/:id/rechazar para rechazar un usuario
router.put("/usuarios/:id/rechazar", soloAdmin, RechazarUsuario);

// Define la ruta PUT /api/auth/usuarios/:id/toggle-activo para activar/inactivar un usuario
router.put("/usuarios/:id/toggle-activo", soloAdmin, ToggleActivoUsuario);

// Define la ruta POST /api/auth/usuarios/importar-excel para importar usuarios desde Excel
router.post("/usuarios/importar-excel", soloAdmin, upload.single("archivo"), ImportarExcel);

// Define la ruta GET /api/auth/profile/me para obtener el perfil del usuario autenticado
router.get("/profile/me", authMiddleware, GetProfile);

// Define la ruta PUT /api/auth/profile/update para actualizar el perfil del usuario autenticado
router.put("/profile/update", authMiddleware, UpdateProfile);

// Define la ruta PUT /api/auth/profile/change-password para cambiar la contraseña del usuario autenticado
router.put("/profile/change-password", authMiddleware, ChangePassword);

// Define la ruta GET /api/auth/usuarios/:id para obtener un usuario por ID excluyendo datos sensibles
router.get("/usuarios/:id", authMiddleware, async (req, res) => {
  try {
    // Busca el usuario por su ID excluyendo password y token
    const user = await UserModel.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'token'] }
    });
    // Si no existe el usuario responde con 404
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    // Responde con los datos del usuario
    res.json(user);
  } catch (error) {
    // Responde con error 500 si ocurre una excepción
    res.status(500).json({ message: error.message });
  }
});

// Exporta el router para ser usado en la aplicación
export default router;