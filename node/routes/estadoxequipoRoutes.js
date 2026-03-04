import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  getAllEstadoxequipo,
  getEstadoxequipo,
  createEstadoxequipo,
  updateEstadoxequipo,
  deleteEstadoxequipo
} from '../controller/estadoxequipoControllers.js';

const router = express.Router();

router.get('/', authMiddleware, getAllEstadoxequipo);
router.get('/:id', authMiddleware, getEstadoxequipo);
router.post('/', authMiddleware, createEstadoxequipo);
router.put('/:id', authMiddleware, updateEstadoxequipo);
router.delete('/:id', authMiddleware, deleteEstadoxequipo);

export default router;
