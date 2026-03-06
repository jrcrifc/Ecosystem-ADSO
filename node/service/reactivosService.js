import reactivosModel from "../models/reactivosModel.js";

class reactivosService {
    async  getAll(){
        return await reactivosModel.findAll()
    }
async getById(id_reactivo){
    const reactivos = await reactivosModel.findByPk(id_reactivo)
    if (!reactivos) throw new Error('reactivo no encontrado')
    return reactivos
}

    async create(data) {
        return await reactivosModel.create(data)
    }

    async update(id,data){
        const result = await reactivosModel.update(data, { where: { id_reactivo: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await reactivosModel.destroy({where: {id_reactivo : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new reactivosService()