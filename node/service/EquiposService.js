import EquiposModel from '../models/EquiposModel.js';

class EquiposService {
    async getAll() {
        return await EquiposModel.findAll()
    }

    async getById(id_equipo) {
        const equipo = await EquiposModel.findByPk(id_equipo)
        if (!equipo) throw new Error('Equipo no encontrado')
        return equipo
    }

    async create(Data) {
        return await EquiposModel.create(Data)
    }

    async update(id_equipo, Data) {
        const result = await EquiposModel.update(Data, { where: { id_equipo } })
        const updated = result[0]
        if (updated === 0) throw new Error('Equipo no encontrado')
        return true
    }

    async delete(id_equipo) {
        const deleted = await EquiposModel.destroy({ where: { id_equipo } })
        if (!deleted) throw new Error('Equipo no encontrado')
        return true
    }
}

export default new EquiposService();
