// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de notificaciones
import { getMisNotificaciones, marcarLeida, marcarTodasLeidas } from '../controller/notificacionController.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/notificaciones/:id para obtener las notificaciones de un usuario
router.get('/:id', getMisNotificaciones);

// Define la ruta PUT /api/notificaciones/:id/leida para marcar una notificación como leída
router.put('/:id/leida', marcarLeida);

// Define la ruta PUT /api/notificaciones/:id_usuario/todas-leidas para marcar todas como leídas
router.put('/:id_usuario/todas-leidas', marcarTodasLeidas);

// Exporta el router para ser usado en la aplicación
export default router;