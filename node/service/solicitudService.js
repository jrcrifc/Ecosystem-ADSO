import solicitudModel from "../models/solicitudModel.js";
import Estadoxsolicitud from "../models/estadoxsolicitudModel.js";
import userModel from "../models/userModel.js";
import estadoSolicitudModel from "../models/Estado_solicitudModel.js";
import { Sequelize } from "sequelize";

class solicitudService {
    async getAll() {
        const solicitudes = await solicitudModel.findAll({
            include: [
                {
                    model: userModel,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombres_apellidos', 'rol']
                },
                {
                    model: Estadoxsolicitud,
                    as: 'estados',
                    include: [{
                        model: estadoSolicitudModel,
                        as: 'estadoSolicitud',
                        attributes: ['estado']
                    }],
                    attributes: ['id_estadoxsolicitud', 'createdat']
                }
            ],
            order: [
                [{ model: Estadoxsolicitud, as: 'estados' }, 'id_estadoxsolicitud', 'DESC']
            ]
        });

        return solicitudes.map(s => {
            const sol = s.toJSON();
            const estadosOrdenados = (sol.estados || []).sort(
                (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
            );
            const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";
            return { ...sol, ultimoEstado };
        });
    } // ← ESTA LLAVE FALTABA

    async getById(id_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        return solicitud;
    }

    async create(data, userId) {
        const solicitud = await solicitudModel.create({
            ...data,
            id_usuario: userId
        });
        await Estadoxsolicitud.create({
            id_solicitud: solicitud.id_solicitud,
            id_estado_solicitud: 1
        });
        return solicitud;
    }

    async update(id, data) {
        const result = await solicitudModel.update(data, { where: { id_solicitud: id } });
        if (result[0] === 0) throw new Error('Solicitud no encontrada');
        return true;
    }

    async cambiarEstado(id_solicitud, id_estado_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        await Estadoxsolicitud.create({
            id_solicitud,
            id_estado_solicitud
        });
        return true;
    }

    async delete(id) {
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        if (!deleted) throw new Error('Solicitud no encontrada');
        return true;
    }
}

export default new solicitudService();