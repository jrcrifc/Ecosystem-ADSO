import solicitudModel from "../models/solicitudModel.js";

class solicitudService {
    async  getAll(){
        return await solicitudModel.findAll()
    }
async getById(id_solicitud){
    const solicitud = await solicitudModel.findByPk(id_solicitud)
    if (!solicitud) throw new Error('solicitud no encontrada')
    return solicitud
}

    async create(data) {
        return await solicitudModel.create(data)
    }

    async update(id,data){
        const result = await solicitudModel.update(data, { where: { id_solicitud: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await solicitudModel.destroy({where: {id_solicitud : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new solicitudService()