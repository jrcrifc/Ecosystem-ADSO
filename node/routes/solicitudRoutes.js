import express from 'express';
import { getSolicitudes, createSolicitud, getSolicitudWithHistorial } from '../controllers/solicitudController.js';
const router = express.Router();
router.get('/', getSolicitudes);
router.post('/', createSolicitud);
router.get('/:id', getSolicitudWithHistorial);
export default router;
