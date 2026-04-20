import UserService from "../service/userService.js";

export const RegisterUser = async (req, res) => {
  try {
    const { documento, nombres_apellidos, email, password, rol } = req.body;
    console.log("📥 Datos recibidos del frontend:", req.body);
    if (!documento || !nombres_apellidos || !email || !password || !rol) {
      return res.status(400).json({ 
        message: "Todos los campos son obligatorios",
        received: req.body
      });
    }
    const user = await UserService.registerUser({
      documento, nombres_apellidos, email, password, rol
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

// ✅ NUEVOS
export const GetTodos = async (req, res) => {
  try {
    const usuarios = await UserService.getTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetPendientes = async (req, res) => {
  try {
    const usuarios = await UserService.getPendientes();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const AprobarUsuario = async (req, res) => {
  try {
    await UserService.aprobarUsuario(req.params.id);
    res.json({ message: "Usuario aprobado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const RechazarUsuario = async (req, res) => {
  try {
    await UserService.rechazarUsuario(req.params.id);
    res.json({ message: "Usuario rechazado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};