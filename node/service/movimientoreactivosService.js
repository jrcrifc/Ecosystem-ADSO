// service/movimientoreactivoService.js
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";

class movimientoreactivoService {
    async getAll() {
        return await movimientoreactivoModel.findAll();
    }

    async getById(id_movimiento_reactivo) {
        const movimientoreactivo = await movimientoreactivoModel.findByPk(id_movimiento_reactivo);
        if (!movimientoreactivo) throw new Error('movimiento del reactivo no encontrado');
        return movimientoreactivo;
    }

    async create(data) {
        return await movimientoreactivoModel.create(data);
    }

    async update(id, data) {
        const [updated] = await movimientoreactivoModel.update(data, {
            where: { id_movimiento_reactivo: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        const deleted = await movimientoreactivoModel.destroy({
            where: { id_movimiento_reactivo: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new movimientoreactivoService();