import ingresoreactivoModel from "../models/ingresoreactivoModel.js";

class ingresoreactivoService {
    async  getAll(){
        return await ingresoreactivoModel.findAll()
    }
async getById(id_ingreso_reactivo){
    const ingreso = await ingresoreactivoModel.findByPk(id_ingreso_reactivo)
    if (!ingreso) throw new Error('ingreso del reactivo no encontrada')
    return ingreso
}

    async create(data) {
        return await ingresoreactivoModel.create(data)
    }

    async update(id,data){
        const result = await ingresoreactivoModel.update(data, { where: { id_ingreso_reactivo: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await ingresoreactivoModel.destroy({where: {id_ingreso_reactivo : id }})
        if(!deleted) throw new Error('')
            return true
    }

}


export default new ingresoreactivoService()