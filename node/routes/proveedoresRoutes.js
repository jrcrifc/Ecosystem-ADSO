import express from 'express';
import { getAllProveedores, getProveedores, createProveedores, updateProveedores, deleteProveedores } from '../controllers/proveedoresController.js'


const router = express.Router();
router.get('/', getAllProveedores);
router.get('/:id', getProveedores);
router.post('/', createProveedores);
router.put('/:id', updateProveedores);
router.delete('/:id', deleteProveedores);

export default router;