// service/inventarioreactivoService.js
import inventarioreactivoModel from "../models/inventarioreactivosModel.js";

class inventarioreactivoService {
    async getAll() {
        return await inventarioreactivoModel.findAll();
    }

    async getById(id_inventario_reactivo) {
        const inventarioreactivo = await inventarioreactivoModel.findByPk(id_inventario_reactivo);
        if (!inventarioreactivo) throw new Error('inventario del reactivo no encontrado');
        return inventarioreactivo;
    }

    async create(data) {
        return await inventarioreactivoModel.create(data);
    }

    async update(id, data) {
        const [updated] = await inventarioreactivoModel.update(data, {
            where: { id_inventario_reactivo: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await inventarioreactivoModel.destroy({
            where: { id_inventario_reactivo: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new inventarioreactivoService();