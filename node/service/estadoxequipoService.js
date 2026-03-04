import Estadoxequipo from '../models/estadoxequipoModel.js';

class EstadoxequipoService {

  async getAll() {
    return await Estadoxequipo.findAll();
  }

  async getById(id) {
    const data = await Estadoxequipo.findByPk(id);
    if (!data) throw new Error("Registro no encontrado");
    return data;
  }

  async create(data) {
    return await Estadoxequipo.create(data);
  }

  async update(id, data) {
    const result = await Estadoxequipo.update(
      data,
      { where: { id_estadoxequipo: id } }
    );
    if (result[0] === 0) throw new Error("Registro no encontrado o sin cambios");
    return true;
  }

  async delete(id) {
    const deleted = await Estadoxequipo.destroy(
      { where: { id_estadoxequipo: id } }
    );
    if (!deleted) throw new Error("Registro no encontrado");
    return true;
  }
}

export default new EstadoxequipoService();
