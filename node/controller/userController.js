import userService from '../service/userService.js';
import { validationResult } from "express-validator";
     
    export const RegisterUser = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        try {
            const user = await userService.register(req.body);
            res.status(201).json({ message: "Usuario registrado correctamente" });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    };

    export const LoginUser = async (req, res) => {
        try {
            const { user, token } = await userService.loginUser(req.body);
            res.status(200).json({ message: 'Usuario logueado correctamente', user, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    