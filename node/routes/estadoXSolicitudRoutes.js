import express from 'express';
import { getAll, getHistorialBySolicitud, addEstadoToSolicitud } from '../controllers/estadoXSolicitudController.js';
const router = express.Router();
router.get('/', getAll);
router.get('/historial/:id', getHistorialBySolicitud);
router.post('/', addEstadoToSolicitud);
export default router;
