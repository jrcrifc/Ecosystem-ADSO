import express from "express";
import { check } from "express-validator";
import multer from "multer";
import {
  RegisterUser, UpdateUserByAdmin, LoginUser, 
  GetTodos, ToggleActivoUsuario,
  GetProfile, UpdateProfile, ChangePasswordByAdmin, ImportarExcel,
  getResetPassword, setNewPassword, AceptarPolitica
} from "../controller/userController.js";
import UserService from "../service/userService.js";
import { soloAdmin, adminOGestor } from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadExcel = multer({ storage: multer.memoryStorage() });

const avatarUploadDir = path.join(__dirname, '..', 'public', 'uploads', 'perfiles');
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `avatar_${req.user?.id || Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 } });

const router = express.Router();

router.post("/", [
  check("email", "Ingrese un email válido").isEmail()
], RegisterUser);

router.post("/login", LoginUser);

router.post('/request-reset-password', getResetPassword);
router.post('/reset-password', setNewPassword);

router.get("/usuarios", adminOGestor, GetTodos);
router.put("/usuarios/:id", soloAdmin, UpdateUserByAdmin);
router.put("/usuarios/:id/toggle-activo", soloAdmin, ToggleActivoUsuario);
router.post("/usuarios/importar-excel", soloAdmin, uploadExcel.single("archivo"), ImportarExcel);

router.get("/profile/me", authMiddleware, GetProfile);
router.put("/profile/update", authMiddleware, uploadAvatar.single("avatar"), UpdateProfile);
router.put("/usuarios/:id/change-password", soloAdmin, ChangePasswordByAdmin);

// Aceptar política de tratamiento de datos personales
router.put("/aceptar-politica", authMiddleware, AceptarPolitica);
router.post("/aceptar-politica", authMiddleware, AceptarPolitica);

router.get("/usuarios/:id", authMiddleware, async (req, res) => {
  try {
    const rolSolicitante = (String(req.user?.id) === String(req.params.id)) ? req.user?.rol : null;
    const user = await UserService.getById(req.params.id, rolSolicitante);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
