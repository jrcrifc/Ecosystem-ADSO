// ============================================================
// 📋 CONTROLADOR DE HISTORIAL DE ESTADOS DE SOLICITUD (estadoxsolicitudController)
// Expone los endpoints de la API HTTP para consultar y registrar las
// transiciones históricas de estados de las solicitudes de préstamo.
// ============================================================

// Importa el servicio de historial de estados de solicitud
import estadoxsolicitudService from "../service/estadoxsolicitudService.js";

// Controlador para obtener el historial completo de cambios de estado de solicitudes
export const getAllEstadoxsolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todos los registros del historial
    const estados = await estadoxsolicitudService.getAll();
    // Responde con estado 200 y la lista de registros
    res.status(200).json(estados);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener un cambio de estado individual por su ID
export const getEstadoxsolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para buscar el registro por su ID
    const estado = await estadoxsolicitudService.getById(req.params.id);
    // Responde con estado 200 y los datos del registro
    res.status(200).json(estado);
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para crear un registro en la bitácora de cambios de estado
export const createEstadoxsolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para crear el registro con los datos proporcionados
    const estado = await estadoxsolicitudService.create(req.body);
    // Responde con estado 201 y los datos del registro creado
    res.status(201).json({ message: "Registro creado", estado });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para modificar un registro de la bitácora de cambios de estado
export const updateEstadoxsolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para actualizar el registro con los nuevos datos
    await estadoxsolicitudService.update(req.params.id, req.body);
    // Responde con estado 200 y mensaje de éxito
    res.status(200).json({ message: "Registro actualizado correctamente" });
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};

// Controlador para eliminar físicamente un registro del historial de cambios de estado
export const deleteEstadoxsolicitud = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para eliminar el registro por su ID
    await estadoxsolicitudService.delete(req.params.id);
    // Responde con estado 204 sin contenido (eliminación exitosa)
    res.status(204).send();
  } catch (error) {
    // Si ocurre un error, responde con estado 400 y el mensaje de error
    res.status(400).json({ message: error.message });
  }
};
