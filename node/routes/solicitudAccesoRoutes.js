import express from 'express';
import { enviarFormulario, getMiSolicitud, getTodasPendientes, getTodas, aprobarSolicitud, rechazarSolicitud } from '../controller/solicitudAccesoController.js';

const router = express.Router();

router.post('/', enviarFormulario);
router.get('/pendientes', getTodasPendientes);
router.get('/todas', getTodas);
router.get('/:id_usuario', getMiSolicitud);
router.put('/:id/aprobar', aprobarSolicitud);
router.put('/:id/rechazar', rechazarSolicitud);

export default router;