import express from 'express';
import {
	getAllSalidas,
	getSalida,
	createSalida,
	updateSalida,
	deleteSalida
} from '../controller/salidasController.js';

const router = express.Router();

router.get('/', getAllSalidas);
router.get('/:id', getSalida);
router.post('/', createSalida);
router.put('/:id', updateSalida);
router.delete('/:id', deleteSalida);

export default router;
