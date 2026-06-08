// ============================================================
// 🔔 CONTROLADOR DE NOTIFICACIONES (notificacionController)
// Maneja las peticiones HTTP relacionadas con la consulta y
// marcado de notificaciones de usuario.
// ============================================================

// Importa el servicio de notificaciones para la lógica de negocio
import NotificacionService from "../service/notificacionService.js";

// Controlador para obtener todas las notificaciones de un usuario específico
export const getMisNotificaciones = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Extrae el ID del usuario de los parámetros de la ruta
    const id_usuario = req.params.id;
    // Llama al servicio para obtener las notificaciones del usuario
    const notificaciones = await NotificacionService.getMisNotificaciones(id_usuario);
    // Responde con la lista de notificaciones en formato JSON
    res.json(notificaciones);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para marcar una notificación individual como leída
export const marcarLeida = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para marcar la notificación como leída por su ID
    await NotificacionService.marcarLeida(req.params.id);
    // Responde con mensaje de éxito
    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para marcar todas las notificaciones de un usuario como leídas
export const marcarTodasLeidas = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para marcar todas las notificaciones como leídas
    await NotificacionService.marcarTodasLeidas(req.params.id_usuario);
    // Responde con mensaje de éxito
    res.json({ message: 'Todas marcadas como leídas' });
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};