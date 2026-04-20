import express from "express";
import { RegisterUser, LoginUser } from "../controller/userController.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/",
  [
    check("email", "Ingrese un email válido").isEmail(),
    check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
  ],
  RegisterUser
);

router.post("/login", LoginUser);

export default router;