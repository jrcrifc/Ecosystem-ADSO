import express from 'express';
import { getEstados, createEstado, updateEstado, deleteEstado } from '../controllers/estadoSolicitudController.js';
const router = express.Router();
router.get('/', getEstados);
router.post('/', createEstado);
router.put('/:id', updateEstado);
router.delete('/:id', deleteEstado);
export default router;
