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

  async toggleEstadoCuentadante(id) {
    const registro = await cuentadante.findByPk(id);
    if (!registro) throw new Error("Registro no encontrado");
    const nuevoEstado = registro.estado === 'activo' ? 'inactivo' : 'activo';
    await cuentadante.update(
      { estado: nuevoEstado },
      { where: { id_cuentadante: id } }
    );
    return nuevoEstado;
  }
}

export default new cuentadanteService();
