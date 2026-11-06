// ============================================================
// 👥 CONTROLADOR DE USUARIOS (userController)
// Maneja las peticiones HTTP asociadas con el registro de usuarios,
// inicio de sesión, aprobación/rechazo administrativo, visualización de perfil,
// actualización de datos, cambio de contraseña e importación por Excel.
// ============================================================

import UserService from "../service/userService.js";
import UserModel from "../models/userModel.js";

// Controlador para registrar un nuevo usuario en la plataforma
export const RegisterUser = async (req, res) => {
  try {
    const { tipo_documento, documento, nombres_apellidos, email, rol, es_sena_empresa, estado } = req.body;
    if (!documento || !nombres_apellidos || !email || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const user = await UserService.registerUser({ 
      tipo_documento,
      documento, 
      nombres_apellidos, 
      email, 
      password: "",
      rol, 
      es_sena_empresa,
      estado
    });
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar un usuario desde el panel de administración
export const UpdateUserByAdmin = async (req, res) => {
  try {
    const user = await UserService.updateUserByAdmin(req.params.id, req.body);
    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para iniciar sesión y obtener un token JWT
export const LoginUser = async (req, res) => {
  try {
    const result = await UserService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para obtener la lista de todos los usuarios registrados
export const GetTodos = async (req, res) => {
  try {
    const usuarios = await UserService.getTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para activar o inactivar un usuario (toggle)
export const ToggleActivoUsuario = async (req, res) => {
  try {
    const result = await UserService.toggleActivoUsuario(req.params.id);
    res.json({ message: `Usuario ${result.estado === 'inactivo' ? 'inactivado' : 'activado'} correctamente`, estado: result.estado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para obtener el perfil del usuario o instructor autenticado
export const GetProfile = async (req, res) => {
  try {
    const user = await UserService.getById(req.user.id, req.user.rol);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controlador para actualizar la información del perfil del usuario o instructor actual
export const UpdateProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.avatar = req.file.filename;
    }
    const user = await UserService.updateProfile(req.user.id, data, req.user.rol);
    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para cambiar la contraseña de un usuario por parte del administrador
export const ChangePasswordByAdmin = async (req, res) => {
  try {
    await UserService.changePasswordByAdmin(req.params.id, req.body);
    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para importar usuarios masivamente desde un archivo Excel
export const ImportarExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún archivo Excel" });
    }
    const adminUser = await UserModel.findByPk(req.user.id);
    const userEmailLog = adminUser ? adminUser.email : 'admin@laboratorio.com';
    const { rolForzado } = req.body;
    const result = await UserService.importarExcel(req.file.buffer, userEmailLog, rolForzado);
    res.json({
      message: "Proceso de importación finalizado",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Solicitar restablecer contraseña
export const getResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await UserService.resetPassword(email);
    res.status(200).json({ message: 'El mensaje para restablecer contraseña fue enviado correctamente.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Recibir la nueva contraseña
export const setNewPassword = async (req, res) => {
  try {
    await UserService.setNewPassword(req.body);
    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    res.status(400).json({ message: "Información inválida o el tiempo ha expirado." });
  }
};

// Aceptar política de tratamiento de datos personales
export const AceptarPolitica = async (req, res) => {
  try {
    const id = req.body?.id_usuario || req.user?.id;
    const rol = req.body?.rol || req.user?.rol;
    if (!id) {
      return res.status(400).json({ success: false, message: "Identificador de usuario no proporcionado" });
    }
    const result = await UserService.aceptarPolitica(id, rol);
    res.status(200).json({
      success: true,
      message: "Política de tratamiento de datos aceptada exitosamente.",
      acepta_politicas: 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
