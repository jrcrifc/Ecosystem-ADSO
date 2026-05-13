import solicitudService from '../service/solicitudService.js';
import NotificacionService from '../service/notificacionService.js';
import solicitudModel from '../models/solicitudModel.js';
import estadoSolicitudModel from '../models/Estado_solicitudModel.js';
import { getIO } from '../socket.js'; // ✅ Importar para refresco en tiempo real

export const getAll = async (req, res) => {
    try {
        const solicitudes = await solicitudService.getAll();
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const solicitud = await solicitudService.getById(req.params.id);
        res.json(solicitud);
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        // ← Si es admin y envía id_usuario_solicitante, usar ese ID
        // ← De lo contrario, usar el id del token JWT (usuario actual)
        const userId = req.body.id_usuario_solicitante || req.user.id;
        const nuevaSolicitud = await solicitudService.create(req.body, userId);

        // ✅ Notificar a todos los admins que se creó una nueva solicitud
        try {
            await NotificacionService.notificarAdmins({
                id_usuario_origen: userId,
                titulo: '📋 Nueva solicitud de préstamo',
                mensaje: `Se ha creado una nueva solicitud de préstamo (ID: ${nuevaSolicitud.id_solicitud}). Revísala en Gestión de Solicitudes.`,
                tipo: 'nueva_solicitud'
            });

            // ✅ Emitir evento global de refresco para las tablas
            getIO().emit('solicitud_actualizada');
        } catch (notifError) {
            console.error('Error al notificar:', notifError);
        }

        res.status(201).json({ success: true, message: 'Solicitud creada correctamente', data: nuevaSolicitud });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        await solicitudService.update(req.params.id, req.body);
        res.json({ success: true, message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ← endpoint para cambiar estado (admin)
export const cambiarEstado = async (req, res) => {
    try {
        const { id_estado_solicitud } = req.body;
        await solicitudService.cambiarEstado(req.params.id, id_estado_solicitud);

        // ✅ Notificar al solicitante que su solicitud cambió de estado
        try {
            const solicitud = await solicitudModel.findByPk(req.params.id);
            if (solicitud) {
                const estadoObj = await estadoSolicitudModel.findByPk(id_estado_solicitud);
                const estadoNombre = estadoObj?.estado || 'actualizado';

                const emojiMap = {
                    'generado': '📝', 'aceptado': '✅', 'prestado': '📦',
                    'entregado': '🎉', 'cancelado': '❌', 'rechazado': '🚫'
                };
                const emoji = emojiMap[estadoNombre] || '🔔';

                await NotificacionService.crearNotificacion({
                    id_usuario_destino: solicitud.id_usuario,
                    id_usuario_origen: req.user?.id || null,
                    titulo: `${emoji} Tu solicitud fue ${estadoNombre}`,
                    mensaje: `La solicitud #${req.params.id} cambió su estado a "${estadoNombre}". Revisa tu historial para más detalles.`,
                    tipo: 'cambio_estado_solicitud'
                });

                // ✅ Emitir evento global para refrescar las tablas de los usuarios
                getIO().emit('solicitud_actualizada');
                getIO().emit('equipo_actualizado');
            }
        } catch (notifError) {
            console.error('Error al notificar cambio de estado:', notifError);
        }

        res.json({ success: true, message: 'Estado cambiado correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await solicitudService.delete(req.params.id);
        res.json({ success: true, message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};