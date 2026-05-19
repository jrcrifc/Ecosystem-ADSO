import { Op } from "sequelize";
import NotificacionModel from "../models/notificacionModel.js";
import UserModel from "../models/userModel.js";
import { sendNotification } from "../socket.js";

class NotificacionService {
  async crearNotificacion({ id_usuario_destino, id_usuario_origen, titulo, mensaje, tipo }) {
    const noti = await NotificacionModel.create({
      id_usuario_destino, id_usuario_origen, titulo, mensaje, tipo
    });
    // Emitir por socket
    sendNotification(id_usuario_destino, noti.toJSON());
    return noti;
  }

  async getMisNotificaciones(id_usuario) {
    return await NotificacionModel.findAll({
      where: { id_usuario_destino: id_usuario },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
  }

  async marcarLeida(id_notificacion) {
    await NotificacionModel.update(
      { leida: true },
      { where: { id_notificacion } }
    );
  }

  async marcarTodasLeidas(id_usuario) {
    await NotificacionModel.update(
      { leida: true },
      { where: { id_usuario_destino: id_usuario } }
    );
  }

  // Notificar a todos los admins
  async notificarAdmins({ id_usuario_origen, titulo, mensaje, tipo }) {
    try {
      const admins = await UserModel.findAll({
        where: {
          rol: {
            [Op.or]: ['Administrador', 'administrador', 'admin', 'Admin']
          },
          estado: 'aprobado'
        }
      });
      console.log(`🔔 Notificando a ${admins.length} administradores sobre: ${titulo}`);
      for (const admin of admins) {
        console.log(`   👉 Enviando a admin ID: ${admin.id_usuario}`);
        await this.crearNotificacion({
          id_usuario_destino: admin.id_usuario,
          id_usuario_origen,
          titulo, mensaje, tipo
        });
      }
    } catch (error) {
      console.error('❌ Error en notificarAdmins:', error);
    }
  }
}

export default new NotificacionService();