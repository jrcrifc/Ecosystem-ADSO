// Rutas de auditoría
import express from 'express';
// Importa el controlador de logs de auditoría
import { getLogs } from '../controller/logController.js';
// Importa el middleware que restringe el acceso solo a administradores
import { soloAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Define la ruta GET /api/auditoria para obtener los logs de auditoría
router.get('/', soloAdmin, getLogs);

export default router;

