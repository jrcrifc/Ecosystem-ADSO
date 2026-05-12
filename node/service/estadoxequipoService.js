// estadoxequipoService.js
import Estadoxequipo from '../models/estadoxequipoModel.js';
import EquiposModel from '../models/EquiposModel.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';
import SolicitudModel from '../models/solicitudModel.js';
import EstadoxsolicitudModel from '../models/estadoxsolicitudModel.js';
import EstadoSolicitudModel from '../models/Estado_solicitudModel.js';

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

  // Trae el último estado de cada equipo y verifica si está ocupado
  async getUltimosEstados() {
    const equipos = await EquiposModel.findAll({
      include: [
        {
          model: Estadoxequipo,
          as: 'estadosEquipo',
          include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }],
          attributes: ['id_estadoxequipo', 'createdAt']
        },
        {
          model: SolicitudModel,
          as: 'solicitudes',
          include: [{
            model: EstadoxsolicitudModel,
            as: 'estados',
            include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
          }],
          through: { attributes: [] }
        }
      ]
    });

    return equipos.map(e => {
      const eq = e.toJSON();
      const ordenados = (eq.estadosEquipo || []).sort(
        (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
      );
      let ultimoEstado = ordenados[0]?.estadoEquipo?.estado || 'disponible';
      
      // Verificamos si hay solicitudes activas para cambiar el estado visual
      let estaOcupado = false;
      if (ultimoEstado === 'disponible') {
        const ahora = new Date();
        
        // Buscamos si existe ALGUNA solicitud que actualmente bloquee al equipo
        const solicitudActiva = (eq.solicitudes || []).find(s => {
          const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
          const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
          
          // Solo bloqueamos si el ÚLTIMO estado es aceptado o prestado
          const tieneEstadoBloqueante = ['aceptado', 'prestado'].includes(ultimoEstadoSol);
          // Y si el tiempo no ha expirado
          const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
          
          return tieneEstadoBloqueante && !tiempoExpirado;
        });

        if (solicitudActiva) {
          estaOcupado = true;
          // Obtenemos el estado de esa solicitud específica para el label
          const ultimoEstadoSol = (solicitudActiva.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud)[0]?.estadoSolicitud?.estado;
          ultimoEstado = ultimoEstadoSol === 'aceptado' ? 'solicitado' : 'prestado';
        }
      }

      return { ...eq, ultimoEstado, estaOcupado };
    });
  }

  async create(data) {
    return await Estadoxequipo.create(data);
  }

  async cambiarEstado(id_equipo, id_estado_equipo) {
    const equipo = await EquiposModel.findByPk(id_equipo, {
      include: [
        {
          model: SolicitudModel,
          as: 'solicitudes',
          include: [{
            model: EstadoxsolicitudModel,
            as: 'estados',
            include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
          }],
          through: { attributes: [] }
        },
        {
          model: Estadoxequipo,
          as: 'estadosEquipo',
          include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }]
        }
      ]
    });

    if (!equipo) throw new Error('Equipo no encontrado');

    // Solo bloqueamos si el estado físico actual es 'disponible'
    const ultimoEstadoEq = equipo.estadosEquipo?.sort((a, b) => b.id_estadoxequipo - a.id_estadoxequipo)[0]?.estadoEquipo?.estado || 'disponible';

    let estaOcupado = false;
    if (ultimoEstadoEq === 'disponible') {
      const ahora = new Date();
      estaOcupado = (equipo.solicitudes || []).some(s => {
        const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
        const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
        const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
        
        return ['aceptado', 'prestado'].includes(ultimoEstadoSol) && !tiempoExpirado;
      });
    }

    if (estaOcupado) {
      throw new Error('No se puede cambiar el estado de un equipo que está prestado o solicitado');
    }

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