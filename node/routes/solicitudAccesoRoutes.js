// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de solicitudes de acceso
import { enviarFormulario, getMiSolicitud, getTodasPendientes, getTodas, aprobarSolicitud, rechazarSolicitud } from '../controller/solicitudAccesoController.js';
// Importa el middleware de autenticación JWT
import authMiddleware from '../middleware/authMiddleware.js';
// Importa el middleware que restringe el acceso solo a administradores
import { soloAdmin } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta POST /api/solicitud-acceso para enviar el formulario de acceso
router.post('/', authMiddleware, enviarFormulario);

// Define la ruta GET /api/solicitud-acceso/pendientes para listar solicitudes pendientes
router.get('/pendientes', soloAdmin, getTodasPendientes);

// Define la ruta GET /api/solicitud-acceso/todas para listar todas las solicitudes de acceso
router.get('/todas', soloAdmin, getTodas);

// Define la ruta GET /api/solicitud-acceso/:id_usuario para obtener la solicitud de un usuario
router.get('/:id_usuario', authMiddleware, getMiSolicitud);

// Define la ruta PUT /api/solicitud-acceso/:id/aprobar para aprobar una solicitud de acceso
router.put('/:id/aprobar', soloAdmin, aprobarSolicitud);

// Define la ruta PUT /api/solicitud-acceso/:id/rechazar para rechazar una solicitud de acceso
router.put('/:id/rechazar', soloAdmin, rechazarSolicitud);

// Exporta el router para ser usado en la aplicación
export default router;