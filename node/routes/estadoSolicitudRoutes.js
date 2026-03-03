import express from 'express'
import authMiddleware from '../middlewares/auth.js'
import { requireRole } from '../middlewares/authorize.js'
import {
  getAllEstadosSolicitud,
  getEstadoSolicitud,
  createEstadoSolicitud,
  updateEstadoSolicitud,
  deleteEstadoSolicitud
} from '../controller/estadoSolicitudController.js'

const router = express.Router()

// Requiere sesión válida y que el usuario exista en la BD
router.use(authMiddleware)

router.get('/', getAllEstadosSolicitud)
router.get('/:id', getEstadoSolicitud)
// Sólo gestores/instructores (o admin) pueden crear/editar/eliminar
router.post('/', requireRole('gestor','instructor','intructor'), createEstadoSolicitud)
router.put('/:id', requireRole('gestor','instructor','intructor'), updateEstadoSolicitud)
router.delete('/:id', requireRole('gestor','instructor','intructor'), deleteEstadoSolicitud)

export default router