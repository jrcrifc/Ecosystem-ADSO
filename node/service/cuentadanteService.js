import cuentadante from '../models/cuentadanteModel.js';

class cuentadanteService {

  async getAllcuentadante() {
    return await cuentadante.findAll();
  }

  async getcuentadante(id) {
    const data = await cuentadante.findByPk(id);
    if (!data) throw new Error("Registro no encontrado");
    return data;
  }

  async createcuentadante(data) {
    return await cuentadante.create(data);
  }

  async updatecuentadante(id, data) {
    const result = await cuentadante.update(
      data,
      { where: { id_cuentadante: id } }
    );
    if (result[0] === 0) throw new Error("Registro no encontrado o sin cambios");
    return true;
  }

  async deletecuentadante(id) {
    const deleted = await cuentadante.destroy(
      { where: { id_cuentadante: id } }
    );
    if (!deleted) throw new Error("Registro no encontrado");
    return true;
  }
}

export default new cuentadanteService();
