// ============================================================
// 📋 CONTROLADOR DE SOLICITUDES DE PRÉSTAMO (solicitudController)
// Gestiona el flujo de peticiones HTTP de creación, actualización, eliminación
// y cambio de estado de las solicitudes de préstamo.
// Emite notificaciones y eventos WebSocket en tiempo real para refrescar
// las interfaces de usuario.
// ============================================================

// Importa el servicio de solicitudes para la lógica de negocio
import solicitudService from '../service/solicitudService.js';
// Importa el servicio de notificaciones para enviar alertas
import NotificacionService from '../service/notificacionService.js';
// Importa el modelo de solicitudes para consultas directas a la base de datos
import solicitudModel from '../models/solicitudModel.js';
// Importa el modelo de estados de solicitud para obtener el nombre del estado
import estadoSolicitudModel from '../models/Estado_solicitudModel.js';
// Importa la función getIO para emitir eventos WebSocket
import { getIO } from '../socket.js';

// Controlador para obtener todas las solicitudes de préstamo
export const getAll = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todas las solicitudes
        const solicitudes = await solicitudService.getAll();
        res.json(Array.isArray(solicitudes) ? solicitudes : []);
    } catch (error) {
        console.warn("Advertencia al obtener solicitudes (retornando lista vacía):", error?.message);
        res.json([]);
    }
};

// Controlador para obtener una solicitud por su ID
export const getById = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar la solicitud por su ID
        const solicitud = await solicitudService.getById(req.params.id);
        // Responde con los datos de la solicitud encontrada
        res.json(solicitud);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ success: false, message: error.message });
    }
};

// Controlador para crear una nueva solicitud de préstamo
export const create = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Determina el ID del usuario solicitante desde el cuerpo o desde el token
        const userId = req.body.id_usuario_solicitante || req.user.id;
        // Obtiene el rol del usuario desde el token JWT decodificado
        const userRol = req.user.rol || '';
        // Llama al servicio para crear la solicitud con los datos proporcionados
        const nuevaSolicitud = await solicitudService.create(req.body, userId);

        // Solo notifica a los administradores si quien crea NO es un Administrador
        const esAdmin = ['administrador', 'admin'].includes(String(userRol).toLowerCase());

        if (!esAdmin) {
            // Intenta notificar a los administradores en tiempo real por WebSocket
            try {
                // Envía una notificación en tiempo real a todos los administradores aprobados
                await NotificacionService.notificarAdmins({
                    id_usuario_origen: userId,
                    titulo: '📋 Nueva solicitud de un Instructor',
                    mensaje: `Un instructor ha creado una nueva solicitud de préstamo (#${nuevaSolicitud.id_solicitud}). Revísala en Gestión de Solicitudes.`,
                    tipo: 'nueva_solicitud'
                });
                console.log(`🔔 Admins notificados en tiempo real por solicitud del usuario ID ${userId}`);
            } catch (notifError) {
                // Registra el error de notificación en consola sin interrumpir el flujo
                console.error('Error al notificar a admins:', notifError);
            }
        }

        // Emite un evento global para refrescar las tablas en los clientes conectados (siempre)
        try {
            getIO().emit('solicitud_actualizada');
            getIO().emit('equipo_actualizado');
        } catch (socketError) {
            console.error('Error al emitir evento de socket:', socketError);
        }

        // Responde con estado 201 y los datos de la solicitud creada
        res.status(201).json({ success: true, message: 'Solicitud creada correctamente', data: nuevaSolicitud });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controlador para actualizar una solicitud de préstamo existente
export const update = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar la solicitud con los nuevos datos y validar permisos
        const result = await solicitudService.update(req.params.id, req.body, req.user);
        const userRol = req.user?.rol || '';
        const esAdmin = ['administrador', 'admin'].includes(String(userRol).toLowerCase());

        // Si no es admin (ej. instructor actualizando), notificar al administrador
        if (!esAdmin) {
            try {
                await NotificacionService.notificarAdmins({
                    id_usuario_origen: req.user?.id,
                    titulo: '🔄 Solicitud modificada',
                    mensaje: `Un instructor modificó los datos de la solicitud #${req.params.id}. Revísala en Gestión de Solicitudes.`,
                    tipo: 'nueva_solicitud'
                });
            } catch (notifError) {
                console.error('Error al notificar modificación de solicitud:', notifError);
            }
        } else if (result && result.demotado) {
            // Verifica si la solicitud fue demotada
            try {
                await NotificacionService.notificarAdmins({
                    id_usuario_origen: result.id_usuario,
                    titulo: '⚠️ Solicitud de préstamo modificada',
                    mensaje: `La solicitud #${req.params.id} fue modificada y requiere una nueva aprobación en Gestión de Solicitudes.`,
                    tipo: 'nueva_solicitud'
                });
            } catch (notifError) {
                console.error('Error al notificar modificación de solicitud:', notifError);
            }
        }

        // Emite eventos globales de refresco en tiempo real por WebSocket
        try {
            getIO().emit('solicitud_actualizada');
            getIO().emit('equipo_actualizado');
        } catch (socketError) {
            // Registra el error de socket en consola
            console.error('Error al emitir eventos de socket:', socketError);
        }

        // Responde con mensaje de éxito
        res.json({ success: true, message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controlador para cambiar el estado de una solicitud de préstamo
export const cambiarEstado = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Extrae el ID del nuevo estado del cuerpo de la petición
        const { id_estado_solicitud } = req.body;
        // Llama al servicio para cambiar el estado de la solicitud
        await solicitudService.cambiarEstado(req.params.id, id_estado_solicitud);

        // Intenta notificar al solicitante sobre el cambio de estado
        try {
            // Obtiene la solicitud desde la base de datos
            const solicitud = await solicitudModel.findByPk(req.params.id);
            // Verifica que la solicitud exista
            if (solicitud) {
                // Obtiene el objeto de estado para extraer su nombre descriptivo
                const estadoObj = await estadoSolicitudModel.findByPk(id_estado_solicitud);
                // Define el nombre del estado o un valor por defecto
                const estadoNombre = estadoObj?.estado || 'actualizado';

                // Mapa de emojis según el nombre del estado
                const emojiMap = {
                    'generado': '📝', 'aceptado': '✅', 'prestado': '📦',
                    'entregado': '🔬', 'cancelado': '❌', 'rechazado': '🚫'
                };
                // Selecciona el emoji correspondiente o uno por defecto
                const emoji = emojiMap[estadoNombre] || '🔔';

                const esRevisionEntrega = Number(id_estado_solicitud) === 5 || estadoNombre === 'entregado';
                const tituloNotif = esRevisionEntrega
                    ? `🔬 Solicitud #${req.params.id}: Entregado (En Revisión)`
                    : `${emoji} Tu solicitud #${req.params.id} fue ${estadoNombre}`;
                const mensajeNotif = esRevisionEntrega
                    ? `El estado de tu solicitud #${req.params.id} cambió a Entregado (En Revisión) porque el(los) equipo(s) ingresaron a revisión técnica. Te notificaremos cualquier novedad. Revisa Gestión de Solicitudes.`
                    : `La solicitud #${req.params.id} cambió su estado a "${estadoNombre}". Revisa Gestión de Solicitudes para más detalles.`;

                // Crea una notificación para el usuario solicitante
                await NotificacionService.crearNotificacion({
                    id_usuario_destino: solicitud.id_usuario,
                    id_usuario_origen: req.user?.id || null,
                    titulo: tituloNotif,
                    mensaje: mensajeNotif,
                    tipo: 'cambio_estado_solicitud'
                });

                // Emite eventos de refresco automático por WebSocket
                getIO().emit('solicitud_actualizada');
                getIO().emit('equipo_actualizado');
            }
        } catch (notifError) {
            // Registra el error de notificación en consola sin interrumpir el flujo
            console.error('Error al notificar cambio de estado:', notifError);
        }

        // Responde con mensaje de éxito
        res.json({ success: true, message: 'Estado cambiado correctamente' });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controlador para eliminar una solicitud de préstamo
export const remove = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        const id_solicitud = req.params.id;
        // Llama al servicio para eliminar la solicitud por su ID
        await solicitudService.delete(id_solicitud);

        const userRol = req.user?.rol || '';
        const esAdmin = ['administrador', 'admin'].includes(String(userRol).toLowerCase());
        if (!esAdmin) {
            try {
                await NotificacionService.notificarAdmins({
                    id_usuario_origen: req.user?.id || null,
                    titulo: '🗑️ Solicitud eliminada',
                    mensaje: `La solicitud de préstamo #${id_solicitud} fue eliminada/cancelada por el solicitante. Revisa Gestión de Solicitudes.`,
                    tipo: 'nueva_solicitud'
                });
            } catch (e) {
                console.error("Error notificando eliminación a admin:", e);
            }
        }

        try {
            getIO().emit('solicitud_actualizada');
            getIO().emit('equipo_actualizado');
        } catch (e) {}

        // Responde con mensaje de éxito
        res.json({ success: true, message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        // Si ocurre un error, responde con estado 404 y el mensaje de error
        res.status(404).json({ success: false, message: error.message });
    }
};
