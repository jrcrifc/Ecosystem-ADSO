import express from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';
const router = express.Router();
router.get('/', getEquipos);
router.post('/', createEquipo);
export default router;
