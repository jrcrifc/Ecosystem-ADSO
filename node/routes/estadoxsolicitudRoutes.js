import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
	getAllEstadoxsolicitud,
	getEstadoxsolicitud,
	createEstadoxsolicitud,
	updateEstadoxsolicitud,
	deleteEstadoxsolicitud
} from '../controller/estadoxsolicitudController.js';

const router = express.Router();

router.get('/', authMiddleware, getAllEstadoxsolicitud);
router.get('/:id', authMiddleware, getEstadoxsolicitud);
router.post('/', authMiddleware, createEstadoxsolicitud);
router.put('/:id', authMiddleware, updateEstadoxsolicitud);
router.delete('/:id', authMiddleware, deleteEstadoxsolicitud);

export default router;
