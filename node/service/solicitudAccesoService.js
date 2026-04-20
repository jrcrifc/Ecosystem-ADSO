import SolicitudAccesoModel from "../models/solicitudAccesoModel.js";
import UserModel from "../models/userModel.js";
import NotificacionService from "./notificacionService.js";

class SolicitudAccesoService {

  async enviarFormulario({ id_usuario, ficha, grupo, motivo }) {
    const existente = await SolicitudAccesoModel.findOne({ where: { id_usuario } });
    if (existente) {
      await existente.update({ ficha, grupo, motivo, estado: 'pendiente' });
    } else {
      await SolicitudAccesoModel.create({ id_usuario, ficha, grupo, motivo });
    }

    const usuario = await UserModel.findByPk(id_usuario);

    // Notificar a todos los admins
    await NotificacionService.notificarAdmins({
      id_usuario_origen: id_usuario,
      titulo: '📋 Nueva solicitud de acceso',
      mensaje: `${usuario.nombres_apellidos} (${usuario.rol}) quiere acceder al sistema. Ficha: ${ficha} | Grupo: ${grupo} | Motivo: ${motivo}`,
      tipo: 'solicitud_acceso'
    });

    return { message: 'Formulario enviado. Espera la respuesta del administrador.' };
  }

  async getMiSolicitud(id_usuario) {
    return await SolicitudAccesoModel.findOne({ where: { id_usuario } });
  }

  async getTodasPendientes() {
    return await SolicitudAccesoModel.findAll({
      where: { estado: 'pendiente' },
      include: [{ model: UserModel, as: 'usuario', attributes: { exclude: ['password', 'token'] } }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getTodas() {
    return await SolicitudAccesoModel.findAll({
      include: [{ model: UserModel, as: 'usuario', attributes: { exclude: ['password', 'token'] } }],
      order: [['createdAt', 'DESC']]
    });
  }

  async aprobar(id_solicitud_acceso) {
    const solicitud = await SolicitudAccesoModel.findByPk(id_solicitud_acceso);
    if (!solicitud) throw new Error('Solicitud no encontrada');

    await solicitud.update({ estado: 'aprobado' });
    await UserModel.update({ estado: 'aprobado' }, { where: { id_usuario: solicitud.id_usuario } });

    // Notificar al usuario
    await NotificacionService.crearNotificacion({
      id_usuario_destino: solicitud.id_usuario,
      titulo: '✅ Acceso aprobado',
      mensaje: 'Tu solicitud de acceso fue aprobada. Ya puedes usar el sistema completo.',
      tipo: 'aprobado'
    });

    return { message: 'Usuario aprobado correctamente' };
  }

  async rechazar(id_solicitud_acceso) {
    const solicitud = await SolicitudAccesoModel.findByPk(id_solicitud_acceso);
    if (!solicitud) throw new Error('Solicitud no encontrada');

    await solicitud.update({ estado: 'rechazado' });
    await UserModel.update({ estado: 'rechazado' }, { where: { id_usuario: solicitud.id_usuario } });

    // Notificar al usuario
    await NotificacionService.crearNotificacion({
      id_usuario_destino: solicitud.id_usuario,
      titulo: '❌ Acceso rechazado',
      mensaje: 'Tu solicitud de acceso fue rechazada por el administrador. Contacta al Laboratorio Ambiental para más información.',
      tipo: 'rechazado'
    });

    return { message: 'Usuario rechazado' };
  }
}

export default new SolicitudAccesoService();