// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores del historial de estados de equipo
import {
  getAllEstadoxequipo,
  getEstadoxequipo,
  createEstadoxequipo,
  updateEstadoxequipo,
  deleteEstadoxequipo
} from '../controller/EstadoxequipoController.js';
// Importa el servicio de historial de estados de equipo
import estadoxequipoService from '../service/estadoxequipoService.js';
// Importa los middlewares de autorización por roles
import { adminOGestor, todosLosRoles } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/estadoxequipo/ultimos/estados para obtener el último estado de cada equipo
router.get('/ultimos/estados', todosLosRoles, async (req, res) => {
  try {
    // Obtiene los últimos estados desde el servicio
    const data = await estadoxequipoService.getUltimosEstados();
    // Responde con los datos obtenidos
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define la ruta POST /api/estadoxequipo/cambiarEstado para registrar un cambio de estado manual
router.post('/cambiarEstado', adminOGestor, async (req, res) => {
  try {
    // Obtiene los IDs del equipo y estado desde el cuerpo de la petición
    const { id_equipo, id_estado_equipo } = req.body;
    // Ejecuta el cambio de estado a través del servicio
    const data = await estadoxequipoService.cambiarEstado(id_equipo, id_estado_equipo);
    // Responde con el estado creado
    res.status(201).json({ message: "Estado cambiado exitosamente", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Define la ruta GET /api/estadoxequipo para obtener todo el historial de estados
router.get('/', adminOGestor, getAllEstadoxequipo);

// Define la ruta GET /api/estadoxequipo/:id para obtener un registro del historial por ID
router.get('/:id', adminOGestor, getEstadoxequipo);

// Define la ruta POST /api/estadoxequipo para crear un nuevo registro en el historial
router.post('/', adminOGestor, createEstadoxequipo);

// Define la ruta PUT /api/estadoxequipo/:id para actualizar un registro del historial
router.put('/:id', adminOGestor, updateEstadoxequipo);

// Define la ruta DELETE /api/estadoxequipo/:id para eliminar un registro del historial
router.delete('/:id', adminOGestor, deleteEstadoxequipo);

// Exporta el router para ser usado en la aplicación
export default router;