// ============================================================
// 🔔 SERVICIO DE NOTIFICACIONES (NotificacionService)
// Este servicio maneja la creación de notificaciones en base de datos,
// la consulta de notificaciones por usuario, el marcado de lectura,
// y la difusión privada de alertas masivas a administradores mediante WebSockets.
// ============================================================

// Importa el operador Op de Sequelize para consultas avanzadas
import { Op } from "sequelize";
// Importa el modelo de notificaciones para acceder a la tabla de notificaciones
import NotificacionModel from "../models/notificacionModel.js";
// Importa el modelo de usuarios para buscar administradores
import UserModel from "../models/userModel.js";
// Importa la función de envío de notificaciones WebSocket
import { sendNotification } from "../socket.js";

// Define la clase de servicio para notificaciones con métodos de gestión y difusión
class NotificacionService {
  
  // Registra una notificación en la base de datos y la emite en tiempo real por WebSocket
  async crearNotificacion({ id_usuario_destino, id_usuario_origen, titulo, mensaje, tipo }) {
    // Crea el registro en la base de datos
    const noti = await NotificacionModel.create({
      id_usuario_destino, id_usuario_origen, titulo, mensaje, tipo
    });
    // Emite en tiempo real por el canal WebSocket correspondiente a la sala del usuario
    sendNotification(id_usuario_destino, noti.toJSON());
    // Retorna la notificación creada
    return noti;
  }

  // Obtiene las últimas 20 notificaciones recibidas por un usuario
  async getMisNotificaciones(id_usuario) {
    // Consulta las notificaciones del usuario ordenadas por fecha descendente
    return await NotificacionModel.findAll({
      where: { id_usuario_destino: id_usuario },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
  }

  // Marca una notificación específica como leída
  async marcarLeida(id_notificacion) {
    // Actualiza el campo leida a true para la notificación indicada
    await NotificacionModel.update(
      { leida: true },
      { where: { id_notificacion } }
    );
  }

  // Marca todas las notificaciones de un usuario de destino como leídas
  async marcarTodasLeidas(id_usuario) {
    // Actualiza el campo leida a true para todas las notificaciones del usuario
    await NotificacionModel.update(
      { leida: true },
      { where: { id_usuario_destino: id_usuario } }
    );
  }

  // Envía una notificación a todos los administradores del sistema aprobados
  async notificarAdmins({ id_usuario_origen, titulo, mensaje, tipo }) {
    try {
      // Busca administradores activos en la base de datos
      const admins = await UserModel.findAll({
        where: {
          // Filtra por roles de administrador en distintas variantes
          rol: {
            [Op.or]: ['Administrador', 'administrador', 'admin', 'Admin']
          },
          // Solo notifica a administradores aprobados
          estado: 'aprobado'
        }
      });
      // Muestra en consola la cantidad de administradores a notificar
      console.log(`🔔 Notificando a ${admins.length} administradores sobre: ${titulo}`);
      
      // Crea y envía la notificación de forma individual a cada administrador
      for (const admin of admins) {
        // Muestra en consola el ID del administrador destino
        console.log(`   👉 Enviando a admin ID: ${admin.id_usuario}`);
        // Crea la notificación para este administrador
        await this.crearNotificacion({
          id_usuario_destino: admin.id_usuario,
          id_usuario_origen,
          titulo, mensaje, tipo
        });
      }
    } catch (error) {
      // Muestra en consola si ocurre un error al notificar administradores
      console.error('❌ Error en notificarAdmins:', error);
    }
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new NotificacionService();
