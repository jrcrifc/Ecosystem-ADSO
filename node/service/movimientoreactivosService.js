// service/movimientoreactivoService.js
import movimientoreactivorModel from "../models/movimientoreactivosModel.js";

class movimientoreactivoService {
    async getAll() {
        return await movimientoreactivorModel.findAll();
    }

    async getById(id_movimiento_reactivo) {
        const movimientoreactivo = await movimientoreactivorModel.findByPk(id_movimiento_reactivo);
        if (!movimientoreactivo) throw new Error('movimiento del reactivo no encontrado');
        return movimientoreactivo;
    }

    async create(data) {
        return await movimientoreactivorModel.create(data);
    }

    async update(id, data) {
        const [updated] = await movimientoreactivorModel.update(data, {
            where: { id_movimiento_reactivo: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await movimientoreactivorModel.destroy({
            where: { id_movimiento_reactivo: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new movimientoreactivoService();