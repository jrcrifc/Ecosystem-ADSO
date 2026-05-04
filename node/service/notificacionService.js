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
    const admins = await UserModel.findAll({
      where: { rol: 'Administrador', estado: 'aprobado' }
    });
    for (const admin of admins) {
      await this.crearNotificacion({
        id_usuario_destino: admin.id_usuario,
        id_usuario_origen,
        titulo, mensaje, tipo
      });
    }
  }
}

export default new NotificacionService();