import express from 'express';
import {
  getAllEstadoxequipo,
  getEstadoxequipo,
  createEstadoxequipo,
  updateEstadoxequipo,
  deleteEstadoxequipo
} from '../controller/estadoxequipoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllEstadoxequipo);
router.get('/:id', authMiddleware, getEstadoxequipo);
router.post('/', authMiddleware, createEstadoxequipo);
router.put('/:id', authMiddleware, updateEstadoxequipo);
router.delete('/:id', authMiddleware, deleteEstadoxequipo);

export default router;
