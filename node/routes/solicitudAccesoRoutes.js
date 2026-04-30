import express from 'express';
import { enviarFormulario, getMiSolicitud, getTodasPendientes, getTodas, aprobarSolicitud, rechazarSolicitud } from '../controller/solicitudAccesoController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { soloAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Enviar formulario — cualquier autenticado (Aprendiz/Instructor)
router.post('/', authMiddleware, enviarFormulario);

// Solo admin: ver pendientes y todas
router.get('/pendientes', soloAdmin, getTodasPendientes);
router.get('/todas', soloAdmin, getTodas);

// Cualquier autenticado puede ver su propia solicitud
router.get('/:id_usuario', authMiddleware, getMiSolicitud);

// Solo admin: aprobar/rechazar
router.put('/:id/aprobar', soloAdmin, aprobarSolicitud);
router.put('/:id/rechazar', soloAdmin, rechazarSolicitud);

export default router;