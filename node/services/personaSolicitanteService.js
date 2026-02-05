import personaSolicitanteModel from '../models/personaSolicitanteModel.js';

class personaSolicitanteService {
    async getAll() {
        return await personaSolicitanteModel.findAll()
    }
    
    async getById(id_persona_solicitante) {
        const persona = await personaSolicitanteModel.findByPk(id_persona_solicitante)
        if (!persona) throw new Error('Persona Solicitante no encontrada')
        return persona
    }

    async create(Data) {
        return await personaSolicitanteModel.create(Data)

    }

    async update(id_persona_solicitante, Data) {
        const result = await personaSolicitanteModel.update(Data, { where: { id_persona_solicitante } })
        const updated = result[0]
        if (updated === 0) throw new Error('Persona Solicitante no encontrada')
        return true
    }

    async delete(id_persona_solicitante) {
        const deleted = await personaSolicitanteModel.destroy({ where: { id_persona_solicitante } })
        if (!deleted) throw new Error('Persona Solicitante no encontrada')
        return true
    }

}

export default new personaSolicitanteService();