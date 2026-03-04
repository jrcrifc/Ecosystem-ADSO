import express from 'express';
import { getAllProveedores, getProveedores, createProveedores, updateProveedores, deleteProveedores } from '../controller/proveedoresController.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();
router.get('/', authMiddleware, getAllProveedores);
router.get('/:id', authMiddleware, getProveedores);
router.post('/', authMiddleware, createProveedores);
router.put('/:id', authMiddleware, updateProveedores);
router.delete('/:id', authMiddleware, deleteProveedores);

export default router;