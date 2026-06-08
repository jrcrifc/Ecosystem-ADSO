// ============================================================
// 📝 CONTROLADOR DE AUDITORÍA Y BITÁCORAS (logController)
// Expone endpoints HTTP para que el administrador consulte
// el registro de logs del sistema (últimos 200 logs en orden cronológico inverso).
// ============================================================

// Importa el modelo de logs para consultar la tabla de auditoría
import LogModel from '../models/logModel.js';

// Controlador para retornar los últimos 200 logs de auditoría del sistema
export const getLogs = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Consulta los últimos 200 registros ordenados por fecha descendente
    const logs = await LogModel.findAll({
      order: [['fecha', 'DESC']],
      limit: 200
    });
    // Responde con la lista de logs en formato JSON
    res.json(logs);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error al obtener logs' });
  }
};
