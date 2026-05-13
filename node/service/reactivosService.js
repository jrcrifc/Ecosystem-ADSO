import reactivosModel from "../models/reactivosModel.js";

class reactivosService {
    async  getAll(){
        return await reactivosModel.findAll({
            order: [['id_reactivo', 'DESC']]
        })
    }
async getById(id_reactivo){
    const reactivos = await reactivosModel.findByPk(id_reactivo)
    if (!reactivos) throw new Error('reactivo no encontrado')
    return reactivos
}

    async create(data) {
    console.log("📥 Datos a guardar:", JSON.stringify(data, null, 2));
    try {
        return await reactivosModel.create(data);
    } catch (error) {
        console.error("❌ Error Sequelize completo:", error.errors); // ← esto muestra el campo exacto
        throw error;
    }
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