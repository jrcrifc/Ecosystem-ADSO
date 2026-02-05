import express from 'express'
import {
  getAllEquipos,
  getEquipo,
  createEquipo,
  updateEquipo,
  deleteEquipo
} from '../controller/equipoController.js'

const router = express.Router()

router.get('/', getAllEquipos)
router.get('/:id', getEquipo)
router.post('/', createEquipo)
router.put('/:id', updateEquipo)
router.delete('/:id', deleteEquipo)

export default router
