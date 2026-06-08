// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de configuración del sistema
import { getConfigs, updateConfig } from '../controller/configController.js';
// Importa el middleware que restringe el acceso solo a administradores
import { soloAdmin } from '../middleware/roleMiddleware.js';
// Importa el middleware de autenticación JWT
import authMiddleware from '../middleware/authMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/config para obtener todas las configuraciones del sistema
router.get('/', authMiddleware, soloAdmin, getConfigs);

// Define la ruta PUT /api/config para actualizar las configuraciones del sistema
router.put('/', authMiddleware, soloAdmin, updateConfig);

// Exporta el router para ser usado en la aplicación
export default router;

