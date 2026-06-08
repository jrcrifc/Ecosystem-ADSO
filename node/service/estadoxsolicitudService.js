// ============================================================
// 📋 SERVICIO DE HISTORIAL DE ESTADOS DE SOLICITUD (estadoxsolicitudService)
// Este servicio administra el registro histórico de cambios de
// estado de las solicitudes de préstamo. Cada vez que una solicitud
// avanza en su flujo (generado, aceptado, prestado, devuelto, etc.)
// se guarda un registro con la fecha del cambio.
// ============================================================

// Importa el modelo de historial de estados de solicitud
import Estadoxsolicitud from '../models/estadoxsolicitudModel.js';
// Importa el modelo de solicitudes para las relaciones
import solicitudModel from '../models/solicitudModel.js';
// Importa el modelo de estados de solicitud para el catálogo
import estadoSolicitudModel from '../models/Estado_solicitudModel.js';
// Importa el modelo de usuarios para incluir datos del solicitante
import userModel from '../models/userModel.js';

// Define la clase de servicio para el historial de estados de solicitud
class EstadoxsolicitudService {
  // Obtiene todo el historial de cambios de estado de solicitudes
  async getAll() {
    // Consulta todos los registros del historial con sus relaciones
    return await Estadoxsolicitud.findAll({
        include: [
            {
                // Incluye los datos de la solicitud asociada
                model: solicitudModel,
                as: 'solicitud',
                attributes: ['id_solicitud', 'id_usuario', 'fecha_inicio', 'fecha_fin'],
                include: [{
                    // Incluye los datos del usuario que creó la solicitud
                    model: userModel,
                    as: 'usuario',
                    attributes: ['nombres_apellidos']
                }]
            },
            {
                // Incluye el nombre del estado de solicitud desde el catálogo
                model: estadoSolicitudModel,
                as: 'estadoSolicitud',
                attributes: ['estado']
            }
        ],
        // Ordena los registros del más reciente al más antiguo
        order: [['createdat', 'DESC']]
    });
  }

  // Obtiene un registro del historial por su ID
  async getById(id) {
    // Busca el registro por su clave primaria
    const estado = await Estadoxsolicitud.findByPk(id);
    // Si no existe, lanza un error
    if (!estado) throw new Error("Registro no encontrado");
    // Retorna el registro encontrado
    return estado;
  }

  // Crea un nuevo registro en el historial de estados de solicitud
  async create(data) {
    return await Estadoxsolicitud.create(data);
  }

  // Elimina físicamente un registro del historial
  async delete(id) {
    // Ejecuta la eliminación filtrando por ID
    const deleted = await Estadoxsolicitud.destroy({ where: { id_estadoxsolicitud: id } });
    // Si no se eliminó ningún registro, lanza un error
    if (!deleted) throw new Error("Registro no encontrado");
    // Retorna true indicando que la eliminación fue exitosa
    return true;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new EstadoxsolicitudService();
