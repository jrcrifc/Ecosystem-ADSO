import userService from '../service/userService.js';
     
    export const RegisterUser = async (req, res) => {
        try {
            const user = await userService.register(req.body);
            res.status(201).json({ message: "Usuario registrado correctamente" });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
    };

    export const LoginUser = async (req, res) => {
        try {
            const {user} = await userService.loginUser(req.body)
              res.status(200).json({message: 'Usuario logueado correctamente', user})
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    