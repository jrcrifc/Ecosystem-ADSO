import express from 'express';
import { getMisNotificaciones, marcarLeida, marcarTodasLeidas } from '../controller/notificacionController.js';

const router = express.Router();

router.get('/:id', getMisNotificaciones);
router.put('/:id/leida', marcarLeida);
router.put('/:id_usuario/todas-leidas', marcarTodasLeidas);

export default router;