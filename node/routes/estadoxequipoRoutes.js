import express from 'express';
import {
  getAllEstadoxequipo,
  getEstadoxequipo,
  createEstadoxequipo,
  updateEstadoxequipo,
  deleteEstadoxequipo
} from '../controller/EstadoxequipoController.js';

const router = express.Router();

router.get('/', getAllEstadoxequipo);
router.get('/:id', getEstadoxequipo);
router.post('/', createEstadoxequipo);
router.put('/:id', updateEstadoxequipo);
router.delete('/:id', deleteEstadoxequipo);

export default router;
