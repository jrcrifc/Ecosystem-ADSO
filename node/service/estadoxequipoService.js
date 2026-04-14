// estadoxequipoService.js
import Estadoxequipo from '../models/estadoxequipoModel.js';
import EquiposModel from '../models/EquiposModel.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';

class EstadoxequipoService {
  async getAll() {
    return await Estadoxequipo.findAll({
      include: [
        {
          model: EquiposModel,
          as: 'equipo',
          attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa']
        },
        {
          model: estadoEquipoModel,
          as: 'estadoEquipo',
          attributes: ['estado']
        }
      ],
      order: [['id_estadoxequipo', 'DESC']]
    });
  }

  async getById(id) {
    const data = await Estadoxequipo.findByPk(id, {
      include: [
        { model: EquiposModel, as: 'equipo' },
        { model: estadoEquipoModel, as: 'estadoEquipo' }
      ]
    });
    if (!data) throw new Error("Registro no encontrado");
    return data;
  }

  // Trae el último estado de cada equipo
  async getUltimosEstados() {
    const equipos = await EquiposModel.findAll({
      include: [{
        model: Estadoxequipo,
        as: 'estadosEquipo',
        include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }],
        attributes: ['id_estadoxequipo', 'createdAt']
      }]
    });

    return equipos.map(e => {
      const eq = e.toJSON();
      const ordenados = (eq.estadosEquipo || []).sort(
        (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
      );
      const ultimoEstado = ordenados[0]?.estadoEquipo?.estado || 'disponible';
      return { ...eq, ultimoEstado };
    });
  }

  async create(data) {
    return await Estadoxequipo.create(data);
  }

  async cambiarEstado(id_equipo, id_estado_equipo) {
    const equipo = await EquiposModel.findByPk(id_equipo);
    if (!equipo) throw new Error('Equipo no encontrado');
    return await Estadoxequipo.create({ id_equipo, id_estado_equipo });
  }

  async update(id, data) {
    const result = await Estadoxequipo.update(data, { where: { id_estadoxequipo: id } });
    if (result[0] === 0) throw new Error("Registro no encontrado");
    return true;
  }

  async delete(id) {
    const deleted = await Estadoxequipo.destroy({ where: { id_estadoxequipo: id } });
    if (!deleted) throw new Error("Registro no encontrado");
    return true;
  }
}

export default new EstadoxequipoService();