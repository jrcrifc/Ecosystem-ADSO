import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import reactivosModel from "../models/reactivosModel.js";
import proveedoresModel from "../models/proveedoresModel.js";

class movimientoreactivoService {
  async getAll() {
    return await movimientoreactivoModel.findAll({
      include: [
        {
          model: reactivosModel,
          as: "reactivo",
          attributes: ["nom_reactivo"],
        },
        {
          model: proveedoresModel,
          as: "proveedor",
          attributes: ["nom_proveedor", "apel_proveedor"],
        },
      ],
    });
  }

  async getById(id_movimiento_reactivo) {
    const movimiento = await movimientoreactivoModel.findByPk(
      id_movimiento_reactivo,
      {
        include: [
          {
            model: reactivosModel,
            as: "reactivo",
            attributes: ["nom_reactivo"],
          },
          {
            model: proveedoresModel,
            as: "proveedor",
            attributes: ["nom_proveedor", "apel_proveedor"],
          },
        ],
      }
    );
    if (!movimiento) throw new Error("Movimiento del reactivo no encontrado");
    return movimiento;
  }

  async create(data) {
    const movimiento = await movimientoreactivoModel.create(data);

    if (data.id_reactivo && data.cantidad_inicial) {
      const reactivo = await reactivosModel.findByPk(data.id_reactivo);
      if (!reactivo) throw new Error("Reactivo no encontrado");

      const nuevaCantidad =
        parseFloat(reactivo.cantidad_inventario || 0) +
        parseFloat(data.cantidad_inicial);

      await reactivo.update({
        cantidad_inventario: nuevaCantidad,
        existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO",
      });

      await movimiento.update({
        estado_inventario: nuevaCantidad > 0 ? "en stock" : "agotado",
      });
    }

    return movimiento;
  }

  async update(id, data) {
    if (data.cantidad_inicial !== undefined) {
      const movimientoAnterior = await movimientoreactivoModel.findByPk(id);
      if (!movimientoAnterior) throw new Error("Movimiento no encontrado");

      const reactivo = await reactivosModel.findByPk(
        movimientoAnterior.id_reactivo
      );
      if (reactivo) {
        const diff =
          parseFloat(data.cantidad_inicial) -
          parseFloat(movimientoAnterior.cantidad_inicial || 0);
        const nuevaCantidad = Math.max(
          0,
          parseFloat(reactivo.cantidad_inventario || 0) + diff
        );

        await reactivo.update({
          cantidad_inventario: nuevaCantidad,
          existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO",
        });
      }
    }

    const [updated] = await movimientoreactivoModel.update(data, {
      where: { id_movimiento_reactivo: id },
    });
    if (updated === 0) throw new Error("No se pudo actualizar");
    return true;
  }

  async delete(id) {
    const movimiento = await movimientoreactivoModel.findByPk(id);
    if (!movimiento) throw new Error("Movimiento no encontrado");

    const reactivo = await reactivosModel.findByPk(movimiento.id_reactivo);
    if (reactivo && movimiento.cantidad_inicial) {
      const nuevaCantidad = Math.max(
        0,
        parseFloat(reactivo.cantidad_inventario || 0) -
          parseFloat(movimiento.cantidad_inicial)
      );
      await reactivo.update({
        cantidad_inventario: nuevaCantidad,
        existencia_reactivo: nuevaCantidad > 0 ? "SI" : "NO",
      });
    }

    const deleted = await movimientoreactivoModel.destroy({
      where: { id_movimiento_reactivo: id },
    });
    if (!deleted) throw new Error("No se pudo eliminar");
    return true;
  }
}

export default new movimientoreactivoService();