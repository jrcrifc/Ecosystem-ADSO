import reactivosModel from "../models/reactivosModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";

class reactivosService {
    async getAll() {
        const reactivos = await reactivosModel.findAll({
            include: [{
                model: movimientoreactivoModel,
                as: 'movimientos'
            }]
        });

        return reactivos.map(r => {
            const reactivo = r.toJSON();
            const stock = (reactivo.movimientos || []).reduce((acc, m) => {
                return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
            }, 0);
            
            return {
                ...reactivo,
                cantidad_inventario: parseFloat(stock.toFixed(3)),
                estado_stock: stock > 0 ? 'disponible' : 'agotado'
            };
        });
    }

    async getById(id_reactivo) {
        const reactivos = await reactivosModel.findByPk(id_reactivo);
        if (!reactivos) throw new Error('reactivo no encontrado');
        return reactivos;
    }

    async create(data) {
        try {
            const nuevoReactivo = await reactivosModel.create(data);
            
            // Si el reactivo se crea con una cantidad inicial, crear automáticamente el primer movimiento (lote)
            if (data.cantidad_presentacion && parseFloat(data.cantidad_presentacion) > 0) {
                await movimientoreactivoModel.create({
                    id_reactivo: nuevoReactivo.id_reactivo,
                    lote: "INICIAL",
                    cantidad_inicial: parseFloat(data.cantidad_presentacion),
                    cantidad_salida: 0,
                    // Puedes dejar la fecha de vencimiento nula o pedirla luego
                });
            }

            return nuevoReactivo;
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
        return reactivos;
    }
}

export default new reactivosService();