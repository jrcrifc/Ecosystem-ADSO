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

    /**
     * Obtener el lote próximo a vencer de un reactivo
     * @param {number} id_reactivo - ID del reactivo
     * @returns {Object} Lote próximo a vencer con información
     */
    async getNextLoteToExpire(id_reactivo) {
        // Validar que el reactivo existe
        const reactivo = await reactivosModel.findByPk(id_reactivo);
        if (!reactivo) throw new Error('Reactivo no encontrado');

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Obtener todos los movimientos disponibles y no vencidos
        const movimientos = await movimientoreactivoModel.findAll({
            where: { id_reactivo },
            order: [['fecha_vencimiento', 'ASC']]
        });

        for (const mov of movimientos) {
            const cantidad_disponible = parseFloat(mov.cantidad_inicial || 0) - parseFloat(mov.cantidad_salida || 0);
            
            if (cantidad_disponible > 0) {
                // Verificar que no está vencido
                if (mov.fecha_vencimiento) {
                    const fechaVencimiento = new Date(mov.fecha_vencimiento);
                    fechaVencimiento.setHours(0, 0, 0, 0);
                    
                    const diasParaVencer = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
                    
                    // Si no está vencido, retornar este lote
                    if (diasParaVencer >= 0) {
                        return {
                            id_movimiento_reactivo: mov.id_movimiento_reactivo,
                            lote: mov.lote,
                            fecha_vencimiento: mov.fecha_vencimiento,
                            cantidad_disponible,
                            dias_para_vencer: diasParaVencer
                        };
                    }
                } else {
                    // Si no tiene fecha de vencimiento, considerarlo disponible
                    return {
                        id_movimiento_reactivo: mov.id_movimiento_reactivo,
                        lote: mov.lote,
                        fecha_vencimiento: null,
                        cantidad_disponible,
                        dias_para_vencer: null
                    };
                }
            }
        }

        throw new Error('No hay lotes disponibles para este reactivo');
    }

    /**
     * Crear salida inteligente: selecciona automáticamente lotes próximos a vencer
     * @param {Object} data - { id_reactivo, cantidad_salida }
     * @returns {Array} Array de salidas creadas
     */
    async createSmartSalida(data) {
        const { id_reactivo, cantidad_salida } = data;

        if (!id_reactivo || !cantidad_salida || cantidad_salida <= 0) {
            throw new Error('ID reactivo y cantidad válida requeridos');
        }

        // Validar reactivo
        const reactivo = await reactivosModel.findByPk(id_reactivo);
        if (!reactivo) throw new Error('Reactivo no encontrado');

        // Validar stock total
        const cantidad_total = parseFloat(reactivo.cantidad_inventario || 0);
        if (cantidad_total < cantidad_salida) {
            throw new Error(`Stock insuficiente. Disponible: ${cantidad_total}`);
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Obtener movimientos ordenados por fecha de vencimiento (próximos primero)
        const movimientos = await movimientoreactivoModel.findAll({
            where: { id_reactivo },
            order: [['fecha_vencimiento', 'ASC']]
        });

        const salidasCreadas = [];
        let cantidadPendiente = parseFloat(cantidad_salida);

        // Recorrer lotes en orden de vencimiento
        for (const mov of movimientos) {
            if (cantidadPendiente <= 0) break;

            const cantidad_disponible = parseFloat(mov.cantidad_inicial || 0) - parseFloat(mov.cantidad_salida || 0);
            
            if (cantidad_disponible > 0) {
                // Verificar que no está vencido
                let vencido = false;
                if (mov.fecha_vencimiento) {
                    const fechaVencimiento = new Date(mov.fecha_vencimiento);
                    fechaVencimiento.setHours(0, 0, 0, 0);
                    vencido = fechaVencimiento < hoy;
                }

                if (!vencido) {
                    // Sacar la cantidad posible de este lote
                    const cantidadDelLote = Math.min(cantidadPendiente, cantidad_disponible);

                    // Crear salida
                    const salida = await salidasModel.create({
                        id_movimiento_reactivo: mov.id_movimiento_reactivo,
                        cantidad_salida: cantidadDelLote
                    });

                    // Actualizar movimiento
                    await mov.update({
                        cantidad_salida: parseFloat(mov.cantidad_salida || 0) + cantidadDelLote,
                        estado_inventario: parseFloat(mov.cantidad_inicial || 0) - (parseFloat(mov.cantidad_salida || 0) + cantidadDelLote) > 0 ? "en stock" : "agotado"
                    });

                    salidasCreadas.push(salida);
                    cantidadPendiente -= cantidadDelLote;
                }
            }
        }

        // Actualizar stock y existencia del reactivo
        const nuevaCantidad = cantidad_total - cantidad_salida;
        await reactivo.update({
            cantidad_inventario: nuevaCantidad,
            existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO"
        });

        return {
            salidas_creadas: salidasCreadas,
            cantidad_total_salida: cantidad_salida,
            nuevo_stock: nuevaCantidad
        };
    }
}

export default new salidasService();