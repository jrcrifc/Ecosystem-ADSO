// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de cuentadantes
import { 
    getAllcuentadante, 
    getcuentadante, 
    createcuentadante, 
    updatecuentadante, 
    toggleEstadoCuentadante 
} from '../controller/cuentadanteController.js';
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/cuentadante para obtener todos los cuentadantes
router.get('/', adminOGestor, getAllcuentadante);

// Define la ruta POST /api/cuentadante para crear un nuevo cuentadante
router.post('/', adminOGestor, createcuentadante);

// Define la ruta PUT /api/cuentadante/toggle-estado/:id para activar/inactivar un cuentadante
router.put('/toggle-estado/:id', adminOGestor, toggleEstadoCuentadante);

// Define la ruta GET /api/cuentadante/:id para obtener un cuentadante por ID
router.get('/:id', adminOGestor, getcuentadante);

// Define la ruta PUT /api/cuentadante/:id para actualizar un cuentadante existente
router.put('/:id', adminOGestor, updatecuentadante);

// Exporta el router para ser usado en la aplicación
export default router;