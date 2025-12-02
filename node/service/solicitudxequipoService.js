import solicitudxequipoModel from "../models/solicitudxequipoModel.js";

class solicitudxequipoService {
    async  getAll(){
        return await solicitudxequipoModel.findAll()
    }
async getById(id_solicitudxequipo){
    const solicitudxequipo = await solicitudxequipoModel.findByPk(id_solicitudxequipo)
    if (!solicitudxequipo) throw new Error('solicitud x equipo no encontrada')
    return solicitudxequipo
}

    async create(data) {
        return await solicitudxequipoModel.create(data)
    }

    async update(id,data){
        const result = await solicitudxequipoModel.update(data, { where: { id_solicitudxequipo: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await solicitudxequipoModel.destroy({where: {id_solicitudxequipo : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new solicitudxequipoService()