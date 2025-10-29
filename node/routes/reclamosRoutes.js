import express from 'express'
import { getAllReclamos, getReclamos, createReclamos, updateReclamos, deleteReclamos } from '../controller/reclamosController.js'



const router = express.Router()

router.get('/', getAllReclamos);
router.get('/:id', getReclamos);
router.post('/', createReclamos);
router.put('/:id', updateReclamos);
router.delete('/:id', deleteReclamos);

export default router;





