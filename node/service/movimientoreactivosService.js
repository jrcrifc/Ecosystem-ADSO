import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";

class movimientoreactivoService {
    async getAll() {
        return await movimientoreactivoModel.findAll();
    }

    async getById(id_movimiento_reactivo) {
        const movimiento = await movimientoreactivoModel.findByPk(id_movimiento_reactivo);
        if (!movimiento) throw new Error('Movimiento del reactivo no encontrado');
        return movimiento;
    }

    async create(data) {
        // 1. Crear el movimiento (entrada)
        const movimiento = await movimientoreactivoModel.create(data);

        // 2. Sumar cantidad_inicial al stock del reactivo
        if (data.id_reactivo && data.cantidad_inicial) {
            const reactivo = await reactivosModel.findByPk(data.id_reactivo);
            if (!reactivo) throw new Error('Reactivo no encontrado');

            const nuevaCantidad = parseFloat(reactivo.cantidad_inventario || 0) + parseFloat(data.cantidad_inicial);

            await reactivo.update({
                cantidad_inventario: nuevaCantidad,
                // Si tenía existencia NO y ahora entra stock, pasa a SI
                existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
            });

            // Actualizar estado_inventario del movimiento
            await movimiento.update({
                estado_inventario: nuevaCantidad > 0 ? "en stock" : "agotado"
            });
        }

        return movimiento;
    }

    async update(id, data) {
        // Si cambia la cantidad_inicial, ajustar el stock
        if (data.cantidad_inicial !== undefined) {
            const movimientoAnterior = await movimientoreactivoModel.findByPk(id);
            if (!movimientoAnterior) throw new Error('Movimiento no encontrado');

            const reactivo = await reactivosModel.findByPk(movimientoAnterior.id_reactivo);
            if (reactivo) {
                // Revertir la cantidad anterior y aplicar la nueva
                const diff = parseFloat(data.cantidad_inicial) - parseFloat(movimientoAnterior.cantidad_inicial || 0);
                const nuevaCantidad = Math.max(0, parseFloat(reactivo.cantidad_inventario || 0) + diff);

                await reactivo.update({
                    cantidad_inventario: nuevaCantidad,
                    existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
                });
            }
        }

        const [updated] = await movimientoreactivoModel.update(data, {
            where: { id_movimiento_reactivo: id }
        });
        if (updated === 0) throw new Error('No se pudo actualizar');
        return true;
    }

    async delete(id) {
        // Al borrar un movimiento, revertir el stock
        const movimiento = await movimientoreactivoModel.findByPk(id);
        if (!movimiento) throw new Error('Movimiento no encontrado');

        const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
        if (reactivo && movimiento.cantidad_inicial) {
            const nuevaCantidad = Math.max(0, parseFloat(reactivo.cantidad_inventario || 0) - parseFloat(movimiento.cantidad_inicial));
            await reactivo.update({
                cantidad_inventario: nuevaCantidad,
                existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
            });
        }

        const deleted = await movimientoreactivoModel.destroy({
            where: { id_movimiento_reactivo: id }
        });
        if (!deleted) throw new Error('No se pudo eliminar');
        return true;
    }

    /**
     * Obtener stock de lotes disponibles y resumen de vencidos
     * @param {number} id_reactivo - ID del reactivo
     * @returns {Object} { lotes_disponibles, resumen_vencidos }
     */
    async getStockLotes(id_reactivo) {
        // Verificar que el reactivo existe
        const reactivo = await reactivosModel.findByPk(id_reactivo);
        if (!reactivo) throw new Error('Reactivo no encontrado');

        // Obtener todos los movimientos del reactivo
        const movimientos = await movimientoreactivoModel.findAll({
            where: { id_reactivo },
            order: [['fecha_vencimiento', 'ASC']] // Ordenar por fecha de vencimiento
        });

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Sin horas para comparación correcta

        const lotes_disponibles = [];
        const vencidos = [];

        movimientos.forEach(mov => {
            const cantidad_disponible = parseFloat(mov.cantidad_inicial || 0) - parseFloat(mov.cantidad_salida || 0);
            
            if (mov.fecha_vencimiento) {
                const fechaVencimiento = new Date(mov.fecha_vencimiento);
                fechaVencimiento.setHours(0, 0, 0, 0);
                
                const diasParaVencer = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
                const vencido = diasParaVencer < 0;

                const lote_info = {
                    id_movimiento_reactivo: mov.id_movimiento_reactivo,
                    lote: mov.lote,
                    fecha_vencimiento: mov.fecha_vencimiento,
                    cantidad_disponible,
                    dias_para_vencer: diasParaVencer
                };

                if (vencido) {
                    vencidos.push(lote_info);
                } else if (cantidad_disponible > 0) {
                    lotes_disponibles.push(lote_info);
                }
            } else if (cantidad_disponible > 0) {
                // Si no tiene fecha de vencimiento, considerar como disponible
                lotes_disponibles.push({
                    id_movimiento_reactivo: mov.id_movimiento_reactivo,
                    lote: mov.lote,
                    fecha_vencimiento: null,
                    cantidad_disponible,
                    dias_para_vencer: null
                });
            }
        });

        return {
            lotes_disponibles,
            resumen_vencidos: {
                cantidad_lotes_vencidos: vencidos.length,
                detalles: vencidos
            }
        };
    }
}

export default new movimientoreactivoService();