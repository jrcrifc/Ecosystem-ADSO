// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de proveedores para manejar la lógica de cada endpoint
import { getAllProveedores, getProveedores, createProveedores, updateProveedores, deleteProveedores, cambiarEstadoProveedor } from '../controller/proveedoresController.js'
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/proveedor para obtener todos los proveedores
router.get('/', adminOGestor, getAllProveedores);

// Define la ruta GET /api/proveedor/:id para obtener un proveedor por ID
router.get('/:id', adminOGestor, getProveedores);

// Define la ruta POST /api/proveedor para crear un nuevo proveedor
router.post('/', adminOGestor, createProveedores);

// Define la ruta PUT /api/proveedor/:id para actualizar un proveedor existente
router.put('/:id', adminOGestor, updateProveedores);

// Define la ruta PUT /api/proveedor/estado/:id para activar/inactivar un proveedor
router.put('/estado/:id', adminOGestor, cambiarEstadoProveedor);

// Define la ruta DELETE /api/proveedor/:id para eliminar un proveedor
router.delete('/:id', adminOGestor, deleteProveedores);

// Exporta el router para ser usado en la aplicación
export default router;