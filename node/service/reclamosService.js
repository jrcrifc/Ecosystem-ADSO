import reclamosModel from "../models/reclamosModel.js";

class ReclamosService {
  async getAll() {
    return await reclamosModel.findAll();
  }

  async getById(id_reclamos) {
    const reclamo = await reclamosModel.findByPk(id_reclamos);
    if (!reclamo) throw new Error("Reclamo no encontrado");
    return reclamo;
  }

  async create(data) {
    return await reclamosModel.create(data);
  }

  async update(id, data) {
    const result = await reclamosModel.update(data, {
      where: { id_reclamos: id },
    });

    const updated = result[0];
    if (updated === 0) throw new Error("No se pudo actualizar el reclamo");

    return true;
  }

  async delete(id) {
    const deleted = await reclamosModel.destroy({
      where: { id_reclamos: id },
    });

    if (!deleted) throw new Error("No se pudo eliminar el reclamo");

    return true;
  }
}

export default new ReclamosService();