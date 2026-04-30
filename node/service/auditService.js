import AuditLogModel from "../models/auditLogModel.js";

class AuditService {
  /**
   * Registra una acción en la bitácora de auditoría
   * @param {Object} param0 
   * @param {number} param0.id_usuario - ID del usuario que realiza la acción
   * @param {string} param0.accion - Descripción de la acción (ej: 'CREAR', 'ACTUALIZAR')
   * @param {string} param0.modulo - Nombre del módulo (ej: 'REACTIVOS', 'EQUIPOS')
   * @param {string} param0.detalle - Detalles adicionales (ej: 'Se actualizó el stock del reactivo X')
   * @param {string} param0.ip - IP del cliente
   */
  async log({ id_usuario, accion, modulo, detalle, ip }) {
    try {
      await AuditLogModel.create({
        id_usuario,
        accion,
        modulo,
        detalle,
        ip
      });
    } catch (error) {
      console.error("❌ Error al guardar log de auditoría:", error);
    }
  }

  async getAllLogs() {
    return await AuditLogModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100
      // include: [{ model: UserModel, as: 'usuario', attributes: ['nombres_apellidos', 'rol'] }]
    });
  }
}

export default new AuditService();
