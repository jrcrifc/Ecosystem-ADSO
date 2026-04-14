import Estadoxsolicitud from '../models/estadoxsolicitudModel.js';
import solicitudModel from '../models/solicitudModel.js';
import estadoSolicitudModel from '../models/Estado_solicitudModel.js';
import userModel from '../models/userModel.js';
class EstadoxsolicitudService {
   async getAll() {
    return await Estadoxsolicitud.findAll({
        include: [
            {
                model: solicitudModel,
                as: 'solicitud',
                attributes: ['id_solicitud', 'fecha_inicio', 'fecha_fin'],
                include: [{
                    model: userModel,  // ← agrega este
                    as: 'usuario',
                    attributes: ['nombres_apellidos']
                }]
            },
            {
                model: estadoSolicitudModel,
                as: 'estadoSolicitud',
                attributes: ['estado']
            }
        ],
        order: [['createdat', 'DESC']]
    });
}
    async getById(id) {
        const estado = await Estadoxsolicitud.findByPk(id);
        if (!estado) throw new Error("Registro no encontrado");
        return estado;
    }

    async create(data) {
        return await Estadoxsolicitud.create(data);
    }

    async delete(id) {
        const deleted = await Estadoxsolicitud.destroy({ where: { id_estadoxsolicitud: id } });
        if (!deleted) throw new Error("Registro no encontrado");
        return true;
    }
}
export default new EstadoxsolicitudService();