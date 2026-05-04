import express from 'express';
import { getAllProveedores, getProveedores, createProveedores, updateProveedores, deleteProveedores } from '../controller/proveedoresController.js'
import { adminOGestor } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.get('/', adminOGestor, getAllProveedores);
router.get('/:id', adminOGestor, getProveedores);
router.post('/', adminOGestor, createProveedores);
router.put('/:id', adminOGestor, updateProveedores);
router.delete('/:id', adminOGestor, deleteProveedores);

export default router;