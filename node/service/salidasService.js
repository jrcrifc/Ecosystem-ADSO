// ============================================================
// 📤 SERVICIO DE SALIDAS DE REACTIVOS (salidasService)
// Este servicio administra los registros de egreso/consumo de reactivos químicos.
// Contiene un método especializado para consultar la disponibilidad de lotes
// ordenados por FEFO (First Expired, First Out), de manera que se puedan despachar
// primero los productos que están más cerca de su fecha de caducidad.
// Maneja las validaciones de stock y la actualización del inventario en cascada.
// ============================================================

// Importa el modelo de salidas para acceder a la tabla de salidas de reactivos
import salidasModel from "../models/salidasModel.js";
// Importa el modelo de movimientos de reactivos para actualizar stock
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
// Importa el modelo de reactivos para actualizar existencia
import reactivosModel from "../models/reactivosModel.js";
// Importa el operador Op de Sequelize para consultas avanzadas
import { Op } from "sequelize";

// Define la clase de servicio para salidas de reactivos con lógica FEFO
class salidasService {
  
  // Obtiene todos los registros de salidas de reactivos del sistema
  async getAll() {
    // Consulta todas las salidas incluyendo movimiento, reactivo y presentación
    return await salidasModel.findAll({
      include: [{
        model: movimientoreactivoModel,
        as: 'movimiento',
        include: [{ model: reactivosModel, as: 'reactivo', attributes: ['nom_reactivo', 'presentacion_reactivo'] }]
      }],
      order: [['fecha_salida', 'DESC'], ['id_salida', 'DESC']]
    });
  }

  // Obtiene un registro de salida por su ID
  async getById(id_salida) {
    // Busca la salida por su clave primaria
    const salida = await salidasModel.findByPk(id_salida);
    if (!salida) throw new Error('Salida no encontrada');
    return salida;
  }

  // Obtiene los lotes disponibles de un reactivo ordenados bajo criterio FEFO
  async getLotesFefo(id_reactivo) {
    const hoy = new Date();
    // Obtiene todas las entradas y movimientos activos del reactivo
    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo, estado: 1 }
    });
    // Calcula la cantidad neta disponible de cada movimiento o lote único
    const loteMap = {};
    movimientos.forEach(m => {
      const key = m.id_movimiento_reactivo;
      if (!loteMap[key]) {
        loteMap[key] = {
          id_movimiento_reactivo: m.id_movimiento_reactivo,
          lote: m.lote || 'Sin lote',
          fecha_vencimiento: m.fecha_vencimiento,
          cantidad_disponible: 0
        };
      }
      // Suma las entradas y resta las salidas para este lote
      loteMap[key].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
      loteMap[key].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
    });
    // Filtra lotes con existencias mayores a cero y que no estén vencidos
    const lotes = Object.values(loteMap)
      .filter(l => {
        const disponible = parseFloat(l.cantidad_disponible.toFixed(3)) > 0;
        const noVencido = !l.fecha_vencimiento || new Date(l.fecha_vencimiento) > hoy;
        return disponible && noVencido;
      })
      .map(l => ({
        ...l,
        cantidad_disponible: parseFloat(l.cantidad_disponible.toFixed(3)),
        // Calcula los días de vida útil restantes antes del vencimiento
        dias_para_vencer: l.fecha_vencimiento
          ? Math.floor((new Date(l.fecha_vencimiento) - hoy) / (1000 * 60 * 60 * 24))
          : null
      }))
      // Ordena por fecha de vencimiento (el que vence primero va arriba)
      .sort((a, b) => {
        if (!a.fecha_vencimiento) return 1;
        if (!b.fecha_vencimiento) return -1;
        return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
      });
    // Retorna la lista de lotes ordenados por FEFO
    return lotes;
  }

  // Registra la salida física de un reactivo aplicando lógica FEFO
  async create(data) {
    // Extrae los datos del cuerpo de la solicitud
    const { id_reactivo, cantidad_salida, fecha_salida, observaciones } = data;
    // Valida que la cantidad de salida sea mayor a cero
    if (!cantidad_salida || cantidad_salida <= 0)
      throw new Error('La cantidad de salida debe ser mayor a 0');
    // Valida que se haya seleccionado un reactivo
    if (!id_reactivo)
      throw new Error('Debes seleccionar un reactivo');
    // Obtiene la cola de lotes FEFO disponibles para este reactivo
    const lotes = await this.getLotesFefo(id_reactivo);
    // Si no hay lotes disponibles, lanza un error
    if (lotes.length === 0)
      throw new Error('No hay lotes disponibles para este reactivo');
    // Verifica si el stock sumado de todos los lotes alcanza para la salida
    const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
    if (parseFloat(cantidad_salida) > stockTotal)
      throw new Error(`Stock insuficiente. Disponible: ${stockTotal.toFixed(3)}`);
    // Distribuye secuencialmente el egreso de reactivos entre los lotes FEFO
    let cantidadRestante = parseFloat(cantidad_salida);
    const salidasCreadas = [];
    const fechaSalidaDate = new Date(fecha_salida || new Date());
    // Recorre los lotes en orden FEFO
    for (const lote of lotes) {
      if (cantidadRestante <= 0) break;
      // VALIDACIÓN DE SEGURIDAD: Impide registrar salida si el lote ya expiró para la fecha de la transacción
      if (lote.fecha_vencimiento && new Date(lote.fecha_vencimiento) < fechaSalidaDate) {
        throw new Error(`El lote ${lote.lote} vence el ${new Date(lote.fecha_vencimiento).toLocaleDateString('es-CO')}. No se puede programar una salida para una fecha posterior.`);
      }
      // Calcula la cantidad a tomar de este lote (mínimo entre lo que queda y lo disponible)
      const cantidadDeEsteLote = Math.min(cantidadRestante, lote.cantidad_disponible);
      // Crea el registro individual en la tabla de salidas de reactivos
      const salida = await salidasModel.create({
        id_movimiento_reactivo: lote.id_movimiento_reactivo,
        cantidad_salida: cantidadDeEsteLote,
        fecha_salida: fecha_salida || new Date(),
        observaciones: observaciones || "",
        estado: 1
      });
      // Actualiza el acumulador de cantidad_salida en la tabla de movimientos
      const movimiento = await movimientoreactivoModel.findByPk(lote.id_movimiento_reactivo);
      const nuevaCantidadSalida = parseFloat(movimiento.cantidad_salida || 0) + cantidadDeEsteLote;
      const nuevaDisponible = parseFloat(movimiento.cantidad_inicial || 0) - nuevaCantidadSalida;
      // Guarda la actualización del movimiento
      await movimiento.update({
        cantidad_salida: nuevaCantidadSalida,
        estado_inventario: nuevaDisponible > 0 ? 'en stock' : 'agotado'
      });
      // Agrega la salida a la lista de creadas
      salidasCreadas.push(salida);
      // Reduce la cantidad restante por distribuir
      cantidadRestante -= cantidadDeEsteLote;
    }
    // Recalcula y actualiza la disponibilidad del reactivo principal
    const lotesActualizados = await this.getLotesFefo(id_reactivo);
    const stockNuevo = lotesActualizados.reduce((acc, l) => acc + l.cantidad_disponible, 0);
    const reactivo = await reactivosModel.findByPk(id_reactivo);
    if (reactivo) {
      await reactivo.update({
        existencia_reactivo: stockNuevo > 0 ? 'SI' : 'NO'
      });
    }
    // Retorna las salidas creadas
    return salidasCreadas;
  }

  // Modifica los datos de una salida ya creada
  async update(id, data) {
    // Busca la salida por su ID
    const salida = await salidasModel.findByPk(id);
    if (!salida) throw new Error('Salida no encontrada');
    // Convierte y valida la nueva cantidad
    const nuevaCantidad = parseFloat(data.cantidad_salida);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      throw new Error('La cantidad de salida debe ser mayor a 0');
    }
    // Si la salida está activa, procesa los cambios de stock
    if (salida.estado === 1) {
      // Calcula la diferencia entre la cantidad nueva y la cantidad anterior
      const diff = nuevaCantidad - parseFloat(salida.cantidad_salida || 0);
      // Si hay diferencia, actualiza el movimiento asociado
      if (diff !== 0) {
        const movimiento = await movimientoreactivoModel.findByPk(salida.id_movimiento_reactivo);
        if (!movimiento) throw new Error('Movimiento asociado no encontrado');
        // Si la cantidad a retirar aumenta, verifica que el lote tenga suficiente saldo
        if (diff > 0) {
          const disponible = parseFloat(movimiento.cantidad_inicial || 0) - parseFloat(movimiento.cantidad_salida || 0);
          if (diff > disponible) {
            throw new Error(`Stock insuficiente en el lote ${movimiento.lote || 'Sin lote'} para realizar este cambio. Disponible: ${disponible.toFixed(3)}`);
          }
        }
        // Aplica la diferencia al movimiento
        const nuevaCantidadSalida = parseFloat(movimiento.cantidad_salida || 0) + diff;
        const nuevaDisponible = parseFloat(movimiento.cantidad_inicial || 0) - nuevaCantidadSalida;
        await movimiento.update({
          cantidad_salida: nuevaCantidadSalida,
          estado_inventario: nuevaDisponible > 0 ? 'en stock' : 'agotado'
        });
        // Recalcula disponibilidad del reactivo
        const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
        if (reactivo) {
          const lotes = await this.getLotesFefo(movimiento.id_reactivo);
          const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
          await reactivo.update({ existencia_reactivo: stockTotal > 0 ? 'SI' : 'NO' });
        }
      }
    }
    // Actualiza los datos de la salida
    await salida.update({
      cantidad_salida: nuevaCantidad,
      fecha_salida: data.fecha_salida || salida.fecha_salida,
      observaciones: data.observaciones !== undefined ? data.observaciones : salida.observaciones
    });
    // Retorna true indicando que la actualización fue exitosa
    return true;
  }

  // Realiza la inactivación lógica de una salida y devuelve las cantidades al lote
  async delete(id) {
    // Busca la salida por su ID
    const salida = await salidasModel.findByPk(id);
    if (!salida) throw new Error('Salida no encontrada');
    // Si ya estaba inactiva, no hace nada
    if (salida.estado === 0) return true;
    // Devuelve la cantidad retirada al movimiento original para restaurar stock
    const movimiento = await movimientoreactivoModel.findByPk(salida.id_movimiento_reactivo);
    if (movimiento && salida.cantidad_salida) {
      // Resta la cantidad de salida devuelta al acumulador
      const nuevaCantidadSalida = Math.max(0, parseFloat(movimiento.cantidad_salida || 0) - parseFloat(salida.cantidad_salida));
      const nuevaDisponible = parseFloat(movimiento.cantidad_inicial || 0) - nuevaCantidadSalida;
      // Guarda la actualización del movimiento
      await movimiento.update({
        cantidad_salida: nuevaCantidadSalida,
        estado_inventario: nuevaDisponible > 0 ? 'en stock' : 'agotado'
      });
      // Recalcula disponibilidad del reactivo
      const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
      if (reactivo) {
        const lotes = await this.getLotesFefo(movimiento.id_reactivo);
        const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
        await reactivo.update({ existencia_reactivo: stockTotal > 0 ? 'SI' : 'NO' });
      }
    }
    // Marca la salida como inactiva cambiando su estado a 0
    const deleted = await salidasModel.update({ estado: 0 }, { where: { id_salida: id } });
    if (deleted[0] === 0) throw new Error('No se pudo inactivar');
    // Retorna true indicando que la inactivación fue exitosa
    return true;
  }

  // Reactiva una salida previamente inactivada y descuenta la cantidad del lote
  async activar(id) {
    // Busca la salida por su ID
    const salida = await salidasModel.findByPk(id);
    if (!salida) throw new Error('Salida no encontrada');
    // Si ya estaba activa, no hace nada
    if (salida.estado === 1) return true;
    // Busca el movimiento asociado
    const movimiento = await movimientoreactivoModel.findByPk(salida.id_movimiento_reactivo);
    if (!movimiento) throw new Error('Movimiento asociado no encontrado');
    // Calcula el stock disponible en el lote
    const disponible = parseFloat(movimiento.cantidad_inicial || 0) - parseFloat(movimiento.cantidad_salida || 0);
    // Valida que haya suficiente stock para reactivar la salida
    if (parseFloat(salida.cantidad_salida) > disponible) {
      throw new Error(`Stock insuficiente en el lote ${movimiento.lote || 'Sin lote'} para reactivar esta salida. Disponible: ${disponible.toFixed(3)}`);
    }
    // Resta de nuevo del stock del movimiento
    const nuevaCantidadSalida = parseFloat(movimiento.cantidad_salida || 0) + parseFloat(salida.cantidad_salida);
    const nuevaDisponible = parseFloat(movimiento.cantidad_inicial || 0) - nuevaCantidadSalida;
    await movimiento.update({
      cantidad_salida: nuevaCantidadSalida,
      estado_inventario: nuevaDisponible > 0 ? 'en stock' : 'agotado'
    });
    // Recalcula disponibilidad del reactivo
    const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
    if (reactivo) {
      const lotes = await this.getLotesFefo(movimiento.id_reactivo);
      const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
      await reactivo.update({ existencia_reactivo: stockTotal > 0 ? 'SI' : 'NO' });
    }
    // Reactiva la salida cambiando su estado a 1
    await salida.update({ estado: 1 });
    // Retorna true indicando que la reactivación fue exitosa
    return true;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new salidasService();
