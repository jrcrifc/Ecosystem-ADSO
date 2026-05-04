import UserService from "../service/userService.js";

export const RegisterUser = async (req, res) => {
  try {
    const { documento, nombres_apellidos, email, password, rol } = req.body;
    if (!documento || !nombres_apellidos || !email || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const user = await UserService.registerUser({ documento, nombres_apellidos, email, password, rol });
    res.status(201).json({ message: "Usuario registrado correctamente", user });
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

export const ToggleActivoUsuario = async (req, res) => {
  try {
    const result = await UserService.toggleActivoUsuario(req.params.id);
    res.json({ message: `Usuario ${result.estado === 'inactivo' ? 'inactivado' : 'activado'} correctamente`, estado: result.estado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ver mi perfil
export const GetProfile = async (req, res) => {
  try {
    const user = await UserService.getById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar mi perfil
export const UpdateProfile = async (req, res) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);
    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cambiar mi contraseña
export const ChangePassword = async (req, res) => {
  try {
    await UserService.changePassword(req.user.id, req.body);
    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};