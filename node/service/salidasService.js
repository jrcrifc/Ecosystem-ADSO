import salidasModel from "../models/salidasModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";

class salidasService {
    async getAll() {
        return await salidasModel.findAll();
    }

    async getById(id_salida) {
        const salida = await salidasModel.findByPk(id_salida);
        if (!salida) throw new Error('Salida del reactivo no encontrada');
        return salida;
    }

    async create(data) {
        if (!data.cantidad_salida || data.cantidad_salida <= 0) {
            throw new Error('La cantidad de salida debe ser mayor a 0');
        }

        // 1. Buscar el movimiento para obtener el id_reactivo
        const movimiento = await movimientoreactivoModel.findByPk(data.id_movimiento_reactivo);
        if (!movimiento) throw new Error('Movimiento de reactivo no encontrado');

        // 2. Buscar el reactivo
        const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
        if (!reactivo) throw new Error('Reactivo no encontrado');

        // 3. Verificar que hay suficiente stock
        const stockActual = parseFloat(reactivo.cantidad_inventario || 0);
        if (stockActual < parseFloat(data.cantidad_salida)) {
            throw new Error(`Stock insuficiente. Disponible: ${stockActual}`);
        }

        // 4. Crear el registro de salida
        const salida = await salidasModel.create(data);

        // 5. Descontar del stock del reactivo
        const nuevaCantidad = stockActual - parseFloat(data.cantidad_salida);
        await reactivo.update({
            cantidad_inventario: nuevaCantidad,
            existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
        });

        // 6. Actualizar estado_inventario del movimiento
        await movimiento.update({
            estado_inventario: nuevaCantidad > 0 ? "en stock" : "agotado",
            cantidad_salida: parseFloat(movimiento.cantidad_salida || 0) + parseFloat(data.cantidad_salida)
        });

        return salida;
    }

    async update(id, data) {
        // Si cambia la cantidad_salida, ajustar el stock
        if (data.cantidad_salida !== undefined) {
            const salidaAnterior = await salidasModel.findByPk(id);
            if (!salidaAnterior) throw new Error('Salida no encontrada');

            const movimiento = await movimientoreactivoModel.findByPk(salidaAnterior.id_movimiento_reactivo);
            if (!movimiento) throw new Error('Movimiento no encontrado');

            const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
            if (reactivo) {
                // Revertir cantidad anterior y aplicar nueva
                const diff = parseFloat(data.cantidad_salida) - parseFloat(salidaAnterior.cantidad_salida || 0);
                const nuevaCantidad = Math.max(0, parseFloat(reactivo.cantidad_inventario || 0) - diff);

                await reactivo.update({
                    cantidad_inventario: nuevaCantidad,
                    existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
                });

                await movimiento.update({
                    estado_inventario: nuevaCantidad > 0 ? "en stock" : "agotado"
                });
            }
        }

        const [updated] = await salidasModel.update(data, {
            where: { id_salida: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        // Al borrar una salida, devolver el stock
        const salida = await salidasModel.findByPk(id);
        if (!salida) throw new Error('Salida no encontrada');

        const movimiento = await movimientoreactivoModel.findByPk(salida.id_movimiento_reactivo);
        if (movimiento) {
            const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
            if (reactivo && salida.cantidad_salida) {
                const nuevaCantidad = parseFloat(reactivo.cantidad_inventario || 0) + parseFloat(salida.cantidad_salida);
                await reactivo.update({
                    cantidad_inventario: nuevaCantidad,
                    existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
                });

                await movimiento.update({
                    estado_inventario: "en stock",
                    cantidad_salida: Math.max(0, parseFloat(movimiento.cantidad_salida || 0) - parseFloat(salida.cantidad_salida))
                });
            }
        }

        const deleted = await salidasModel.destroy({ where: { id_salida: id } });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }
}

export default new salidasService();