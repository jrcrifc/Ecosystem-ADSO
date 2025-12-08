import express from 'express';
import { getHistorialBySolicitud, addEstadoToSolicitud } from '../controllers/estadoXSolicitudController.js';
const router = express.Router();
router.get('/historial/:id', getHistorialBySolicitud);
router.post('/', addEstadoToSolicitud);
export default router;
