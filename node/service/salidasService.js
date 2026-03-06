// service/salidasService.js
import salidasModel from "../models/salidasModel.js";

class salidasService {
    async getAll() {
        return await salidasModel.findAll();
    }

    async getById(id_salida) {
        const salidas = await salidasModel.findByPk(id_salida);
        if (!salidas) throw new Error('salida del reactivo no encontrado');
        return salidas;
    }

    async create(data) {
        return await salidasModel.create(data);
    }

    async update(id, data) {
        const [updated] = await salidasModel.update(data, {
            where: { id_salida: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await salidasModel.destroy({
            where: { id_salida: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new salidasService();