// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores del historial de estados de solicitud
import {
  getAllEstadoxsolicitud,
  getEstadoxsolicitud,
  createEstadoxsolicitud,
  updateEstadoxsolicitud,
  deleteEstadoxsolicitud
} from '../controller/estadoxsolicitudController.js';
// Importa el middleware que permite acceso a todos los roles
import { todosLosRoles } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/estadoxsolicitud para obtener todo el historial de estados de solicitud
router.get('/', todosLosRoles, getAllEstadoxsolicitud);

// Define la ruta GET /api/estadoxsolicitud/:id para obtener un registro del historial por ID
router.get('/:id', todosLosRoles, getEstadoxsolicitud);

// Define la ruta POST /api/estadoxsolicitud para crear un nuevo registro en el historial
router.post('/', todosLosRoles, createEstadoxsolicitud);

// Define la ruta PUT /api/estadoxsolicitud/:id para actualizar un registro del historial
router.put('/:id', todosLosRoles, updateEstadoxsolicitud);

// Define la ruta DELETE /api/estadoxsolicitud/:id para eliminar un registro del historial
router.delete('/:id', todosLosRoles, deleteEstadoxsolicitud);

// Exporta el router para ser usado en la aplicación
export default router;

