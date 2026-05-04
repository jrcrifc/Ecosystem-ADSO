import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";
import proveedoresModel from "../models/proveedoresModel.js";

class movimientoreactivoService {
  async getAll() {
    const movimientos = await movimientoreactivoModel.findAll({
      include: [
        { model: reactivosModel, as: "reactivo", attributes: ["nom_reactivo", "presentacion_reactivo"] },
        { model: proveedoresModel, as: "proveedor", attributes: ["nom_proveedor", "apel_proveedor"] },
      ],
      order: [["createdAt", "DESC"]]
    });
    const todos = await movimientoreactivoModel.findAll();
    const stockPorReactivo = {};
    todos.forEach(m => {
      const id = m.id_reactivo;
      if (!stockPorReactivo[id]) stockPorReactivo[id] = 0;
      stockPorReactivo[id] += parseFloat(m.cantidad_inicial || 0);
      stockPorReactivo[id] -= parseFloat(m.cantidad_salida || 0);
    });
    return movimientos.map(m => {
      const mov = m.toJSON();
      mov.stock_actual = parseFloat((stockPorReactivo[mov.id_reactivo] || 0).toFixed(3));
      return mov;
    });
  }

  async getById(id) {
    const movimiento = await movimientoreactivoModel.findByPk(id, {
      include: [
        { model: reactivosModel, as: "reactivo", attributes: ["nom_reactivo", "presentacion_reactivo"] },
        { model: proveedoresModel, as: "proveedor", attributes: ["nom_proveedor", "apel_proveedor"] },
      ]
    });
    if (!movimiento) throw new Error("Movimiento no encontrado");
    return movimiento;
  }

  async create(data) {
    data.cantidad_inicial = parseFloat(data.cantidad_inicial || 0);
    data.cantidad_salida = parseFloat(data.cantidad_salida || 0);

    if (data.cantidad_inicial > 0 && data.cantidad_salida > 0) {
      throw new Error("No puedes registrar entrada y salida al mismo tiempo");
    }
    if (data.cantidad_inicial === 0 && data.cantidad_salida === 0) {
      throw new Error("Debes registrar una entrada o una salida");
    }

    // Traemos todos los movimientos actuales del reactivo
    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo: data.id_reactivo }
    });

    const stockActual = movimientos.reduce((acc, m) => {
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);

    // Validación general de stock total
    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActual) {
      throw new Error(`No hay suficiente stock total. Disponible: ${stockActual.toFixed(3)}`);
    }

    // ==================== LÓGICA DE SALIDA CON DIVISIÓN AUTOMÁTICA (FEFO) ====================
    if (data.cantidad_salida > 0) {
      let chosenLote = data.lote;
      let chosenFechaVenc = data.fecha_vencimiento;

      if (!chosenLote) {
        // === AUTO DIVISIÓN POR LOTES (FEFO) ===
        const loteMap = {};

        // Construimos stock disponible por lote
        movimientos.forEach(m => {
          const loteKey = m.lote || 'Sin lote';
          if (!loteMap[loteKey]) {
            loteMap[loteKey] = {
              lote: loteKey,
              fecha_vencimiento: m.fecha_vencimiento || null,
              cantidad_disponible: 0
            };
          }
          loteMap[loteKey].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
          loteMap[loteKey].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
        });

        // Ordenamos por fecha de vencimiento (primero el que vence antes)
        const hoy = new Date();
        const sortedLotes = Object.values(loteMap)
          .filter(l => {
            if (l.cantidad_disponible <= 0) return false;
            if (l.fecha_vencimiento && new Date(l.fecha_vencimiento) <= hoy) return false;
            return true;
          })
          .sort((a, b) => {
            if (!a.fecha_vencimiento) return 1;
            if (!b.fecha_vencimiento) return -1;
            return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
          });

        if (sortedLotes.length === 0) {
          throw new Error("No hay lotes con stock disponible");
        }

        let remaining = data.cantidad_salida;
        const createdMovements = [];

        for (const lot of sortedLotes) {
          if (remaining <= 0) break;

          const take = Math.min(remaining, lot.cantidad_disponible);

          const movementData = {
            id_reactivo: data.id_reactivo,
            cantidad_inicial: 0,
            cantidad_salida: parseFloat(take.toFixed(3)),
            lote: lot.lote,
            fecha_vencimiento: lot.fecha_vencimiento,
            id_proveedor: data.id_proveedor || null
          };

          const creado = await movimientoreactivoModel.create(movementData);
          createdMovements.push(creado);

          remaining -= take;
        }

        if (remaining > 0) {
          throw new Error("No hay suficiente stock total en los lotes disponibles");
        }

        return createdMovements;
      } else {
        return await movimientoreactivoModel.create(data);
      }
    }

    return await movimientoreactivoModel.create(data);
  }

  async update(id, data) {
    data.cantidad_inicial = parseFloat(data.cantidad_inicial || 0);
    data.cantidad_salida = parseFloat(data.cantidad_salida || 0);

    if (data.cantidad_inicial > 0 && data.cantidad_salida > 0) {
      throw new Error("No puedes registrar entrada y salida al mismo tiempo");
    }
    if (data.cantidad_inicial === 0 && data.cantidad_salida === 0) {
      throw new Error("Debes registrar una entrada o una salida");
    }

    const movimientoActual = await movimientoreactivoModel.findByPk(id);
    if (!movimientoActual) throw new Error("Movimiento no encontrado");

    const idReactivoNuevo = data.id_reactivo || movimientoActual.id_reactivo;

    const movsNuevo = await movimientoreactivoModel.findAll({
      where: { id_reactivo: idReactivoNuevo }
    });

    const stockActualNuevo = movsNuevo.reduce((acc, m) => {
      if (m.id_movimiento_reactivo === id) return acc;
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);

    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActualNuevo) {
      throw new Error(`No hay suficiente stock. Disponible: ${stockActualNuevo.toFixed(3)}`);
    }

    const [updated] = await movimientoreactivoModel.update(data, {
      where: { id_movimiento_reactivo: id }
    });

    if (updated === 0) throw new Error("No se pudo actualizar el movimiento");
    return true;
  }

  async delete(id) {
    const deleted = await movimientoreactivoModel.destroy({
      where: { id_movimiento_reactivo: id }
    });
    if (!deleted) throw new Error("No se pudo eliminar");
    return true;
  }

  /**
   * Obtener stock de lotes disponibles y resumen de vencidos
   */
  async getStockLotes(id_reactivo) {
    const reactivo = await reactivosModel.findByPk(id_reactivo);
    if (!reactivo) throw new Error('Reactivo no encontrado');

    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo },
      order: [['fecha_vencimiento', 'ASC']]
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const lotes_disponibles = [];
    const vencidos = [];

    // Agrupar por lote para consolidar cantidades
    const loteMap = {};
    movimientos.forEach(m => {
        const loteKey = m.lote || 'Sin lote';
        if (!loteMap[loteKey]) {
            loteMap[loteKey] = {
                id_movimiento_reactivo: m.id_movimiento_reactivo,
                lote: m.lote,
                fecha_vencimiento: m.fecha_vencimiento,
                cantidad_disponible: 0
            };
        }
        loteMap[loteKey].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
        loteMap[loteKey].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
    });

    Object.values(loteMap).forEach(lot => {
        if (lot.fecha_vencimiento) {
            const fechaVencimiento = new Date(lot.fecha_vencimiento);
            fechaVencimiento.setHours(0, 0, 0, 0);
            
            const diasParaVencer = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
            const vencido = diasParaVencer < 0;

            const lote_info = { ...lot, dias_para_vencer: diasParaVencer };

            if (vencido) {
                vencidos.push(lote_info);
            } else if (lot.cantidad_disponible > 0) {
                lotes_disponibles.push(lote_info);
            }
        } else if (lot.cantidad_disponible > 0) {
            lotes_disponibles.push({ ...lot, dias_para_vencer: null });
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