import devolucionModel from "../models/devolucionModel.js";

class devolucionService {
  async getAll() {
    return await devolucionModel.findAll();
  }

  async getById(id_devolucion) {
    const devolucion = await devolucionModel.findByPk(id_devolucion);
    if (!devolucion) throw new Error("Devolución no encontrada");
    return devolucion;
  }

  async create(data) {
    return await devolucionModel.create(data);
  }

  async update(id, data) {
    const result = await devolucionModel.update(data, {
      where: { id_devolucion: id },
    });

    const updated = result[0];
    if (updated === 0) throw new Error("No se pudo actualizar la devolución");

    return true;
  }

  async delete(id) {
    const deleted = await devolucionModel.destroy({
      where: { id_devolucion: id },
    });

    if (!deleted) throw new Error("No se pudo eliminar la devolución");

    return true;
  }
}

export default new devolucionService();