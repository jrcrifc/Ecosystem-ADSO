import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { 
  getAllSolicitudPrestamo, 
  getSolicitudPrestamo, 
  createSolicitudPrestamo, 
  updateSolicitudPrestamo, 
  deleteSolicitudPrestamo 
} from '../controller/solicitud_prestamoControllers.js';

const router = express.Router();

router.get('/', authMiddleware, getAllSolicitudPrestamo);
router.get('/:id', authMiddleware, getSolicitudPrestamo);
router.post('/', authMiddleware, createSolicitudPrestamo);
router.put('/:id', authMiddleware, updateSolicitudPrestamo);
router.delete('/:id', authMiddleware, deleteSolicitudPrestamo);

export default router;



