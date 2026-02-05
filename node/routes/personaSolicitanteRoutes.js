import express from 'express';
import { getAllPersonaSolicitante, getPersonaSolicitante, createPersonaSolicitante, updatePersonaSolicitante, deletePersonaSolicitante } from '../controllers/personaSolicitanteController.js';



const router = express.Router();

router.get('/', getAllPersonaSolicitante);
router.get('/:id', getPersonaSolicitante);
router.post('/', createPersonaSolicitante);
router.put('/:id', updatePersonaSolicitante);
router.delete('/:id', deletePersonaSolicitante);

export default router;