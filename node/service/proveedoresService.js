import proveedoreModel from '../models/proveedoresModel.js';


class proveedoresService {
    async getAll() {
        return await proveedoreModel.findAll()
    }
    async getById(id_proveedor) {
        const proveedor = await proveedoreModel.findByPk(id_proveedor)
        if (!proveedor) throw new Error('Proveedor no encontrado')
        return proveedor
    }

    async create(Data) {
        return await proveedoreModel.create(Data)
    }

    async update(id_proveedor, Data) {
        const result = await proveedoreModel.update(Data, { where: { id_proveedor } })
        const updated = result[0]
        if (updated === 0) throw new Error('Proveedor no encontrado')
        return true
    }

    async cambiarEstado(id_proveedor, estado) {
        const result = await proveedoreModel.update({ estado }, { where: { id_proveedor } })
        if (result[0] === 0) throw new Error('Proveedor no encontrado')
        return true
    }
    async delete(id_proveedor) {
        const deleted = await proveedoreModel.destroy({ where: { id_proveedor } })
        if (!deleted) throw new Error('Proveedor no encontrado')
        return true
    }   

}

export default new proveedoresService();