import express from 'express';
import { getSolicitudes, createSolicitud, getSolicitudWithHistorial, updateSolicitud, deleteSolicitud } from '../controllers/solicitudController.js';
const router = express.Router();
router.get('/', getSolicitudes);
router.post('/', createSolicitud);
router.get('/:id', getSolicitudWithHistorial);
router.put('/:id', updateSolicitud);
router.delete('/:id', deleteSolicitud);
export default router;
