import express from 'express';
import { getEstados, createEstado } from '../controllers/estadoSolicitudController.js';
const router = express.Router();
router.get('/', getEstados);
router.post('/', createEstado);
export default router;
