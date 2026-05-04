import express from 'express';
import {
  getAllEstadoxsolicitud,
  getEstadoxsolicitud,
  createEstadoxsolicitud,
  updateEstadoxsolicitud,
  deleteEstadoxsolicitud
} from '../controller/estadoxsolicitudController.js';
import { todosLosRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', todosLosRoles, getAllEstadoxsolicitud);
router.get('/:id', todosLosRoles, getEstadoxsolicitud);
router.post('/', todosLosRoles, createEstadoxsolicitud);
router.put('/:id', todosLosRoles, updateEstadoxsolicitud);
router.delete('/:id', todosLosRoles, deleteEstadoxsolicitud);

export default router;
