import reactivosModel from "../models/reactivosModel.js";

class reactivosService {
    async getAll() {
        return await reactivosModel.findAll();
    }

    async getById(id_reactivo) {
        const reactivos = await reactivosModel.findByPk(id_reactivo);
        if (!reactivos) throw new Error('reactivo no encontrado');
        return reactivos;
    }

    async create(data) {
        // Auto-ajustar existencia_reactivo basado en cantidad_inventario
        if (data.cantidad_inventario !== undefined) {
            data.existencia_reactivo = data.cantidad_inventario > 0 ? "SI" : "NO";
        }
        try {
            return await reactivosModel.create(data);
        } catch (error) {
            console.error("❌ Error Sequelize:", error.errors || error.message);
            throw error;
        }
    }

    async update(id, data) {
        const result = await reactivosModel.update(data, { where: { id_reactivo: id } });
        const updated = result[0];
        if (updated === 0) throw new Error('reactivo no encontrado');
        return true;
    }

    async delete(id) {
        const deleted = await reactivosModel.destroy({ where: { id_reactivo: id } });
        if (!deleted) throw new Error('reactivo no encontrado');
        return true;
    }

    async getAllconStock() {
        const reactivos = await reactivosModel.findAll();
        return reactivos.map(reactivo => ({
            ...reactivo.toJSON(),
            estado_stock: reactivo.cantidad_inventario > 0 && reactivo.existencia_reactivo === "SI" 
                ? "disponible" 
                : "agotado"
        }));
    }
}

export default new reactivosService();