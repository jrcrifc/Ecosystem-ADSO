import solicitud_prestamoModel from "../models/solicitud_prestamoModel.js";

class solicitud_prestamoService {
    async  getAll(){
        return await solicitud_prestamoModel.findAll()
    }
async getById(id_solicitud){
    const solicitud_prestamo = await solicitud_prestamoModel.findByPk(id_solicitud)
    if (!solicitud_prestamo) throw new Error('solicitud no encontrada')
    return solicitud_prestamo
}

    async create(data) {
        return await solicitud_prestamoModel.create(data)
    }

    async update(id,data){
        const result = await solicitud_prestamoModel.update(data, { where: { id_solicitud: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('No se encontró la solicitud para actualizar')
            return true
    }

    async delete(id) {
        const deleted = await solicitud_prestamoModel.destroy({where: {id_solicitud : id }})
        if (!deleted) throw new Error('No se encontró la solicitud para eliminar')
            return true
    }

}


export default new solicitud_prestamoService()