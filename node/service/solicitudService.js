import solicitudModel from "../models/solicitudModel.js";
import Estadoxsolicitud from "../models/estadoxsolicitudModel.js";
import userModel from "../models/userModel.js";
import estadoSolicitudModel from "../models/Estado_solicitudModel.js";
import { Sequelize } from "sequelize";
import equipoModel from "../models/EquiposModel.js";
import solicitudxequipoModel from "../models/solicitudxequipoModel.js";

class solicitudService {
    async getAll() {
        const solicitudes = await solicitudModel.findAll({
            include: [
                {
                    model: userModel,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombres_apellidos', 'rol']
                },
                {
                    model: Estadoxsolicitud,
                    as: 'estados',
                    include: [{
                        model: estadoSolicitudModel,
                        as: 'estadoSolicitud',
                        attributes: ['estado']
                    }],
                    attributes: ['id_estadoxsolicitud', 'createdat']
                },
                {
                    model: equipoModel,
                    as: 'equipos',
                    attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa']
                }
            ],
            order: [
                [{ model: Estadoxsolicitud, as: 'estados' }, 'id_estadoxsolicitud', 'DESC']
            ]
        });

        return solicitudes.map(s => {
            const sol = s.toJSON();
            const estadosOrdenados = (sol.estados || []).sort(
                (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
            );
            const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";
            return { ...sol, ultimoEstado };
        });
    }

    async getById(id_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud, {
            include: [{
                model: equipoModel,
                as: 'equipos',
                attributes: ['id_equipo', 'nom_equipo']
            }]
        });
        if (!solicitud) throw new Error('Solicitud no encontrada');
        return solicitud;
    }

    async create(data, userId) {
        // ✅ Obtener información del usuario para validar políticas según su ROL
        const user = await userModel.findByPk(userId);
        if (!user) throw new Error('Usuario no encontrado');

        const userRol = user.rol.toLowerCase();
        const start = new Date(data.fecha_inicio);
        const end = data.fecha_fin ? new Date(data.fecha_fin) : null;

        // 1. Validación Aprendiz: Mismo día
        if (userRol === 'aprendiz') {
            if (!end || start.toISOString().slice(0, 10) !== end.toISOString().slice(0, 10)) {
                throw new Error('Política: Los aprendices deben devolver el equipo el mismo día.');
            }
        }

        // 2. Validación Instructor: 3 a 5 días hábiles
        if (userRol === 'instructor' && end) {
            const calcularDiasHabiles = (inicio, fin) => {
                let count = 0;
                let current = new Date(inicio);
                const limit = new Date(fin);
                while (current <= limit) {
                    const day = current.getDay();
                    if (day !== 0 && day !== 6) count++;
                    current.setDate(current.getDate() + 1);
                }
                return count;
            };

            const dias = calcularDiasHabiles(start, end);
            if (dias < 3 || dias > 5) {
                throw new Error('Política: Los instructores deben solicitar equipos por un plazo de 3 a 5 días hábiles.');
            }
        }

        const solicitud = await solicitudModel.create({
            ...data,
            id_usuario: userId
        });
        await Estadoxsolicitud.create({
            id_solicitud: solicitud.id_solicitud,
            id_estado_solicitud: 1
        });

        if (data.equipos_ids && Array.isArray(data.equipos_ids)) {
            for (const id_equipo of data.equipos_ids) {
                await solicitudxequipoModel.create({
                    id_solicitud: solicitud.id_solicitud,
                    id_equipo
                });
            }
        }

        return solicitud;
    }

    async update(id, data) {
        const result = await solicitudModel.update(data, { where: { id_solicitud: id } });
        if (result[0] === 0) throw new Error('Solicitud no encontrada');
        
        if (data.equipos_ids && Array.isArray(data.equipos_ids)) {
            await solicitudxequipoModel.destroy({ where: { id_solicitud: id } });
            for (const id_equipo of data.equipos_ids) {
                await solicitudxequipoModel.create({
                    id_solicitud: id,
                    id_equipo
                });
            }
        }
        
        return true;
    }

    async cambiarEstado(id_solicitud, id_estado_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        await Estadoxsolicitud.create({
            id_solicitud,
            id_estado_solicitud
        });
        return true;
    }

    async delete(id) {
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        if (!deleted) throw new Error('Solicitud no encontrada');
        return true;
    }
}

export default new solicitudService();