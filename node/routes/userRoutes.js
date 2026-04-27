import express from "express";
import UserModel from "../models/userModel.js";
import { check } from "express-validator";
import {
  RegisterUser, LoginUser, GetPendientes, 
  GetTodos, AprobarUsuario, RechazarUsuario, ToggleActivoUsuario
} from "../controller/userController.js";

const router = express.Router();

router.post("/", [
  check("email", "Ingrese un email válido").isEmail(),
  check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
], RegisterUser);

router.post("/login", LoginUser);
router.get("/usuarios", GetTodos);
router.get("/usuarios/pendientes", GetPendientes);
router.put("/usuarios/:id/aprobar", AprobarUsuario);
router.put("/usuarios/:id/rechazar", RechazarUsuario);
router.put("/usuarios/:id/toggle-activo", ToggleActivoUsuario);

// ✅ Obtener usuario por ID
router.get("/usuarios/:id", async (req, res) => {
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