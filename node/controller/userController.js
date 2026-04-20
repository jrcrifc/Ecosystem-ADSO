import UserService from "../service/userService.js";

export const RegisterUser = async (req, res) => {
  try {
    // Cambiamos los nombres para que coincidan con lo que envía el frontend
    const { documento, nombres_apellidos, email, password, rol } = req.body;

    console.log("📥 Datos recibidos del frontend:", req.body); // ← Esto te ayudará a ver qué llega realmente

    if (!documento || !nombres_apellidos || !email || !password || !rol) {
      return res.status(400).json({ 
        message: "Todos los campos son obligatorios",
        received: req.body   // ← temporal, para debug
      });
    }

    const user = await UserService.registerUser({
      documento,
      nombres_apellidos,
      email,
      password,
      rol
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user
    });
  } catch (error) {
    console.error("Error en registro:", error);
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