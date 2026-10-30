// ============================================================
// 📊 SERVICIO DE HISTORIAL DE ESTADOS DE EQUIPO (estadoxequipoService)
// Este servicio administra el registro histórico de cambios de
// estado físico de los equipos. Cada vez que un equipo cambia de
// estado (disponible, no disponible, mantenimiento) se guarda un
// registro con la fecha del cambio. También determina en tiempo
// real si un equipo está ocupado por una solicitud activa.
// ============================================================

// Importa el modelo de historial de estados de equipo
import Estadoxequipo from '../models/estadoxequipoModel.js';
// Importa el modelo de equipos para consultar datos del equipo
import EquiposModel from '../models/EquiposModel.js';
// Importa el modelo de catálogo de estados de equipo
import estadoEquipoModel from '../models/Estado_equipoModel.js';
// Importa el modelo de solicitudes para verificar ocupación
import SolicitudModel from '../models/solicitudModel.js';
// Importa el modelo de historial de estados de solicitud
import EstadoxsolicitudModel from '../models/estadoxsolicitudModel.js';
// Importa el modelo de catálogo de estados de solicitud
import EstadoSolicitudModel from '../models/Estado_solicitudModel.js';

// Define la clase de servicio para el historial de estados de equipo
class EstadoxequipoService {
  // Obtiene todo el historial de cambios de estado de equipos
  async getAll() {
    // Consulta todos los registros incluyendo datos del equipo y su estado
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

  // Obtiene un registro del historial por su ID
  async getById(id) {
    // Busca el registro por su clave primaria incluyendo equipo y estado
    const data = await Estadoxequipo.findByPk(id, {
      include: [
        { model: EquiposModel, as: 'equipo' },
        { model: estadoEquipoModel, as: 'estadoEquipo' }
      ]
    });
    // Si no existe, lanza un error
    if (!data) throw new Error("Registro no encontrado");
    // Retorna el registro encontrado
    return data;
  }

  // Obtiene el último estado registrado de cada equipo y determina si está ocupado
  async getUltimosEstados() {
    // Consulta todos los equipos con su historial de estados y solicitudes activas
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
          where: { estado: 1 },
          required: false,
          include: [{
            model: EstadoxsolicitudModel,
            as: 'estados',
            include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
          }],
          through: { attributes: [] }
        }
      ]
    });
    // Procesa cada equipo para determinar su último estado y si está ocupado
    return equipos.map(e => {
      const eq = e.toJSON();
      // Ordena los estados del equipo del más reciente al más antiguo
      const ordenados = (eq.estadosEquipo || []).sort(
        (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
      );
      // Obtiene el último estado físico base o asume disponible por defecto
      let ultimoEstado = ordenados[0]?.estadoEquipo?.estado || 'disponible';
      // Inicializa banderas de ocupado y fecha disponible
      let estaOcupado = false;
      let fecha_disponible = null;

      const ahora = new Date();
      // Extrae todas las reservas activas (generado, aceptado o prestado) que no hayan expirado
      const reservasActivas = (eq.solicitudes || [])
        .filter(s => {
          const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
          const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
          const tieneEstadoBloqueante = ['generado', 'aceptado', 'prestado'].includes(ultimoEstadoSol);
          const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
          return tieneEstadoBloqueante && !tiempoExpirado;
        })
        .map(s => {
          const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
          return {
            id_solicitud: s.id_solicitud,
            fecha_inicio: s.fecha_inicio,
            fecha_fin: s.fecha_fin,
            estado: estadosSol[0]?.estadoSolicitud?.estado
          };
        });

      // Solo verifica solicitudes activas si el equipo está disponible físicamente
      if (ultimoEstado === 'disponible') {
        // Busca si existe alguna solicitud que ACTUALMENTE (en este momento) esté en curso
        const solicitudEnCurso = reservasActivas.find(s => {
          const inicio = new Date(s.fecha_inicio);
          const fin = new Date(s.fecha_fin);
          return ahora >= inicio && ahora <= fin;
        });

        if (solicitudEnCurso) {
          estaOcupado = true;
          ultimoEstado = ['generado', 'aceptado'].includes(solicitudEnCurso.estado) ? 'solicitado' : 'prestado';
          fecha_disponible = solicitudEnCurso.fecha_fin ? new Date(solicitudEnCurso.fecha_fin).toISOString().slice(0, 10) : null;
        } else if (reservasActivas.length > 0) {
          // Si tiene reservas futuras, buscamos la más cercana
          const reservasFuturas = reservasActivas
            .filter(s => new Date(s.fecha_inicio) > ahora)
            .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));

          if (reservasFuturas.length > 0) {
            fecha_disponible = new Date(reservasFuturas[0].fecha_fin).toISOString().slice(0, 10);
          }
        }
      }
      // Retorna el equipo con los campos calculados y las reservas activas
      return { ...eq, ultimoEstado, estaOcupado, fecha_disponible, reservas_activas: reservasActivas };
    });
  }

  // Crea un nuevo registro en el historial de estados de equipo
  async create(data) {
    return await Estadoxequipo.create(data);
  }

  // Cambia el estado físico de un equipo validando que no esté ocupado
  async cambiarEstado(id_equipo, id_estado_equipo) {
    // Busca el equipo incluyendo solicitudes activas e historial de estados
    const equipo = await EquiposModel.findByPk(id_equipo, {
      include: [
        {
          model: SolicitudModel,
          as: 'solicitudes',
          where: { estado: 1 },
          required: false,
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
    // Si no existe el equipo, lanza un error
    if (!equipo) throw new Error('Equipo no encontrado');
    // Obtiene el último estado físico del equipo o asume disponible
    const ultimoEstadoEq = equipo.estadosEquipo?.sort((a, b) => b.id_estadoxequipo - a.id_estadoxequipo)[0]?.estadoEquipo?.estado || 'disponible';
    // Inicializa la bandera de ocupado como falsa
    let estaOcupado = false;
    // Solo verifica ocupación si el equipo está disponible físicamente
    if (ultimoEstadoEq === 'disponible') {
      const ahora = new Date();
      // Verifica si alguna solicitud activa tiene estado bloqueante
      estaOcupado = (equipo.solicitudes || []).some(s => {
        // Ordena los estados de la solicitud del más reciente al más antiguo
        const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
        // Obtiene el último estado de la solicitud
        const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
        // Verifica si el tiempo de la solicitud ha expirado
        const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
        // Retorna true si el estado es bloqueante y no ha expirado
        return ['generado', 'aceptado', 'prestado'].includes(ultimoEstadoSol) && !tiempoExpirado;
      });
    }
    // Si el equipo está ocupado por una solicitud, lanza un error
    if (estaOcupado) {
      throw new Error('No se puede cambiar el estado de un equipo que está prestado o solicitado');
    }
    // Crea el nuevo registro de estado en el historial
    return await Estadoxequipo.create({ id_equipo, id_estado_equipo });
  }

  // Actualiza los datos de un registro del historial
  async update(id, data) {
    // Ejecuta la actualización filtrando por ID
    const result = await Estadoxequipo.update(data, { where: { id_estadoxequipo: id } });
    // Si no se actualizó ningún registro, lanza un error
    if (result[0] === 0) throw new Error("Registro no encontrado");
    // Retorna true indicando que la actualización fue exitosa
    return true;
  }

  // Elimina físicamente un registro del historial
  async delete(id) {
    // Ejecuta la eliminación filtrando por ID
    const deleted = await Estadoxequipo.destroy({ where: { id_estadoxequipo: id } });
    // Si no se eliminó ningún registro, lanza un error
    if (!deleted) throw new Error("Registro no encontrado");
    // Retorna true indicando que la eliminación fue exitosa
    return true;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new EstadoxequipoService();
