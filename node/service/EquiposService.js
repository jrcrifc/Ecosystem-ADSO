import EquiposModel from '../models/EquiposModel.js';
import cuentadanteModel from '../models/cuentadanteModel.js';
import Estadoxequipo from '../models/estadoxequipoModel.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';
import SolicitudModel from '../models/solicitudModel.js';
import EstadoxsolicitudModel from '../models/estadoxsolicitudModel.js';
import EstadoSolicitudModel from '../models/Estado_solicitudModel.js';

class EquiposService {
    async getAll() {
        const equipos = await EquiposModel.findAll({
            include: [
                {
                    model: cuentadanteModel,
                    as: 'cuentadante',
                    attributes: ['nom_cuentadante', 'apell_cuentadante']
                },
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
            let estadoReal = ordenados[0]?.estadoEquipo?.estado || 'disponible';
            
            let estaOcupado = false;
            if (estadoReal === 'disponible') {
                const ahora = new Date();
                
                // Buscamos si existe ALGUNA solicitud que actualmente bloquee al equipo
                const solicitudActiva = (eq.solicitudes || []).find(s => {
                    const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
                    const ultimoEstado = estadosSol[0]?.estadoSolicitud?.estado;
                    
                    // Solo bloqueamos si el ÚLTIMO estado es aceptado o prestado
                    const tieneEstadoBloqueante = ['aceptado', 'prestado'].includes(ultimoEstado);
                    // Y si el tiempo no ha expirado
                    const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
                    
                    return tieneEstadoBloqueante && !tiempoExpirado;
                });

                if (solicitudActiva) {
                    estaOcupado = true;
                    // Obtenemos el estado de esa solicitud específica para el label
                    const ultimoEstadoSol = (solicitudActiva.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud)[0]?.estadoSolicitud?.estado;
                    estadoReal = ultimoEstadoSol === 'aceptado' ? 'solicitado' : 'prestado';
                }
            }

            return { ...eq, estadoReal, estaOcupado };
        });
    }

    async getById(id_equipo) {
        const equipo = await EquiposModel.findByPk(id_equipo)
        if (!equipo) throw new Error('Equipo no encontrado')
        return equipo
    }

    async create(Data) {
        return await EquiposModel.create(Data)
    }

    async update(id_equipo, Data) {
        const result = await EquiposModel.update(Data, { where: { id_equipo } })
        const updated = result[0]
        if (updated === 0) throw new Error('Equipo no encontrado')
        return true
    }

    async delete(id_equipo) {
        const deleted = await EquiposModel.destroy({ where: { id_equipo } })
        if (!deleted) throw new Error('Equipo no encontrado')
        return true
    }
}

export default new EquiposService();
