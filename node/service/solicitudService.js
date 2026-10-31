// ============================================================
// 📋 SERVICIO DE SOLICITUDES DE PRÉSTAMO (solicitudService)
// Este servicio maneja la lógica de negocio para las solicitudes de préstamo.
// Permite crear, modificar y listar solicitudes, asociando equipos,
// y actualizando dinámicamente los estados tanto de las solicitudes
// como de los equipos (ej. marcando equipos como prestados o disponibles).
// ============================================================

import solicitudModel from "../models/solicitudModel.js";
import Estadoxsolicitud from "../models/estadoxsolicitudModel.js";
import userModel from "../models/userModel.js";
import estadoSolicitudModel from "../models/Estado_solicitudModel.js";
import equipoModel from "../models/EquiposModel.js";
import solicitudxequipoModel from "../models/solicitudxequipoModel.js";
import Estadoxequipo from "../models/estadoxequipoModel.js";
import estadoEquipoModel from "../models/Estado_equipoModel.js";
import NotificacionService from "./notificacionService.js";
import emailService from "./emailService.js";
import { Op } from "sequelize";
import NotificacionModel from "../models/notificacionModel.js";
import InstructorModel from "../models/instructorModel.js";

class solicitudService {
    
    // Obtiene todas las solicitudes del sistema con relaciones y último estado calculado
    async getAll() {
        const solicitudes = await solicitudModel.findAll({
            include: [
                {
                    model: userModel,
                    as: 'usuario',
                    required: false,
                    attributes: ['id_usuario', 'nombres_apellidos', 'rol', 'email']
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
                    attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa', 'foto_equipo', 'estado'],
                    include: [{
                        model: Estadoxequipo,
                        as: 'estadosEquipo',
                        include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }]
                    }]
                }
            ],
            order: [
                ['id_solicitud', 'DESC'],
                [{ model: Estadoxsolicitud, as: 'estados' }, 'id_estadoxsolicitud', 'DESC']
            ]
        });

        // Obtener instructores para resolver solicitantes que pertenezcan a la tabla instructores
        const instructores = await InstructorModel.findAll({
            attributes: ['id_instructor', 'nombres_apellidos', 'email', 'documento']
        });
        const instMap = new Map(instructores.map(i => [i.id_instructor, i]));

        return solicitudes.map(s => {
            const sol = s.toJSON();
            // Priorizar la tabla instructores para solicitantes (o si no está en usuarios)
            if (instMap.has(sol.id_usuario) && (!sol.usuario || sol.usuario.rol !== 'Administrador')) {
                const inst = instMap.get(sol.id_usuario);
                sol.usuario = {
                    id_usuario: inst.id_instructor,
                    nombres_apellidos: inst.nombres_apellidos,
                    rol: 'Instructor',
                    email: inst.email
                };
            }
            const estadosOrdenados = (sol.estados || []).sort(
                (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
            );
            const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";

            let estadoVisual = ultimoEstado;
            if (ultimoEstado === 'entregado') {
                const algunEnRevision = (sol.equipos || []).some(eq => {
                    if (eq.estado === 0) return false;
                    const ordenadosEq = (eq.estadosEquipo || []).sort(
                        (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
                    );
                    const ultimoFisico = ordenadosEq[0]?.estadoEquipo?.estado || 'disponible';
                    return ultimoFisico === 'revision';
                });
                estadoVisual = algunEnRevision ? 'revision' : 'entregado';
            }

            return { ...sol, ultimoEstado, estadoVisual };
        });
    }

    // Obtiene una solicitud por su ID incluyendo los equipos que solicita
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

    // Valida que los equipos seleccionados no se crucen con solicitudes activas existentes
    async validarDisponibilidadEquipos(equipos_ids, fecha_inicio, fecha_fin, idSolicitudExcluida = null) {
        if (!equipos_ids || !equipos_ids.length || !fecha_inicio || !fecha_fin) return;

        for (const id_equipo of equipos_ids) {
            const equipo = await equipoModel.findByPk(id_equipo, {
                include: [{
                    model: solicitudModel,
                    as: 'solicitudes',
                    where: { estado: 1 },
                    required: false,
                    include: [{
                        model: Estadoxsolicitud,
                        as: 'estados',
                        include: [{ model: estadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
                    }],
                    through: { attributes: [] }
                }]
            });

            if (!equipo) continue;

            // 1. Verificar estado físico del equipo (no disponible, mantenimiento, revisión)
            const [estadosFisicos] = await equipoModel.sequelize.query(
                `SELECT ee.estado FROM estadoxequipo exe 
                 JOIN estado_equipo ee ON exe.id_estado_equipo = ee.id_estado_equipo 
                 WHERE exe.id_equipo = :id_equipo 
                 ORDER BY exe.id_estadoxequipo DESC LIMIT 1`,
                { replacements: { id_equipo } }
            );
            const estadoFisico = estadosFisicos[0]?.estado || 'disponible';
            if (estadoFisico === 'mantenimiento') {
                throw new Error(`El equipo "${equipo.nom_equipo}" se encuentra actualmente en MANTENIMIENTO y no puede ser solicitado.`);
            }
            if (estadoFisico === 'revision') {
                throw new Error(`El equipo "${equipo.nom_equipo}" se encuentra en REVISIÓN técnica en laboratorio y no puede ser solicitado.`);
            }

            // 2. Verificar si ya fue pedido por otro usuario
            const ahora = new Date();
            const conflicto = (equipo.solicitudes || []).find(s => {
                if (idSolicitudExcluida && s.id_solicitud === idSolicitudExcluida) return false;
                const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
                const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
                const tieneEstadoBloqueante = ['generado', 'aceptado', 'prestado'].includes(ultimoEstadoSol);
                const noHaExpirado = s.fecha_fin && new Date(s.fecha_fin) >= ahora;
                return tieneEstadoBloqueante && noHaExpirado;
            });

            if (conflicto) {
                throw new Error(`El equipo "${equipo.nom_equipo}" ya tiene una solicitud activa (#${conflicto.id_solicitud}). Recuerda que el equipo queda reservado para el primero que lo solicite y no estará disponible hasta su devolución y revisión.`);
            }
        }
    }

    // Crea una nueva solicitud de préstamo con estado inicial y equipos asociados
    async create(data, userId) {
        if (data.equipos_ids && data.fecha_inicio && data.fecha_fin) {
            await this.validarDisponibilidadEquipos(data.equipos_ids, data.fecha_inicio, data.fecha_fin);
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

    // Modifica los datos de una solicitud existente con validación de estado
    async update(id, data, currentUser = null) {
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
        if (!solicitud) throw new Error('Solicitud no encontrada');

        if (currentUser && currentUser.rol !== 'Administrador' && solicitud.id_usuario !== currentUser.id) {
            throw new Error('No tienes permisos para modificar esta solicitud');
        }

        const estadosOrdenados = (solicitud.estados || []).sort(
            (a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud
        );
        const ultimoEstado = estadosOrdenados[0]?.estadoSolicitud?.estado || "generado";

        if (ultimoEstado !== 'generado') {
            throw new Error(`Solo se pueden modificar solicitudes en estado GENERADO. La solicitud está en estado ${ultimoEstado.toUpperCase()} y no puede ser editada.`);
        }

        const fechaIni = data.fecha_inicio || solicitud.fecha_inicio;
        const fechaFin = data.fecha_fin || solicitud.fecha_fin;
        const equiposAValidar = data.equipos_ids || [];

        if (equiposAValidar.length && fechaIni && fechaFin) {
            await this.validarDisponibilidadEquipos(equiposAValidar, fechaIni, fechaFin, parseInt(id));
        }

        await solicitud.update(data);
        if (data.equipos_ids && Array.isArray(data.equipos_ids)) {
            await solicitudxequipoModel.destroy({ where: { id_solicitud: id } });
            for (const id_equipo of data.equipos_ids) {
                await solicitudxequipoModel.create({
                    id_solicitud: id,
                    id_equipo
                });
            }
        }
        let demotado = false;
        if (ultimoEstado === 'aceptado') {
            await Estadoxsolicitud.create({
                id_solicitud: id,
                id_estado_solicitud: 1
            });
            demotado = true;
        }
        return { demotado, id_usuario: solicitud.id_usuario };
    }

    // Cambia el estado de una solicitud y actualiza los estados de los equipos vinculados
    async cambiarEstado(id_solicitud, id_estado_solicitud) {
        const solicitud = await solicitudModel.findByPk(id_solicitud);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        await Estadoxsolicitud.create({
            id_solicitud,
            id_estado_solicitud
        });
        const vinculos = await solicitudxequipoModel.findAll({
            where: { id_solicitud }
        });
        if (vinculos && vinculos.length > 0) {
            let idEstadoEquipo = null;
            if (id_estado_solicitud === 3) {
                idEstadoEquipo = 4; // prestado
            } else if (id_estado_solicitud === 2) {
                idEstadoEquipo = 3; // solicitado
            } else if (id_estado_solicitud === 5) {
                idEstadoEquipo = 5; // revisión automática por 3 días hábiles
            } else if (id_estado_solicitud === 6) {
                idEstadoEquipo = 1; // disponible
            }
            if (idEstadoEquipo !== null) {
                const idsEquipos = vinculos.map(v => v.id_equipo);
                await equipoModel.update(
                    { estado: 1 },
                    { where: { id_equipo: idsEquipos } }
                );
                for (const id_equipo of idsEquipos) {
                    await Estadoxequipo.create({
                        id_equipo,
                        id_estado_equipo: idEstadoEquipo
                    });
                }

                // Cuando se devuelve el equipo (id_estado_solicitud === 5) y entra automáticamente a revisión:
                // Enviar correo electrónico automático al correo del instructor responsable de la solicitud
                if (id_estado_solicitud === 5 && solicitud.id_usuario) {
                    try {
                        const equiposLista = await equipoModel.findAll({
                            where: { id_equipo: idsEquipos },
                            attributes: ['nom_equipo']
                        });
                        const nombresEquipos = equiposLista.map(e => e.nom_equipo);

                        let instructor = await InstructorModel.findByPk(solicitud.id_usuario);
                        let email = instructor?.email;
                        let nombre = instructor?.nombres_apellidos;
                        if (!email) {
                            const u = await userModel.findByPk(solicitud.id_usuario);
                            email = u?.email;
                            nombre = u?.nombres_apellidos;
                        }
                        if (email) {
                            emailService.sendDevolucionEnRevisionEmail(
                                email,
                                nombre || 'Instructor',
                                nombresEquipos,
                                id_solicitud
                            ).catch(err => {
                                console.error('[solicitudService] Error enviando correo de devolución/revisión:', err?.message);
                            });
                        }
                    } catch (errMail) {
                        console.error('[solicitudService] Error preparando correo de devolución:', errMail?.message);
                    }
                }
            }
        }
        return true;
    }

    // Elimina una solicitud de préstamo por su ID
    async delete(id) {
        const deleted = await solicitudModel.destroy({ where: { id_solicitud: id } });
        if (!deleted) throw new Error('Solicitud no encontrada');
        return true;
    }

    // Verifica qué préstamos están vencidos (por fecha_fin superada o más de 15 días) y alerta al instructor y al administrador
    async checkOverdueLoans() {
        console.log("⏳ Iniciando revisión de préstamos vencidos...");
        try {
            const solicitudes = await this.getAll();
            const now = new Date();
            let vencidasCount = 0;

            for (const sol of solicitudes) {
                if (sol.ultimoEstado === "prestado") {
                    const fechaFinVencida = sol.fecha_fin && now > new Date(sol.fecha_fin);
                    let superaQuinceDias = false;
                    if (sol.fecha_inicio) {
                        const fechaInicio = new Date(sol.fecha_inicio);
                        const diffTime = Math.abs(now - fechaInicio);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        superaQuinceDias = diffDays >= 15;
                    }

                    if (fechaFinVencida || superaQuinceDias) {
                        const alreadyNotified = await NotificacionModel.findOne({
                            where: {
                                id_usuario_destino: sol.id_usuario,
                                [Op.or]: [
                                    { titulo: { [Op.like]: '%Vencid%' } },
                                    { titulo: 'Préstamo Vencido' }
                                ],
                                mensaje: { [Op.like]: `%#${sol.id_solicitud}%` }
                            }
                        });

                        if (!alreadyNotified) {
                            const nombresEq = (sol.equipos || []).map(e => e.nom_equipo).join(', ') || 'Equipo de laboratorio';
                            const nombreSolicitante = sol.usuario?.nombres_apellidos || 'Instructor';

                            console.log(`⚠️ Préstamo vencido detectado para Solicitud #${sol.id_solicitud} (Usuario: ${nombreSolicitante})`);

                            // 1. Notificar al Instructor en la campanita (adaptado al espacio)
                            await NotificacionService.crearNotificacion({
                                id_usuario_destino: sol.id_usuario,
                                id_usuario_origen: null,
                                titulo: `⏰ Préstamo Vencido (Solicitud #${sol.id_solicitud})`,
                                mensaje: `La solicitud #${sol.id_solicitud} (${nombresEq}) venció y no registra devolución. Acércate al laboratorio para entregar el equipo.`,
                                tipo: "alerta"
                            });

                            // 2. Notificar al Administrador en la campanita recordándole estar pendiente
                            await NotificacionService.notificarAdmins({
                                id_usuario_origen: sol.id_usuario,
                                titulo: `⏰ Solicitud #${sol.id_solicitud} Vencida (Sin Devolver)`,
                                mensaje: `El préstamo #${sol.id_solicitud} de ${nombreSolicitante} (${nombresEq}) venció y aún no se ha devuelto. Estar pendiente de la entrega.`,
                                tipo: "alerta"
                            });

                            // 3. Enviar correo electrónico al Instructor
                            if (sol.usuario?.email) {
                                await emailService.sendOverdueReturnAlert(
                                    sol.usuario.email,
                                    nombreSolicitante,
                                    sol.id_solicitud,
                                    nombresEq
                                ).catch(e => console.error("Error enviando correo de vencimiento:", e));
                            }

                            vencidasCount++;
                        }
                    }
                }
            }
            console.log(`✅ Revisión terminada. Se enviaron ${vencidasCount} nuevas alertas de vencimiento.`);
        } catch (error) {
            console.error("❌ Error verificando préstamos vencidos:", error);
        }
    }
}

export default new solicitudService();
