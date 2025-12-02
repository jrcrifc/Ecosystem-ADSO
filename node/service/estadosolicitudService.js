// service/estadosolicitudService.js
import estadoSolicitudModel from "../models/estadosolicitudModel.js";

class EstadosSolicitudService {
    async getAll() {
        return await estadoSolicitudModel.findAll();
    }

    async getById(id_estado_solicitud) {
        const estado = await estadoSolicitudModel.findByPk(id_estado_solicitud);
        if (!estado) throw new Error('Estado de solicitud no encontrado');
        return estado;
    }

    async create(data) {
        return await estadoSolicitudModel.create(data);
    }

    async update(id, data) {
        const [updated] = await estadoSolicitudModel.update(data, {
            where: { id_estado_solicitud: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await estadoSolicitudModel.destroy({
            where: { id_estado_solicitud: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new EstadosSolicitudService();