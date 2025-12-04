import EstadoXEquipo from "../models/estadoxequipoModel.js";

class EstadoXEquipoService {
  async getAll() {
    return await EstadoXEquipo.findAll({ order: [["id_estadoxequipo", "ASC"]] });
  }

  async getById(id) {
    const rec = await EstadoXEquipo.findByPk(id);
    if (!rec) throw new Error("Registro no encontrado");
    return rec;
  }

  async create(payload) {
    return await EstadoXEquipo.create(payload);
  }

  async update(id, payload) {
    const rec = await this.getById(id);
    return await rec.update(payload);
  }

  async delete(id) {
    const rec = await this.getById(id);
    await rec.destroy();
    return { message: "Eliminado" };
  }
}

export default new EstadoXEquipoService();
