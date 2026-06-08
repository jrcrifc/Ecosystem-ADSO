// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de solicitudes para manejar la lógica de cada endpoint
import { 
    getAll, 
    getById, 
    create, 
    update,
    cambiarEstado,
    remove 
} from '../controller/solicitudController.js';
// Importa el modelo de solicitudes para operaciones en la base de datos
import solicitudModel from '../models/solicitudModel.js';
// Importa el modelo de relación solicitud-equipo
import solicitudxequipoModel from '../models/solicitudxequipoModel.js';
// Importa el modelo de equipos
import equipoModel from '../models/EquiposModel.js';
// Importa el modelo de historial de estados de equipos
import Estadoxequipo from '../models/estadoxequipoModel.js';
// Importa la función para emitir eventos por Socket.io
import { getIO } from '../socket.js';
// Importa el middleware de autenticación JWT
import authMiddleware from '../middleware/authMiddleware.js';
// Importa el middleware que permite acceso a todos los roles
import { todosLosRoles } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/solicitud para obtener todas las solicitudes
router.get('/', todosLosRoles, getAll);

// Define la ruta GET /api/solicitud/:id para obtener una solicitud por ID
router.get('/:id', todosLosRoles, getById);

// Define la ruta POST /api/solicitud para crear una nueva solicitud
router.post('/', todosLosRoles, create);

// Define la ruta PUT /api/solicitud/:id para actualizar una solicitud existente
router.put('/:id', todosLosRoles, update);

// Define la ruta DELETE /api/solicitud/:id para eliminar una solicitud
router.delete('/:id', todosLosRoles, remove);

// Define la ruta PUT /api/solicitud/estado/:id para activar/inactivar una solicitud y liberar equipos
router.put('/estado/:id', todosLosRoles, async (req, res) => {
    try {
        // Obtiene el ID de la solicitud desde los parámetros de la ruta
        const { id } = req.params;
        // Busca la solicitud en la base de datos
        const solicitud = await solicitudModel.findByPk(id);
        // Si no existe la solicitud responde con 404
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        // Calcula el nuevo estado invirtiendo el actual
        const nuevoEstado = solicitud.estado === 1 ? 0 : 1;
        // Actualiza el estado de la solicitud
        await solicitud.update({ estado: nuevoEstado });

        // Si se inactiva la solicitud, libera automáticamente los equipos vinculados
        if (nuevoEstado === 0) {
            // Busca todas las relaciones solicitud-equipo activas
            const vinculos = await solicitudxequipoModel.findAll({
                where: { id_solicitud: id }
            });

            // Si existen vínculos, libera los equipos asociados
            if (vinculos && vinculos.length > 0) {
                // Extrae los IDs de los equipos vinculados
                const idsEquipos = vinculos.map(v => v.id_equipo);
                
                // Actualiza los equipos a estado disponible (1)
                await equipoModel.update(
                    { estado: 1 },
                    { where: { id_equipo: idsEquipos } }
                );

                // Registra el cambio de estado en el historial de cada equipo
                for (const id_equipo of idsEquipos) {
                    await Estadoxequipo.create({
                        id_equipo,
                        id_estado_equipo: 1
                    });
                }
            }
        }

        // Emite eventos de actualización en tiempo real por Socket.io
        try {
            getIO().emit('solicitud_actualizada');
            getIO().emit('equipo_actualizado');
        } catch (socketError) {
            console.error('Error al emitir eventos de socket:', socketError);
        }

        // Responde con el mensaje de éxito y el nuevo estado
        res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

// Define la ruta POST /api/solicitud/cambiarEstado/:id para cambiar el estado del ciclo de la solicitud
router.post('/cambiarEstado/:id', todosLosRoles, cambiarEstado);

// Exporta el router para ser usado en la aplicación
export default router;