import express from 'express';
import { getResponsables, createResponsable } from '../controllers/responsableController.js';
const router = express.Router();
router.get('/', getResponsables);
router.post('/', createResponsable);
export default router;
