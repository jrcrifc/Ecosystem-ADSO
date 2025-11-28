import equipoModel from "../models/equipoModel.js";

class EquipoService {
  async getAll() {
    return await equipoModel.findAll();
  }

  async getById(id_equipo) {
    const equipo = await equipoModel.findByPk(id_equipo);
    if (!equipo) throw new Error("Equipo no encontrado");
    return equipo;
  }

  async create(data) {
    return await equipoModel.create(data);
  }

  async update(id, data) {
    const [updated] = await equipoModel.update(data, {
      where: { id_equipo: id },
    });
    if (!updated) throw new Error("No se pudo actualizar el equipo");
    return true;
  }

  async delete(id) {
    const deleted = await equipoModel.destroy({
      where: { id_equipo: id },
    });
    if (!deleted) throw new Error("No se pudo eliminar el equipo");
    return true;
  }
}

export default new EquipoService();
