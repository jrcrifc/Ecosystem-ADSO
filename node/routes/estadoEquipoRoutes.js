import express from 'express'
import authMiddleware from '../middlewares/auth.js'
import { requireRole } from '../middlewares/authorize.js'
import {
  getAllEstadosEquipo,
  getEstadoEquipo,
  createEstadoEquipo,
  updateEstadoEquipo,
  deleteEstadoEquipo
} from '../controller/estadoEquipoController.js'

const router = express.Router()

// Proteger todas las rutas de estados: si el usuario no existe en la DB, no podrá ver/usar los datos
router.use(authMiddleware)

router.get('/', getAllEstadosEquipo)
router.get('/:id', getEstadoEquipo)
// Sólo gestores/instructores (o admin) pueden crear/editar/eliminar
router.post('/', requireRole('gestor','instructor','intructor'), createEstadoEquipo)
router.put('/:id', requireRole('gestor','instructor','intructor'), updateEstadoEquipo)
router.delete('/:id', requireRole('gestor','instructor','intructor'), deleteEstadoEquipo)

export default router