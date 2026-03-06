import express from 'express';
import {
  getAllEstadoxsolicitud,
  getEstadoxsolicitud,
  createEstadoxsolicitud,
  updateEstadoxsolicitud,
  deleteEstadoxsolicitud
} from '../controller/estadoxsolicitudController.js';

const router = express.Router();

router.get('/', getAllEstadoxsolicitud);
router.get('/:id', getEstadoxsolicitud);
router.post('/', createEstadoxsolicitud);
router.put('/:id', updateEstadoxsolicitud);
router.delete('/:id', deleteEstadoxsolicitud);

export default router;
