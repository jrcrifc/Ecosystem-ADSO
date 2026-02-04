import express from 'express';
import { getEstadosEquipo, createEstadoEquipo, updateEstadoEquipo, deleteEstadoEquipo } from '../controllers/estadoEquipoController.js';

const router = express.Router();

router.get('/', getEstadosEquipo);
router.post('/', createEstadoEquipo);
router.put('/:id', updateEstadoEquipo);
router.delete('/:id', deleteEstadoEquipo);

export default router;