// ============================================================
// 👥 CONTROLADOR DE USUARIOS (userController)
// Maneja las peticiones HTTP asociadas con el registro de usuarios,
// inicio de sesión, aprobación/rechazo administrativo, visualización de perfil,
// actualización de datos, cambio de contraseña e importación por Excel.
// ============================================================

// Importa el servicio de usuarios para la lógica de negocio
import UserService from "../service/userService.js";
// Importa el modelo de Usuarios para consultas directas a la base de datos
import UserModel from "../models/userModel.js";
// Importa el modelo de Logs para registrar el inicio de sesión
import LogModel from '../models/logModel.js';

// Controlador para registrar un nuevo usuario en la plataforma
export const RegisterUser = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Extrae los campos del cuerpo de la petición
    const { documento, nombres_apellidos, email, password, rol, numero_ficha, nombre_ficha, es_sena_empresa } = req.body;
    // Valida que los campos obligatorios estén presentes
    if (!documento || !nombres_apellidos || !email || !password || !rol) {
      // Responde con error 400 si faltan campos obligatorios
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    // Llama al servicio para registrar el usuario con los datos proporcionados
    const user = await UserService.registerUser({ 
      documento, 
      nombres_apellidos, 
      email, 
      password, 
      rol, 
      numero_ficha, 
      nombre_ficha, 
      es_sena_empresa 
    });
    // Responde con estado 201 y los datos del usuario creado
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para iniciar sesión y obtener un token JWT
export const LoginUser = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para autenticar al usuario con las credenciales proporcionadas
    const result = await UserService.loginUser(req.body);
    
    // El inicio de sesión ya se registra de manera limpia dentro de UserService.loginUser

    // Responde con el resultado de la autenticación (token y datos del usuario)
    res.json(result);
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para obtener la lista de todos los usuarios registrados
export const GetTodos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todos los usuarios
    const usuarios = await UserService.getTodos();
    // Responde con la lista de usuarios en formato JSON
    res.json(usuarios);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener la lista de usuarios pendientes de aprobación
export const GetPendientes = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener los usuarios pendientes
    const usuarios = await UserService.getPendientes();
    // Responde con la lista de usuarios pendientes
    res.json(usuarios);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para aprobar el registro de un usuario pendiente
export const AprobarUsuario = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para aprobar al usuario por su ID
    await UserService.aprobarUsuario(req.params.id);
    // Responde con mensaje de éxito
    res.json({ message: "Usuario aprobado correctamente" });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para rechazar el registro de un usuario
export const RechazarUsuario = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para rechazar al usuario por su ID
    await UserService.rechazarUsuario(req.params.id);
    // Responde con mensaje de éxito
    res.json({ message: "Usuario rechazado" });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para activar o inactivar un usuario (toggle)
export const ToggleActivoUsuario = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para cambiar el estado activo/inactivo del usuario
    const result = await UserService.toggleActivoUsuario(req.params.id);
    // Responde con mensaje dinámico según el nuevo estado
    res.json({ message: `Usuario ${result.estado === 'inactivo' ? 'inactivado' : 'activado'} correctamente`, estado: result.estado });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para obtener el perfil del usuario autenticado
export const GetProfile = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Obtiene los datos del usuario por su ID (extraído del token JWT)
    const user = await UserService.getById(req.user.id);
    // Responde con los datos del perfil del usuario
    res.json(user);
  } catch (error) {
    // Si ocurre un error, responde con estado 404 y el mensaje de error
    res.status(404).json({ message: error.message });
  }
};

// Controlador para actualizar la información del perfil del usuario actual
export const UpdateProfile = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para actualizar el perfil con los datos del cuerpo
    const user = await UserService.updateProfile(req.user.id, req.body);
    // Responde con mensaje de éxito y los datos actualizados
    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para cambiar la contraseña de un usuario por parte del administrador
export const ChangePasswordByAdmin = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para cambiar la contraseña con los datos proporcionados por el admin
    await UserService.changePasswordByAdmin(req.params.id, req.body);
    // Responde con mensaje de éxito
    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para importar usuarios masivamente desde un archivo Excel
export const ImportarExcel = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Verifica si se proporcionó un archivo en la petición
    if (!req.file) {
      // Responde con error 400 si no hay archivo
      return res.status(400).json({ message: "No se proporcionó ningún archivo Excel" });
    }
    // Obtiene los datos del usuario administrador para el registro de auditoría
    const adminUser = await UserModel.findByPk(req.user.id);
    // Define el email del usuario administrador o un valor por defecto
    const userEmailLog = adminUser ? adminUser.email : 'admin@laboratorio.com';
    
    // Obtiene el rol forzado del body si existe
    const { rolForzado } = req.body;
    
    // Llama al servicio para importar el archivo Excel con su contenido en buffer
    const result = await UserService.importarExcel(req.file.buffer, userEmailLog, rolForzado);
    // Responde con mensaje de éxito y los datos del resultado de la importación
    res.json({
      message: "Proceso de importación finalizado",
      data: result
    });
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};