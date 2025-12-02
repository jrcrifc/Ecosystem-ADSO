import consumosreactivosModel from "../models/consumosreactivosModel.js";

class consumosreactivosService {
    async  getAll(){
        return await consumosreactivosModel.findAll()
    }
async getById(id_consumo_reactivos){
    const consumosreactivos = await consumosreactivosModel.findByPk(id_consumo_reactivos)
    if (!consumosreactivos) throw new Error('consumo del reactivos no encontrado')
    return consumosreactivos
}

    async create(data) {
        return await consumosreactivosModel.create(data)
    }

    async update(id,data){
        const result = await consumosreactivosModel.update(data, { where: { id_consumo_reactivos: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await consumosreactivosModel.destroy({where: {id_consumo_reactivos : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new consumosreactivosService()