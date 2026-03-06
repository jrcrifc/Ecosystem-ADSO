import Estadoxsolicitud from '../models/estadoxsolicitudModel.js';

class EstadoxsolicitudService {

  async getAll() {
    return await Estadoxsolicitud.findAll();
  }

  async getById(id) {
    const estado = await Estadoxsolicitud.findByPk(id);
    if (!estado) throw new Error("Registro no encontrado");
    return estado;
  }

  async create(data) {
    return await Estadoxsolicitud.create(data);
  }

  async update(id, data) {
    const result = await Estadoxsolicitud.update(
      data,
      { where: { id_estadoxsolicitud: id } }
    );
    if (result[0] === 0) throw new Error("Registro no encontrado o sin cambios");
    return true;
  }

  async delete(id) {
    const deleted = await Estadoxsolicitud.destroy(
      { where: { id_estadoxsolicitud: id } }
    );
    if (!deleted) throw new Error("Registro no encontrado");
    return true;
  }
}

export default new EstadoxsolicitudService();
