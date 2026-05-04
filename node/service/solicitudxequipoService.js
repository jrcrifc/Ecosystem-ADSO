import solicitudxequipoModel from "../models/solicitudxequipoModel.js";
import solicitudModel from "../models/solicitudModel.js";
import EquiposModel from "../models/EquiposModel.js";
import userModel from "../models/userModel.js";

class solicitudxequipoService {
    async getAll() {
        return await solicitudxequipoModel.findAll({
            include: [
                {
                    model: solicitudModel,
                    as: 'solicitud',
                    attributes: ['id_solicitud', 'fecha_inicio', 'fecha_fin'],
                    include: [{
                        model: userModel,
                        as: 'usuario',
                        attributes: ['nombres_apellidos']
                    }]
                },
                {
                    model: EquiposModel,
                    as: 'equipo',
                    attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa']
                }
            ]
        });
    }

    async getById(id) {
        const reg = await solicitudxequipoModel.findByPk(id, {
            include: [
                { model: solicitudModel, as: 'solicitud' },
                { model: EquiposModel, as: 'equipo' }
            ]
        });
        if (!reg) throw new Error('Relación no encontrada');
        return reg;
    }

    async create(data) {
        return await solicitudxequipoModel.create(data);
    }

    async update(id, data) {
        const result = await solicitudxequipoModel.update(data, { where: { id_solicitudxequipo: id } });
        if (result[0] === 0) throw new Error('Registro no encontrado');
        return true;
    }

    async delete(id) {
        const deleted = await solicitudxequipoModel.destroy({ where: { id_solicitudxequipo: id } });
        if (!deleted) throw new Error('Registro no encontrado');
        return true;
    }
}

export default new solicitudxequipoService();