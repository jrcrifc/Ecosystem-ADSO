import salidasModel from "../models/salidasModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";
import { Op } from "sequelize";

class salidasService {
  async getAll() {
    return await salidasModel.findAll({
      include: [{
        model: movimientoreactivoModel,
        as: 'movimiento',
        include: [{ model: reactivosModel, as: 'reactivo', attributes: ['nom_reactivo'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getById(id_salida) {
    const salida = await salidasModel.findByPk(id_salida);
    if (!salida) throw new Error('Salida no encontrada');
    return salida;
  }

  // ✅ Obtener lotes disponibles ordenados por FEFO
  async getLotesFefo(id_reactivo) {
    const hoy = new Date();

    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo }
    });

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
      loteMap[key].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
      loteMap[key].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
    });

    const lotes = Object.values(loteMap)
      .filter(l => {
        const disponible = parseFloat(l.cantidad_disponible.toFixed(3)) > 0;
        const noVencido = !l.fecha_vencimiento || new Date(l.fecha_vencimiento) > hoy;
        return disponible && noVencido;
      })
      .map(l => ({
        ...l,
        cantidad_disponible: parseFloat(l.cantidad_disponible.toFixed(3)),
        dias_para_vencer: l.fecha_vencimiento
          ? Math.floor((new Date(l.fecha_vencimiento) - hoy) / (1000 * 60 * 60 * 24))
          : null
      }))
      .sort((a, b) => {
        if (!a.fecha_vencimiento) return 1;
        if (!b.fecha_vencimiento) return -1;
        return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
      });

    return lotes;
  }

  async create(data) {
    const { id_reactivo, cantidad_salida, fecha_salida } = data;

    if (!cantidad_salida || cantidad_salida <= 0)
      throw new Error('La cantidad de salida debe ser mayor a 0');

    if (!id_reactivo)
      throw new Error('Debes seleccionar un reactivo');

    const lotes = await this.getLotesFefo(id_reactivo);

    if (lotes.length === 0)
      throw new Error('No hay lotes disponibles para este reactivo');

    const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
    if (parseFloat(cantidad_salida) > stockTotal)
      throw new Error(`Stock insuficiente. Disponible: ${stockTotal.toFixed(3)}`);

    let cantidadRestante = parseFloat(cantidad_salida);
    const salidasCreadas = [];

    for (const lote of lotes) {
      if (cantidadRestante <= 0) break;

      const cantidadDeEsteLote = Math.min(cantidadRestante, lote.cantidad_disponible);

      const salida = await salidasModel.create({
        id_movimiento_reactivo: lote.id_movimiento_reactivo,
        cantidad_salida: cantidadDeEsteLote,
        fecha_salida: fecha_salida || new Date(),
        estado: 1
      });

      const movimiento = await movimientoreactivoModel.findByPk(lote.id_movimiento_reactivo);
      const nuevaCantidadSalida = parseFloat(movimiento.cantidad_salida || 0) + cantidadDeEsteLote;

      await movimiento.update({
        cantidad_salida: nuevaCantidadSalida
      });

      salidasCreadas.push(salida);
      cantidadRestante -= cantidadDeEsteLote;
    }

    // Actualizar existencia del reactivo
    const lotesActualizados = await this.getLotesFefo(id_reactivo);
    const stockNuevo = lotesActualizados.reduce((acc, l) => acc + l.cantidad_disponible, 0);
    const reactivo = await reactivosModel.findByPk(id_reactivo);
    if (reactivo) {
      await reactivo.update({
        cantidad_inventario: stockNuevo,
        existencia_reactivo: stockNuevo > 0 ? 'SI' : 'NO'
      });
    }

    return salidasCreadas;
  }

  async update(id, data) {
    const [updated] = await salidasModel.update(data, { where: { id_salida: id } });
    if (updated === 0) throw new Error('No se pudo actualizar');
    return true;
  }

  async delete(id) {
    const salida = await salidasModel.findByPk(id);
    if (!salida) throw new Error('Salida no encontrada');

    // Devolver stock al movimiento
    const movimiento = await movimientoreactivoModel.findByPk(salida.id_movimiento_reactivo);
    if (movimiento && salida.cantidad_salida) {
      const nuevaCantidadSalida = Math.max(0, parseFloat(movimiento.cantidad_salida || 0) - parseFloat(salida.cantidad_salida));
      await movimiento.update({
        cantidad_salida: nuevaCantidadSalida
      });

      const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
      if (reactivo) {
        const lotes = await this.getLotesFefo(movimiento.id_reactivo);
        const stockTotal = lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0);
        await reactivo.update({ 
            cantidad_inventario: stockTotal,
            existencia_reactivo: stockTotal > 0 ? 'SI' : 'NO' 
        });
      }
    }

    const deleted = await salidasModel.destroy({ where: { id_salida: id } });
    if (!deleted) throw new Error('No se pudo eliminar');
    return true;
  }

  async createSmartSalida(data) {
    return await this.create(data);
  }

  async getLoteProximo(id_reactivo) {
    const lotes = await this.getLotesFefo(id_reactivo);
    if (lotes.length === 0) throw new Error('No hay lotes disponibles');
    return lotes[0];
  }
}

export default new salidasService();