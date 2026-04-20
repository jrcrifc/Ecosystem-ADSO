import solicitudModel from "../models/solicitudModel.js";
import solicitudxequipoModel from "../models/solicitudxequipoModel.js";

class solicitudService {

    async getAll() {
        return await solicitudModel.findAll();
    }

    async getByUsuario(id_usuario) {
        return await solicitudModel.findAll({
            where: { id_usuario }
        });
    }

    async getById(id_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        return solicitud;
    }

    // ✅ PUNTO 4 — crea solicitud y asigna equipos en una sola operación
    async create(data) {
        const { equipos, ...solicitudData } = data;

        const nuevaSolicitud = await solicitudModel.create(solicitudData);

        if (equipos && equipos.length > 0) {
            const registros = equipos.map(id_equipo => ({
                id_solicitud: nuevaSolicitud.id_solicitud,
                id_equipo
            }));
            await solicitudxequipoModel.bulkCreate(registros);
        }

        return nuevaSolicitud;
    }

    async update(id, data) {
        const result = await solicitudModel.update(data, { where: { id_solicitud: id } });
        if (result[0] === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new solicitudService();