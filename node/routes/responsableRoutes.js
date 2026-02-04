import express from 'express';
import { getResponsables, createResponsable, updateResponsable, deleteResponsable } from '../controllers/responsableController.js';
const router = express.Router();
router.get('/', getResponsables);
router.post('/', createResponsable);
router.put('/:id', updateResponsable);
router.delete('/:id', deleteResponsable);
export default router;
