import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";
import proveedoresModel from "../models/proveedoresModel.js";

class movimientoreactivoService {
  async getAll() {
    const movimientos = await movimientoreactivoModel.findAll({
      include: [
        { model: reactivosModel, as: "reactivo", attributes: ["nom_reactivo", "presentacion_reactivo", "existencia_reactivo"] },
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

    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo: data.id_reactivo }
    });
    const stockActual = movimientos.reduce((acc, m) => {
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);

    // ✅ Si es salida, validar que no se pase del stock disponible
    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActual) {
      throw new Error(`No hay suficiente stock. Disponible: ${stockActual.toFixed(3)}`);
    }

    const nuevoStock = stockActual + data.cantidad_inicial - data.cantidad_salida;

    // ✅ Si llega exactamente a 0 → agotado
    data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";

    const reactivo = await reactivosModel.findByPk(data.id_reactivo);
    if (reactivo) {
      await reactivo.update({ existencia_reactivo: nuevoStock > 0 ? "SI" : "NO" });
    }

    return await movimientoreactivoModel.create(data);
  }

  async update(id, data) {
    data.cantidad_inicial = parseFloat(data.cantidad_inicial || 0);
    data.cantidad_salida = parseFloat(data.cantidad_salida || 0);

    if (data.cantidad_inicial > 0 && data.cantidad_salida > 0) {
      throw new Error("No puedes registrar entrada y salida al mismo tiempo");
    }

    const movimientoActual = await movimientoreactivoModel.findByPk(id);
    if (!movimientoActual) throw new Error("Movimiento no encontrado");

    const todosMovimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo: movimientoActual.id_reactivo }
    });
    const stockActual = todosMovimientos.reduce((acc, m) => {
      if (m.id_movimiento_reactivo === id) return acc;
      return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
    }, 0);

    // ✅ Validar también en update
    if (data.cantidad_salida > 0 && data.cantidad_salida > stockActual) {
      throw new Error(`No hay suficiente stock. Disponible: ${stockActual.toFixed(3)}`);
    }

    const nuevoStock = stockActual + data.cantidad_inicial - data.cantidad_salida;
    data.estado_inventario = nuevoStock > 0 ? "en stock" : "agotado";

    const reactivo = await reactivosModel.findByPk(movimientoActual.id_reactivo);
    if (reactivo) {
      await reactivo.update({ existencia_reactivo: nuevoStock > 0 ? "SI" : "NO" });
    }

    const [updated] = await movimientoreactivoModel.update(data, {
      where: { id_movimiento_reactivo: id }
    });
    if (updated === 0) throw new Error("No se pudo actualizar");
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