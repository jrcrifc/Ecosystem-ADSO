import express from 'express';
import { getAll, createEstadoXEquipo, updateEstadoXEquipo, deleteEstadoXEquipo } from '../controllers/estadoXEquipoController.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', createEstadoXEquipo);
router.put('/:id', updateEstadoXEquipo);
router.delete('/:id', deleteEstadoXEquipo);

export default router;