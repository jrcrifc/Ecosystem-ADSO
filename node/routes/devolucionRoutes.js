import express from 'express'
import { getAlldevolucion, getdevolucion, createdevolucion, updatedevolucion, deletedevolucion } from '../controller/devolucionController.js'



const router = express.Router()

router.get('/', getAlldevolucion);
router.get('/:id', getdevolucion);
router.post('/', createdevolucion);
router.put('/:id', updatedevolucion);
router.delete('/:id', deletedevolucion);

export default router;





