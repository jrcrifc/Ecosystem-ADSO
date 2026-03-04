import { loginService, registerService, listUsersService } from '../services/userService.js'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

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

// Cambiar contraseña
export const changePassword = async (req, res) => {
    try {
        const { userEmail, currentPassword, newPassword } = req.body

        if (!userEmail || !currentPassword || !newPassword) {
            return res.status(400).json({ msg: 'Faltan datos requeridos' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'La nueva contraseña debe tener mínimo 6 caracteres' })
        }

        // Buscar usuario
        const user = await userModel.findOne({ where: { userEmail } })
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        // Verificar contraseña actual
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Contraseña actual incorrecta' })
        }

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Actualizar contraseña
        await user.update({ password: hashedPassword })

        res.json({ msg: 'Contraseña actualizada exitosamente' })
    } catch (error) {
        console.error('Error en changePassword:', error)
        res.status(500).json({ msg: 'Error al cambiar contraseña' })
    }
}

// Eliminar cuenta
export const deleteAccount = async (req, res) => {
    try {
        const { userEmail } = req.body

        if (!userEmail) {
            return res.status(400).json({ msg: 'Email requerido' })
        }

        // Buscar y eliminar usuario
        const user = await userModel.findOne({ where: { userEmail } })
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        await user.destroy()

        res.json({ msg: 'Cuenta eliminada exitosamente' })
    } catch (error) {
        console.error('Error en deleteAccount:', error)
        res.status(500).json({ msg: 'Error al eliminar cuenta' })
    }
}
