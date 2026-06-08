// ============================================================
// 📋 CONTROLADOR DE SOLICITUDES DE ACCESO (solicitudAccesoController)
// Maneja las peticiones HTTP relacionadas con el envío,
// consulta y gestión (aprobar/rechazar) de solicitudes de acceso.
// ============================================================

// Importa el servicio de solicitudes de acceso para la lógica de negocio
import SolicitudAccesoService from "../service/solicitudAccesoService.js";

// Controlador para enviar un nuevo formulario de solicitud de acceso al laboratorio
export const enviarFormulario = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Extrae los campos del cuerpo de la petición
    const { id_usuario, ficha, grupo, motivo } = req.body;
    // Valida que todos los campos obligatorios estén presentes
    if (!id_usuario || !ficha || !grupo || !motivo)
      // Responde con error 400 si faltan campos
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    // Llama al servicio para procesar el formulario de solicitud
    const result = await SolicitudAccesoService.enviarFormulario({ id_usuario, ficha, grupo, motivo });
    // Responde con el resultado de la operación
    res.json(result);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener la solicitud de acceso de un usuario específico
export const getMiSolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener la solicitud por ID de usuario
    const solicitud = await SolicitudAccesoService.getMiSolicitud(req.params.id_usuario);
    // Responde con los datos de la solicitud
    res.json(solicitud);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener todas las solicitudes de acceso pendientes
export const getTodasPendientes = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener las solicitudes pendientes
    const solicitudes = await SolicitudAccesoService.getTodasPendientes();
    // Responde con la lista de solicitudes pendientes
    res.json(solicitudes);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener todas las solicitudes de acceso sin filtro
export const getTodas = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todas las solicitudes
    const solicitudes = await SolicitudAccesoService.getTodas();
    // Responde con la lista completa de solicitudes
    res.json(solicitudes);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para aprobar una solicitud de acceso pendiente
export const aprobarSolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para aprobar la solicitud por su ID
    const result = await SolicitudAccesoService.aprobar(req.params.id);
    // Responde con el resultado de la operación
    res.json(result);
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para rechazar una solicitud de acceso pendiente
export const rechazarSolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para rechazar la solicitud por su ID
    const result = await SolicitudAccesoService.rechazar(req.params.id);
    // Responde con el resultado de la operación
    res.json(result);
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};