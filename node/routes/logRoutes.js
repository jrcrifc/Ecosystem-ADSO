// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa el controlador de logs de auditoría
import { getLogs } from '../controller/logController.js';
// Importa el middleware que restringe el acceso solo a administradores
import { soloAdmin } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/auditoria para obtener los logs de auditoría
router.get('/', soloAdmin, getLogs);

// Exporta el router para ser usado en la aplicación
export default router;

