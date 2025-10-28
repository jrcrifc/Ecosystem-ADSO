import personaSolicitanteModel from "../models/personaSolicitanteModel.js";

class PersonaSolicitanteService {
    async  getAll(){
        return await personaSolicitanteModel.findAll()
    }
async getById(id_persona_solicitante){
    const personaSolicitante = await personaSolicitanteModel.findByPk(id_persona_solicitante)
    if (!personaSolicitante) throw new Error('persona solicitante no encontrada')
    return personaSolicitante
}

    async create(data) {
        return await personaSolicitanteModel.create(data)
    }

    async update(id,data){
        const result = await personaSolicitanteModel.update(data, { where: { id_persona_solicitante: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await personaSolicitanteModel.destroy({where: {id_persona_solicitante : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new PersonaSolicitanteService()