// ============================================================
// 👑 CONTROLADOR ADMINISTRATIVO (adminController)
// Maneja peticiones específicas de administración de usuarios,
// permitiendo consultar registros y modificar el estado de activación de cuentas.
// ============================================================

// Importa el modelo de Usuarios para interactuar con la tabla de usuarios en la base de datos
import UserModel from "../models/userModel.js";

// Controlador para obtener la lista completa de usuarios
export const getUsuarios = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Busca todos los usuarios excluyendo los campos sensibles password y token
    const usuarios = await UserModel.findAll({
      attributes: { exclude: ["password", "token"] }
    });
    // Responde con la lista de usuarios en formato JSON
    res.json(usuarios);
  } catch (err) {
    // Si ocurre un error, responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Controlador para cambiar el estado de aprobación de un usuario por su ID
export const cambiarEstado = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Extrae el nuevo estado del cuerpo de la petición
    const { estado } = req.body;
    // Extrae el ID del usuario de los parámetros de la ruta
    const { id } = req.params;

    // Verifica que el estado proporcionado sea válido
    if (!["aprobado", "rechazado"].includes(estado)) {
      // Responde con error 400 si el estado no es válido
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Busca el usuario por su clave primaria
    const usuario = await UserModel.findByPk(id);
    // Si no existe el usuario, responde con error 404
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // Asigna el nuevo estado al usuario
    usuario.estado = estado;
    // Guarda los cambios en la base de datos
    await usuario.save();

    // Responde con mensaje de éxito y el usuario actualizado
    res.json({ message: `Usuario ${estado} correctamente`, usuario });
  } catch (err) {
    // Si ocurre un error, responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};