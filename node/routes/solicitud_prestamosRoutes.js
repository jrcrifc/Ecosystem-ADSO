import express from 'express'
import { getAllSolicitudPrestamo, getSolicitudPrestamo, createSolicitudPrestamo, updateSolicitudPrestamo, deleteSolicitudPrestamo } from '../controller/solicitud_prestamoControllers.js'



const router = express.Router()

router.get('/', getAllSolicitudPrestamo);
router.get('/:id', getSolicitudPrestamo);
router.post('/', createSolicitudPrestamo);
router.put('/:id', updateSolicitudPrestamo);
router.delete('/:id', deleteSolicitudPrestamo);

export default router;





