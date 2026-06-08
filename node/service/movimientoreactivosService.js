// ============================================================
// 🧪 SERVICIO DE MOVIMIENTO DE REACTIVOS (movimientoreactivoService)
// Este servicio gestiona las transacciones físicas (Entradas y Salidas)
// del inventario de reactivos químicos del laboratorio.
// Implementa un algoritmo de despacho FEFO (First Expired, First Out)
// que distribuye automáticamente las cantidades de salida priorizando los
// lotes cuya fecha de vencimiento esté más cercana en el tiempo.
// ============================================================

// Importa el modelo de movimientos de reactivos para la tabla de transacciones
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
// Importa el modelo de reactivos para actualizar existencias
import reactivosModel from "../models/reactivosModel.js";
// Importa el modelo de proveedores para incluir datos del proveedor
import proveedoresModel from "../models/proveedoresModel.js";
// Importa el modelo de salidas para desactivar salidas vinculadas
import salidasModel from "../models/salidasModel.js";

// Define la clase de servicio para movimientos de reactivos con lógica FEFO
class movimientoreactivoService {
  
  // Obtiene todos los movimientos activos con stock calculado dinámicamente
  async getAll() {
    // Consulta todos los movimientos activos incluyendo reactivo y proveedor
    const movimientos = await movimientoreactivoModel.findAll({
      where: { estado: 1 },
      include: [
        { model: reactivosModel, as: "reactivo", attributes: ["nom_reactivo", "presentacion_reactivo"] },
        { model: proveedoresModel, as: "proveedor", attributes: ["nom_proveedor", "apel_proveedor"] },
      ],
      order: [["id_movimiento_reactivo", "DESC"]]
    });
    // Obtiene todos los movimientos activos para calcular el stock consolidado por reactivo
    const todos = await movimientoreactivoModel.findAll({ where: { estado: 1 } });
    const stockPorReactivo = {};
    // Suma las entradas y resta las salidas para cada reactivo
    todos.forEach(m => {
      const id = m.id_reactivo;
      if (!stockPorReactivo[id]) stockPorReactivo[id] = 0;
      stockPorReactivo[id] += parseFloat(m.cantidad_inicial || 0);
      stockPorReactivo[id] -= parseFloat(m.cantidad_salida || 0);
    });
    // Adjunta a cada movimiento su stock consolidado para visualización en frontend
    return movimientos.map(m => {
      const mov = m.toJSON();
      mov.stock_actual = parseFloat((stockPorReactivo[mov.id_reactivo] || 0).toFixed(3));
      return mov;
    });
  }

  // Obtiene un movimiento por su ID primario
  async getById(id) {
    // Busca el movimiento por su clave primaria incluyendo reactivo y proveedor
    const movimiento = await movimientoreactivoModel.findByPk(id, {
      include: [
        { model: reactivosModel, as: "reactivo", attributes: ["nom_reactivo", "presentacion_reactivo"] },
        { model: proveedoresModel, as: "proveedor", attributes: ["nom_proveedor", "apel_proveedor"] },
      ]
    });
    // Si no existe, lanza un error
    if (!movimiento) throw new Error("Movimiento no encontrado");
    // Retorna el movimiento encontrado
    return movimiento;
  }

  // Crea un movimiento de entrada o salida con lógica FEFO para salidas
  async create(data) {
    // Convierte las cantidades a valores numéricos
    data.cantidad_inicial = parseFloat(data.cantidad_inicial || 0);
    data.cantidad_salida = parseFloat(data.cantidad_salida || 0);
    // Valida que no se registren entrada y salida al mismo tiempo
    if (data.cantidad_inicial > 0 && data.cantidad_salida > 0) {
      throw new Error("No puedes registrar entrada y salida al mismo tiempo");
    }
    // Valida que al menos una cantidad sea mayor a cero
    if (data.cantidad_inicial === 0 && data.cantidad_salida === 0) {
      throw new Error("Debes registrar una entrada o una salida");
    }
    // Obtiene los movimientos vigentes de este reactivo en específico
    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo: data.id_reactivo, estado: 1 }
    });
    // Calcula el stock consolidado del reactivo actual
    const stockActual = movimientos.reduce((acc, m) => {
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);
    // Si es una salida, verifica que el stock total sea suficiente
    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActual) {
      throw new Error(`No hay suficiente stock total. Disponible: ${stockActual.toFixed(3)}`);
    }
    // ============================================================
    // 📤 LÓGICA DE SALIDA CON DIVISIÓN AUTOMÁTICA (FEFO)
    // ============================================================
    if (data.cantidad_salida > 0) {
      // Almacena el lote opcional enviado por el usuario
      let chosenLote = data.lote;
      let chosenFechaVenc = data.fecha_vencimiento;
      // Si el usuario no especificó un lote manual, divide automáticamente por FEFO
      if (!chosenLote) {
        const loteMap = {};
        // Agrupa el stock disponible mapeado por cada lote único
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
        // Filtra lotes sin stock y lotes vencidos, y ordena por fecha de vencimiento ascendente
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
        // Si no hay lotes disponibles, lanza un error
        if (sortedLotes.length === 0) {
          throw new Error("No hay lotes con stock disponible");
        }
        // Inicializa la cantidad restante por distribuir
        let remaining = data.cantidad_salida;
        const createdMovements = [];
        // Distribuye la cantidad total de la salida secuencialmente en los lotes
        for (const lot of sortedLotes) {
          if (remaining <= 0) break;
          // Toma la cantidad mínima entre lo que queda y lo disponible en el lote
          const take = Math.min(remaining, lot.cantidad_disponible);
          // Prepara los datos del movimiento parcial
          const movementData = {
            id_reactivo: data.id_reactivo,
            cantidad_inicial: 0,
            cantidad_salida: parseFloat(take.toFixed(3)),
            lote: lot.lote,
            fecha_vencimiento: lot.fecha_vencimiento,
            id_proveedor: data.id_proveedor || null,
            estado_inventario: "en stock"
          };
          // Crea el movimiento parcial en la base de datos
          const creado = await movimientoreactivoModel.create(movementData);
          createdMovements.push(creado);
          // Reduce la cantidad restante
          remaining -= take;
        }
        // Si aún queda cantidad por distribuir, lanza un error
        if (remaining > 0) {
          throw new Error("No hay suficiente stock total en los lotes disponibles");
        }
        // Muestra en consola la cantidad de lotes en que se dividió la salida
        console.log(`✅ Salida dividida automáticamente en ${createdMovements.length} lotes`);
        // Retorna el array de movimientos creados
        return createdMovements;
      } else {
        // Si el usuario especificó manualmente el lote, registra un único movimiento
        data.lote = chosenLote;
        if (chosenFechaVenc) data.fecha_vencimiento = chosenFechaVenc;
        data.estado_inventario = stockActual - data.cantidad_salida > 0 ? "en stock" : "agotado";
        return await movimientoreactivoModel.create(data);
      }
    }
    // ============================================================
    // 📥 LÓGICA DE ENTRADA (Añade stock directamente)
    // ============================================================
    // Calcula el nuevo stock después de la entrada
    const nuevoStock = stockActual + data.cantidad_inicial - data.cantidad_salida;
    data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";
    // Crea el movimiento de entrada
    return await movimientoreactivoModel.create(data);
  }

  // Actualiza un movimiento de inventario existente con control de cambios de reactivo
  async update(id, data) {
    // Convierte las cantidades a valores numéricos
    data.cantidad_inicial = parseFloat(data.cantidad_inicial || 0);
    data.cantidad_salida = parseFloat(data.cantidad_salida || 0);
    // Valida que no se registren entrada y salida al mismo tiempo
    if (data.cantidad_inicial > 0 && data.cantidad_salida > 0) {
      throw new Error("No puedes registrar entrada y salida al mismo tiempo");
    }
    // Valida que al menos una cantidad sea mayor a cero
    if (data.cantidad_inicial === 0 && data.cantidad_salida === 0) {
      throw new Error("Debes registrar una entrada o una salida");
    }
    // Obtiene el registro a modificar
    const movimientoActual = await movimientoreactivoModel.findByPk(id);
    if (!movimientoActual) throw new Error("Movimiento no encontrado");
    // Almacena los IDs de reactivo original y nuevo
    const idReactivoOriginal = movimientoActual.id_reactivo;
    const idReactivoNuevo = data.id_reactivo || idReactivoOriginal;
    // Calcula el stock original sin contar el movimiento que se está editando
    let stockAntesOriginal = 0;
    if (idReactivoOriginal !== idReactivoNuevo) {
      const movsOriginal = await movimientoreactivoModel.findAll({
        where: { id_reactivo: idReactivoOriginal, estado: 1 }
      });
      stockAntesOriginal = movsOriginal.reduce((acc, m) => {
        if (m.id_movimiento_reactivo === id) return acc;
        return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
      }, 0);
    }
    // Calcula el stock disponible en el reactivo destino
    const movsNuevo = await movimientoreactivoModel.findAll({
      where: { id_reactivo: idReactivoNuevo, estado: 1 }
    });
    const stockActualNuevo = movsNuevo.reduce((acc, m) => {
      if (m.id_movimiento_reactivo === id) return acc;
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);
    // Si es salida, valida que haya stock suficiente en el reactivo destino
    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActualNuevo) {
      throw new Error(`No hay suficiente stock en el nuevo reactivo. Disponible: ${stockActualNuevo.toFixed(3)}`);
    }
    // ============================================================
    // 📤 ACTUALIZACIÓN DE SALIDA: ASIGNACIÓN O DIVISIÓN DE LOTE
    // ============================================================
    if (data.cantidad_salida > 0) {
      let chosenLote = data.lote;
      let chosenFechaVenc = data.fecha_vencimiento;
      if (!chosenLote) {
        // Obtiene el lote óptimo FEFO (el más próximo a vencer con stock)
        const loteMap = {};
        // Agrupa el stock disponible mapeado por cada lote único
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
        // Filtra lotes sin stock y vencidos, ordena por fecha de vencimiento
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
        // Si no hay lotes disponibles, lanza un error
        if (sortedLotes.length === 0) {
          throw new Error("No hay lotes con stock disponible en el reactivo seleccionado");
        }
        // Toma el mejor lote según FEFO
        const bestLote = sortedLotes[0];
        // Si la cantidad de salida supera la disponible en el mejor lote, lanza un error
        if (data.cantidad_salida > bestLote.cantidad_disponible) {
          throw new Error(
            `El lote próximo a vencer (${bestLote.lote}) solo tiene ${bestLote.cantidad_disponible.toFixed(3)}. ` +
            `Reduce la cantidad o selecciona otro lote.`
          );
        }
        // Asigna el lote seleccionado
        chosenLote = bestLote.lote;
        chosenFechaVenc = bestLote.fecha_vencimiento;
      }
      // Asigna el lote y fecha de vencimiento a los datos
      data.lote = chosenLote;
      if (chosenFechaVenc) data.fecha_vencimiento = chosenFechaVenc;
    }
    // Calcula el nuevo stock después de la actualización
    const nuevoStock = stockActualNuevo + data.cantidad_inicial - data.cantidad_salida;
    data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";
    // Modifica el movimiento en la base de datos
    const [updated] = await movimientoreactivoModel.update(data, {
      where: { id_movimiento_reactivo: id }
    });
    // Si no se actualizó ningún registro, lanza un error
    if (updated === 0) throw new Error("No se pudo actualizar el movimiento");
    // Muestra en consola el resultado de la actualización
    console.log(`✅ Movimiento ${id} actualizado. Reactivo cambió de ${idReactivoOriginal} a ${idReactivoNuevo}`);
    // Retorna true indicando que la actualización fue exitosa
    return true;
  }

  // Realiza una desactivación lógica del movimiento y sus salidas asociadas
  async delete(id) {
    // Busca el movimiento por su ID
    const movimiento = await movimientoreactivoModel.findByPk(id);
    if (!movimiento) throw new Error("Movimiento no encontrado");
    // Desactivación lógica del movimiento en sí
    await movimiento.update({ estado: 0 });
    // Desactivación lógica de todas las salidas ligadas a este movimiento
    await salidasModel.update({ estado: 0 }, { where: { id_movimiento_reactivo: id } });
    // Recalcula y actualiza la disponibilidad del reactivo principal en la base de datos
    const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
    if (reactivo) {
      // Obtiene los movimientos activos restantes del reactivo
      const movimientosActivos = await movimientoreactivoModel.findAll({
        where: { id_reactivo: movimiento.id_reactivo, estado: 1 }
      });
      // Calcula el stock total disponible
      const stockTotal = movimientosActivos.reduce((acc, m) => {
        return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
      }, 0);
      // Actualiza el campo de existencia del reactivo
      await reactivo.update({ existencia_reactivo: stockTotal > 0 ? 'SI' : 'NO' });
    }
    // Retorna true indicando que la eliminación fue exitosa
    return true;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new movimientoreactivoService();
