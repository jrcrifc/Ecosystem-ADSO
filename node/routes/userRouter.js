import express from 'express'
import { login, register, listUsers, resetUsers } from '../controllers/userController.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({ msg: 'Ruta de usuarios funcionando' })
})

router.post('/login', login)
router.post('/register', register)
// Proteger la lista de usuarios con JWT
router.get('/list', authMiddleware, listUsers)

// development only: wipe user table and recreate default admin
router.post('/reset', resetUsers)

export default router
