import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
	getAllSalidas,
	getSalida,
	createSalida,
	updateSalida,
	deleteSalida
} from '../controller/salidasController.js';

const router = express.Router();

router.get('/', authMiddleware, getAllSalidas);
router.get('/:id', authMiddleware, getSalida);
router.post('/', authMiddleware, createSalida);
router.put('/:id', authMiddleware, updateSalida);
router.delete('/:id', authMiddleware, deleteSalida);

export default router;
