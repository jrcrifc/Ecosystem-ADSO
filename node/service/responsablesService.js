import responsableModel from "../models/responsableModel.js";

class ResponsableService {
  async getAll() {
    return await responsableModel.findAll();
  }

  async getById(id_responsable) {
    const responsable = await responsableModel.findByPk(id_responsable);
    if (!responsable) throw new Error("Responsable no encontrado");
    return responsable;
  }

  async create(data) {
    return await responsableModel.create(data);
  }

  async update(id, data) {
    const [updated] = await responsableModel.update(data, {
      where: { id_responsable: id },
    });
    if (!updated) throw new Error("No se pudo actualizar el responsable");
    return true;
  }

  async delete(id) {
    const deleted = await responsableModel.destroy({
      where: { id_responsable: id },
    });
    if (!deleted) throw new Error("No se pudo eliminar el responsable");
    return true;
  }
}

export default new ResponsableService();
