// ============================================================
// 📝 SERVICIO DE AUDITORÍA (logService)
// Este servicio provee la función helper para registrar logs en la base de datos.
// Almacena de manera secuencial y segura las acciones de auditoría en la tabla correspondinte.
// ============================================================

// Importa el modelo de Log para acceder a la tabla de auditoría en la base de datos
import LogModel from '../models/logModel.js';

// Exporta la función asíncrona que registra un evento de auditoría en la base de datos
export const registrarLog = async (usuario, accion, modulo, detalles = '') => {
  try {
    // Crea un registro en la tabla de logs con los datos del evento
    await LogModel.create({
      usuario,
      accion,
      modulo,
      detalles
    });
  } catch (error) {
    // Muestra en consola si ocurre un error al registrar el log
    console.error('Error al registrar log:', error);
  }
};
