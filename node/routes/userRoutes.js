import express from "express";
import {  RegisterUser,LoginUser } from "../controller/userController.js";
import { check } from "express-validator";

const UserRoutes = express.Router();

UserRoutes.post(
  '/register',
  [
    check("email", "Ingrese un email válido").isEmail(),
    check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
  ],
  RegisterUser);
UserRoutes.post('/login', LoginUser);
 
export default UserRoutes;