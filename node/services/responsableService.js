import responsableModel from '../models/responsableModel.js';

class responsablreService {
    async getAll() {
        return await responsableModel.findAll()
    }

    async getById(id_responsable) {
        const responsable = await responsableModel.findByPk(id_responsable)
        if (!responsable) throw new Error('Responsable no encontrado')
        return responsable
    }

    async create(Data) {
        return await responsableModel.create(Data)
    }

    async update(id_responsable, Data) {
        const result = await responsableModel.update(Data, { where: { id_responsable } })
        const updated = result[0]
        if (updated === 0) throw new Error('Responsable no encontrado')
        return true
    }
    async delete(id_responsable) {
        const deleted = await responsableModel.destroy({ where: { id_responsable } })
        if (!deleted) throw new Error('Responsable no encontrado')
        return true
    }
}

export default new responsablreService();