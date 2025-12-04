import estadoEquipoModel from "../models/estadoEquipoModel.js";

class EstadoEquipoService {
  async getAll() {
    return await estadoEquipoModel.findAll();
  }

  async getById(id) {
    const record = await estadoEquipoModel.findByPk(id);
    if (!record) throw new Error("Registro no encontrado");
    return record;
  }

  async create(data) {
    return await estadoEquipoModel.create(data);
  }

  async update(id, data) {
    const record = await estadoEquipoModel.findByPk(id);
    if (!record) throw new Error("Registro no encontrado");
    return await record.update(data);
  }

  async delete(id) {
    const record = await estadoEquipoModel.findByPk(id);
    if (!record) throw new Error("Registro no encontrado");
    return await record.destroy();
  }
}

export default new EstadoEquipoService();
