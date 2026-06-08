// ============================================================
// 📋 SERVICIO DE SOLICITUDES DE PRÉSTAMO (solicitudService)
// Este servicio maneja la lógica de negocio para las solicitudes de préstamo.
// Permite crear, modificar y listar solicitudes, asociando equipos,
// y actualizando dinámicamente los estados tanto de las solicitudes
// como de los equipos (ej. marcando equipos como prestados o disponibles).
// ============================================================

// Importa el modelo de solicitudes para acceder a la tabla de solicitudes
import solicitudModel from "../models/solicitudModel.js";
// Importa el modelo de historial de estados de solicitud
import Estadoxsolicitud from "../models/estadoxsolicitudModel.js";
// Importa el modelo de usuarios para incluir datos del solicitante
import userModel from "../models/userModel.js";
// Importa el modelo de catálogo de estados de solicitud
import estadoSolicitudModel from "../models/Estado_solicitudModel.js";
// Importa Sequelize para funcionalidades adicionales de base de datos
import { Sequelize } from "sequelize";
// Importa el modelo de equipos para la relación con solicitudes
import equipoModel from "../models/EquiposModel.js";
// Importa el modelo de relación solicitud-equipo para la tabla pivote
import solicitudxequipoModel from "../models/solicitudxequipoModel.js";
// Importa el modelo de historial de estados de equipo
import Estadoxequipo from "../models/estadoxequipoModel.js";

// Define la clase de servicio para solicitudes de préstamo con flujo completo de estados
class solicitudService {
    
    // Obtiene todas las solicitudes del sistema con relaciones y último estado calculado
    async getAll() {
        // Consulta todas las solicitudes incluyendo usuario, historial de estados y equipos
        const solicitudes = await solicitudModel.findAll({
            include: [
                {
                    // Incluye datos básicos del usuario que creó la solicitud
                    model: userModel,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombres_apellidos', 'rol', 'numero_ficha', 'nombre_ficha', 'es_sena_empresa']
                },
                {
                    // Incluye el historial de estados por los que ha pasado la solicitud
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
                    // Incluye los equipos asociados a la solicitud
                    model: equipoModel,
                    as: 'equipos',
                    attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa', 'foto_equipo']
                }
            ],
            // Ordena el historial de estados de forma descendente por ID
            order: [
                [{ model: Estadoxsolicitud, as: 'estados' }, 'id_estadoxsolicitud', 'DESC']
            ]
        });
        // Formatea la respuesta para determinar el último estado de cada solicitud
        return solicitudes.map(s => {
            const sol = s.toJSON();
            // Ordena los estados del más reciente al más antiguo
            const estadosOrdenados = (sol.estados || []).sort(
                (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
            );
            // Obtiene el último estado o asume generado por defecto
            const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";
            // Retorna la solicitud con el campo ultimoEstado añadido
            return { ...sol, ultimoEstado };
        });
    }

    // Obtiene una solicitud por su ID incluyendo los equipos que solicita
    async getById(id_solicitud) {
        // Busca la solicitud por su clave primaria incluyendo equipos
        const solicitud = await solicitudModel.findByPk(id_solicitud, {
            include: [{
                model: equipoModel,
                as: 'equipos',
                attributes: ['id_equipo', 'nom_equipo']
            }]
        });
        // Si no existe, lanza un error
        if (!solicitud) throw new Error('Solicitud no encontrada');
        // Retorna la solicitud encontrada
        return solicitud;
    }

    // Crea una nueva solicitud de préstamo con estado inicial y equipos asociados
    async create(data, userId) {
        // Crea el registro de cabecera de la solicitud
        const solicitud = await solicitudModel.create({
            ...data,
            id_usuario: userId
        });
        // Crea el estado inicial generado cuyo ID en base de datos es 1
        await Estadoxsolicitud.create({
            id_solicitud: solicitud.id_solicitud,
            id_estado_solicitud: 1
        });
        // Registra cada equipo vinculado a esta solicitud en la tabla pivote
        if (data.equipos_ids && Array.isArray(data.equipos_ids)) {
            for (const id_equipo of data.equipos_ids) {
                await solicitudxequipoModel.create({
                    id_solicitud: solicitud.id_solicitud,
                    id_equipo
                });
            }
        }
        // Retorna la solicitud creada
        return solicitud;
    }

    // Modifica los datos de una solicitud existente con validación de estado
    async update(id, data) {
        // Busca la solicitud incluyendo su historial de estados
        const solicitud = await solicitudModel.findByPk(id, {
            include: [
                {
                    model: Estadoxsolicitud,
                    as: 'estados',
                    include: [{
                        model: estadoSolicitudModel,
                        as: 'estadoSolicitud',
                        attributes: ['estado']
                    }],
                    attributes: ['id_estadoxsolicitud']
                }
            ]
        });
        // Si no existe, lanza un error
        if (!solicitud) throw new Error('Solicitud no encontrada');
        // Determina el último estado actual de la solicitud
        const estadosOrdenados = (solicitud.estados || []).sort(
            (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
        );
        const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";
        // Impide modificación si la solicitud está en proceso de préstamo, cancelada o rechazada
        if (!['generado', 'aceptado'].includes(ultimoEstado)) {
            throw new Error(`No se puede modificar una solicitud en estado ${ultimoEstado.toUpperCase()}`);
        }
        // Actualiza los campos generales de la solicitud
        await solicitud.update(data);
        // Actualiza la lista de equipos destruyendo los vínculos antiguos y creando los nuevos
        if (data.equipos_ids && Array.isArray(data.equipos_ids)) {
            await solicitudxequipoModel.destroy({ where: { id_solicitud: id } });
            for (const id_equipo of data.equipos_ids) {
                await solicitudxequipoModel.create({
                    id_solicitud: id,
                    id_equipo
                });
            }
        }
        // Inicializa bandera de democión como falsa
        let demotado = false;
        // Si estaba en aceptado y se edita, vuelve a generado para revisión administrativa
        if (ultimoEstado === 'aceptado') {
            await Estadoxsolicitud.create({
                id_solicitud: id,
                id_estado_solicitud: 1
            });
            demotado = true;
        }
        // Retorna indicador de democión y el ID del usuario solicitante
        return { demotado, id_usuario: solicitud.id_usuario };
    }

    // Cambia el estado de una solicitud y actualiza los estados de los equipos vinculados
    async cambiarEstado(id_solicitud, id_estado_solicitud) {
        // Busca la solicitud por su ID
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        // Si no existe, lanza un error
        if (!solicitud) throw new Error('Solicitud no encontrada');
        // Registra el nuevo estado en el historial de estados de la solicitud
        await Estadoxsolicitud.create({
            id_solicitud,
            id_estado_solicitud
        });
        // Obtiene todos los equipos vinculados a esta solicitud
        const vinculos = await solicitudxequipoModel.findAll({
            where: { id_solicitud }
        });
        // Si existen vínculos, actualiza los estados de los equipos
        if (vinculos && vinculos.length > 0) {
            let idEstadoEquipo = null;
            // Mapea el estado de la solicitud al estado físico del equipo
            if (id_estado_solicitud === 3) {
                idEstadoEquipo = 4;
            } else if (id_estado_solicitud === 5 || id_estado_solicitud === 6 || id_estado_solicitud === 4) {
                idEstadoEquipo = 1;
            }
            // Si se determinó un estado para los equipos
            if (idEstadoEquipo !== null) {
                // Extrae los IDs de los equipos vinculados
                const idsEquipos = vinculos.map(v => v.id_equipo);
                // Actualiza el estado activo de los equipos en el inventario general
                await equipoModel.update(
                    { estado: 1 },
                    { where: { id_equipo: idsEquipos } }
                );
                // Inserta el nuevo estado en el historial de estados de cada equipo
                for (const id_equipo of idsEquipos) {
                    await Estadoxequipo.create({
                        id_equipo,
                        id_estado_equipo: idEstadoEquipo
                    });
                }
            }
        }
        // Retorna true indicando que el cambio fue exitoso
        return true;
    }

    // Elimina una solicitud de préstamo por su ID
    async delete(id) {
        // Ejecuta la eliminación filtrando por ID de solicitud
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        // Si no se eliminó ningún registro, lanza un error
        if (!deleted) throw new Error('Solicitud no encontrada');
        // Retorna true indicando que la eliminación fue exitosa
        return true;
    }
}

// Exporta una instancia única del servicio para usar como singleton
export default new solicitudService();
