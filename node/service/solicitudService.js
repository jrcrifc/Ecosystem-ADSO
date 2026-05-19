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
                    attributes: ['id_usuario', 'nombres_apellidos', 'rol', 'numero_ficha', 'nombre_ficha', 'es_sena_empresa']
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

        // Registrar el nuevo estado
        await Estadoxsolicitud.create({
            id_solicitud,
            id_estado_solicitud
        });

        // Buscar los equipos vinculados directamente en la tabla intermedia
        const vinculos = await solicitudxequipoModel.findAll({
            where: { id_solicitud }
        });

        if (vinculos && vinculos.length > 0) {
            let nuevoEstadoEquipo = null;

            // id_estado_solicitud: 3 (prestado) -> Equipo estado 2 (Prestado)
            // id_estado_solicitud: 5 (entregado) -> Equipo estado 1 (Disponible)
            // id_estado_solicitud: 6 (cancelado) -> Equipo estado 1 (Disponible)

            if (id_estado_solicitud === 3) {
                nuevoEstadoEquipo = 2; // Prestado
            } else if (id_estado_solicitud === 5 || id_estado_solicitud === 6) {
                nuevoEstadoEquipo = 1; // Disponible
            }

            if (nuevoEstadoEquipo !== null) {
                const idsEquipos = vinculos.map(v => v.id_equipo);
                await equipoModel.update(
                    { estado: nuevoEstadoEquipo },
                    { where: { id_equipo: idsEquipos } }
                );
            }
        }

        return true;
    }

    async delete(id) {
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        if (!deleted) throw new Error('Solicitud no encontrada');
        return true;
    }
}

export default new solicitudService();