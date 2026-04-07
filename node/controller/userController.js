import UserService from "../service/userService.js";

export const RegisterUser = async (req, res) => {
  try {
    const { documentos, nombres, email, password, rol } = req.body;

    if (!documentos || !nombres || !email || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const user = await UserService.register({
      documentos,
      nombres,
      email,
      password,
      rol
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const result = await UserService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};