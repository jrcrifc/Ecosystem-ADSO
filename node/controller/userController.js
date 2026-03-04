import { loginService, registerService, listUsersService } from '../services/userService.js'
import userModel from '../models/userModel.js'

export const login = async (req, res) => {
    try {
        const { userEmail, password } = req.body
        const result = await loginService(userEmail, password)
        res.json(result)
    } catch (error) {
        console.error('Error en login:', error)
        res.status(401).json({ msg: error.message || 'Error en el servidor' })
    }
}

export const register = async (req, res) => {
    try {
        const { userEmail, password, admin = false, userType = 'aprendiz' } = req.body
        console.log('📝 Datos recibidos:', { userEmail, password: '***', userType, admin })
        
        const result = await registerService(userEmail, password, admin, userType)
        // result now contains token and user
        res.status(201).json({
            msg: 'Usuario registrado exitosamente',
            ...result
        })
    } catch (error) {
        console.error('❌ Error en register:', error.message)
        console.error('Stack:', error.stack)
        res.status(400).json({ msg: error.message || 'Error: ' + error.message })
    }
}

export const listUsers = async (req, res) => {
    try {
        const users = await listUsersService()
        res.json({ count: users.length, users })
    } catch (error) {
        console.error('Error listUsers:', error.message)
        res.status(500).json({ msg: `Error: ${error.message}` })
    }
}

// development helper to wipe and recreate users table
export const resetUsers = async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ msg: 'Reset allowed only in development mode' })
    }
    try {
        await userModel.sync({ force: true })
        // reseed admin + normal account
        const bcryptModule = await import('bcrypt')
        const adminHash = await bcryptModule.default.hash('Admin1234', 10)
        const userHash = await bcryptModule.default.hash('User1234', 10)
        await userModel.bulkCreate([
            { userEmail: 'admin@example.com', password: adminHash, userType: 'gestor', admin: true },
            { userEmail: 'user@example.com', password: userHash, userType: 'aprendiz', admin: false }
        ])
        res.json({ msg: 'Usuarios table reset and default users created' })
    } catch (error) {
        console.error('Error resetUsers:', error)
        res.status(500).json({ msg: error.message })
    }
}
