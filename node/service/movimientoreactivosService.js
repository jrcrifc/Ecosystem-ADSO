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

    let chosenLote = data.lote;           // si el frontend manda lote → lo respetamos (sin dividir)
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
      // Excluir lotes vencidos
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
          id_proveedor: data.id_proveedor || null,
          estado_inventario: "en stock"   // se recalcula después
        };

        const creado = await movimientoreactivoModel.create(movementData);
        createdMovements.push(creado);

        remaining -= take;
      }

      if (remaining > 0) {
        throw new Error("No hay suficiente stock total en los lotes disponibles");
      }

      console.log(`✅ Salida dividida automáticamente en ${createdMovements.length} lotes`);
      return createdMovements;   // ← ahora retorna un ARRAY de movimientos
    } else {
      // Si mandó lote manual → comportamiento anterior (una sola fila)
      data.lote = chosenLote;
      if (chosenFechaVenc) data.fecha_vencimiento = chosenFechaVenc;
      data.estado_inventario = stockActual - data.cantidad_salida > 0 ? "en stock" : "agotado";
      return await movimientoreactivoModel.create(data);
    }
  }

  // ==================== ENTRADA (sin cambios) ====================
  const nuevoStock = stockActual + data.cantidad_inicial - data.cantidad_salida;
  data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";

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

  // Buscar el movimiento actual
  const movimientoActual = await movimientoreactivoModel.findByPk(id);
  if (!movimientoActual) throw new Error("Movimiento no encontrado");

  const idReactivoOriginal = movimientoActual.id_reactivo;
  const idReactivoNuevo = data.id_reactivo || idReactivoOriginal;   // Permitir cambio de reactivo

  // ==================== LÓGICA DE ACTUALIZACIÓN CON CAMBIO DE REACTIVO ====================

  // 1. Calcular stock ANTES del movimiento (excluyendo el movimiento actual)
  let stockAntesOriginal = 0;
  if (idReactivoOriginal !== idReactivoNuevo) {
    // Si cambia de reactivo, calculamos stock del reactivo original sin este movimiento
    const movsOriginal = await movimientoreactivoModel.findAll({
      where: { id_reactivo: idReactivoOriginal }
    });
    stockAntesOriginal = movsOriginal.reduce((acc, m) => {
      if (m.id_movimiento_reactivo === id) return acc;
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);
  }

  // 2. Calcular stock del reactivo nuevo (para validaciones)
  const movsNuevo = await movimientoreactivoModel.findAll({
    where: { id_reactivo: idReactivoNuevo }
  });

  const stockActualNuevo = movsNuevo.reduce((acc, m) => {
    if (m.id_movimiento_reactivo === id) return acc;   // excluimos el movimiento que se está editando
    return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
  }, 0);

  // Validación de salida en el reactivo nuevo
  if (data.cantidad_salida > 0 && data.cantidad_salida > stockActualNuevo) {
    throw new Error(`No hay suficiente stock en el nuevo reactivo. Disponible: ${stockActualNuevo.toFixed(3)}`);
  }

  // ==================== LÓGICA DE SALIDA CON AUTO-SELECCIÓN DE LOTE (si cambia o no) ====================
  if (data.cantidad_salida > 0) {
    let chosenLote = data.lote;
    let chosenFechaVenc = data.fecha_vencimiento;

    if (!chosenLote) {
      // Auto-escoger lote próximo a vencer (FEFO) en el reactivo NUEVO
      const loteMap = {};

      movsNuevo.forEach(m => {
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

      const hoyUpdate = new Date();
      const sortedLotes = Object.values(loteMap)
        .filter(l => {
          if (l.cantidad_disponible <= 0) return false;
          if (l.fecha_vencimiento && new Date(l.fecha_vencimiento) <= hoyUpdate) return false;
          return true;
        })
        .sort((a, b) => {
          if (!a.fecha_vencimiento) return 1;
          if (!b.fecha_vencimiento) return -1;
          return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
        });

      if (sortedLotes.length === 0) {
        throw new Error("No hay lotes con stock disponible en el reactivo seleccionado");
      }

      const bestLote = sortedLotes[0];
      if (data.cantidad_salida > bestLote.cantidad_disponible) {
        throw new Error(
          `El lote próximo a vencer (${bestLote.lote}) solo tiene ${bestLote.cantidad_disponible.toFixed(3)}. ` +
          `Reduce la cantidad o selecciona otro lote.`
        );
      }

      chosenLote = bestLote.lote;
      chosenFechaVenc = bestLote.fecha_vencimiento;
    }

    data.lote = chosenLote;
    if (chosenFechaVenc) data.fecha_vencimiento = chosenFechaVenc;
  }

  // Actualizar el estado_inventario (solo referencial)
  const nuevoStock = stockActualNuevo + data.cantidad_inicial - data.cantidad_salida;
  data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";

  // ==================== EJECUTAR LA ACTUALIZACIÓN ====================
  const [updated] = await movimientoreactivoModel.update(data, {
    where: { id_movimiento_reactivo: id }
  });

  if (updated === 0) throw new Error("No se pudo actualizar el movimiento");

  console.log(`✅ Movimiento ${id} actualizado. Reactivo cambió de ${idReactivoOriginal} a ${idReactivoNuevo}`);

  return true;
}

  async delete(id) {
    const deleted = await movimientoreactivoModel.destroy({
      where: { id_movimiento_reactivo: id }
    });
    if (!deleted) throw new Error("No se pudo eliminar");
    return true;
  }
}

export default new movimientoreactivoService();