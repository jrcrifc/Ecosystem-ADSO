import express from 'express';
import { getEquipos, createEquipo, updateEquipo, deleteEquipo } from '../controllers/equipoController.js';
const router = express.Router();
router.get('/', getEquipos);
router.post('/', createEquipo);
router.put('/:id', updateEquipo);
router.delete('/:id', deleteEquipo);
export default router;
