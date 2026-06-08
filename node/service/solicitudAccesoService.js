// ============================================================
// 🔐 SERVICIO DE SOLICITUDES DE ACCESO (solicitudAccesoService)
// Este servicio gestiona el flujo de solicitudes de acceso al
// sistema por parte de usuarios nuevos. Permite enviar, consultar,
// aprobar y rechazar solicitudes, notificando automáticamente a
// los administradores y a los usuarios involucrados.
// ============================================================

// Importa el modelo de solicitud de acceso para la tabla de solicitudes de acceso
import SolicitudAccesoModel from "../models/solicitudAccesoModel.js";
// Importa el modelo de usuarios para cambiar estados
import UserModel from "../models/userModel.js";
// Importa el servicio de notificaciones para enviar alertas
import NotificacionService from "./notificacionService.js";

// Define la clase de servicio para solicitudes de acceso al sistema
class SolicitudAccesoService {

  // Envía o actualiza la solicitud de acceso de un usuario
  async enviarFormulario({ id_usuario, ficha, grupo, motivo }) {
    // Busca si ya existe una solicitud previa para este usuario
    const existente = await SolicitudAccesoModel.findOne({ where: { id_usuario } });
    if (existente) {
      // Si existe, actualiza los datos y reinicia el estado a pendiente
      await existente.update({ ficha, grupo, motivo, estado: 'pendiente' });
    } else {
      // Si no existe, crea una nueva solicitud
      await SolicitudAccesoModel.create({ id_usuario, ficha, grupo, motivo });
    }
    // Obtiene los datos del usuario solicitante
    const usuario = await UserModel.findByPk(id_usuario);
    // Notifica a todos los administradores del sistema
    await NotificacionService.notificarAdmins({
      id_usuario_origen: id_usuario,
      titulo: '📋 Nueva solicitud de acceso',
      mensaje: `${usuario.nombres_apellidos} (${usuario.rol}) quiere acceder al sistema. Ficha: ${ficha} | Grupo: ${grupo} | Motivo: ${motivo}`,
      tipo: 'solicitud_acceso'
    });
    // Retorna un mensaje de confirmación
    return { message: 'Formulario enviado. Espera la respuesta del administrador.' };
  }

  // Obtiene la solicitud de acceso de un usuario específico
  async getMiSolicitud(id_usuario) {
    return await SolicitudAccesoModel.findOne({ where: { id_usuario } });
  }

  // Obtiene todas las solicitudes pendientes de revisión
  async getTodasPendientes() {
    // Consulta solicitudes con estado pendiente incluyendo datos del usuario
    return await SolicitudAccesoModel.findAll({
      where: { estado: 'pendiente' },
      include: [{ model: UserModel, as: 'usuario', attributes: { exclude: ['password', 'token'] } }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Obtiene todas las solicitudes de acceso sin filtro de estado
  async getTodas() {
    // Consulta todas las solicitudes incluyendo datos del usuario
    return await SolicitudAccesoModel.findAll({
      include: [{ model: UserModel, as: 'usuario', attributes: { exclude: ['password', 'token'] } }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Aprueba una solicitud de acceso y activa el usuario
  async aprobar(id_solicitud_acceso) {
    // Busca la solicitud por su ID
    const solicitud = await SolicitudAccesoModel.findByPk(id_solicitud_acceso);
    // Si no existe, lanza un error
    if (!solicitud) throw new Error('Solicitud no encontrada');
    // Cambia el estado de la solicitud a aprobado
    await solicitud.update({ estado: 'aprobado' });
    // Actualiza el estado del usuario a aprobado
    await UserModel.update({ estado: 'aprobado' }, { where: { id_usuario: solicitud.id_usuario } });
    // Envía una notificación al usuario informando la aprobación
    await NotificacionService.crearNotificacion({
      id_usuario_destino: solicitud.id_usuario,
      titulo: '✅ Acceso aprobado',
      mensaje: 'Tu solicitud de acceso fue aprobada. Ya puedes usar el sistema completo.',
      tipo: 'aprobado'
    });
    // Retorna un mensaje de confirmación
    return { message: 'Usuario aprobado correctamente' };
  }

  // Rechaza una solicitud de acceso y desactiva el usuario
  async rechazar(id_solicitud_acceso) {
    // Busca la solicitud por su ID
    const solicitud = await SolicitudAccesoModel.findByPk(id_solicitud_acceso);
    // Si no existe, lanza un error
    if (!solicitud) throw new Error('Solicitud no encontrada');
    // Cambia el estado de la solicitud a rechazado
    await solicitud.update({ estado: 'rechazado' });
    // Actualiza el estado del usuario a rechazado
    await UserModel.update({ estado: 'rechazado' }, { where: { id_usuario: solicitud.id_usuario } });
    // Envía una notificación al usuario informando el rechazo
    await NotificacionService.crearNotificacion({
      id_usuario_destino: solicitud.id_usuario,
      titulo: '❌ Acceso rechazado',
      mensaje: 'Tu solicitud de acceso fue rechazada por el administrador. Contacta al Laboratorio Ambiental para más información.',
      tipo: 'rechazado'
    });
    // Retorna un mensaje de confirmación
    return { message: 'Usuario rechazado' };
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new SolicitudAccesoService();
