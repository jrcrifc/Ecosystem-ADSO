import express from "express";
import UserModel from "../models/userModel.js";
import { check } from "express-validator";
import multer from "multer";
import {
  RegisterUser, LoginUser, GetPendientes, 
  GetTodos, AprobarUsuario, RechazarUsuario, ToggleActivoUsuario,
  GetProfile, UpdateProfile, ChangePassword, ImportarExcel
} from "../controller/userController.js";
import { soloAdmin, adminOGestor } from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", [
  check("email", "Ingrese un email válido").isEmail(),
  check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
], RegisterUser);

router.post("/login", LoginUser);
router.get("/usuarios", adminOGestor, GetTodos);
router.get("/usuarios/pendientes", soloAdmin, GetPendientes);
router.put("/usuarios/:id/aprobar", soloAdmin, AprobarUsuario);
router.put("/usuarios/:id/rechazar", soloAdmin, RechazarUsuario);
router.put("/usuarios/:id/toggle-activo", soloAdmin, ToggleActivoUsuario);
router.post("/usuarios/importar-excel", soloAdmin, upload.single("archivo"), ImportarExcel);

// RUTAS DE PERFIL
router.get("/profile/me", authMiddleware, GetProfile);
router.put("/profile/update", authMiddleware, UpdateProfile);
router.put("/profile/change-password", authMiddleware, ChangePassword);

// ✅ Obtener usuario por ID — accesible para todos los autenticados (para recargarUsuario)
router.get("/usuarios/:id", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'token'] }
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;