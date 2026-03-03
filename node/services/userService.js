import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const loginService = async (userEmail, password) => {
    try {
        if (!userEmail || !password) {
            throw new Error('Correo y contraseña son requeridos')
        }

        const user = await userModel.findOne({ where: { userEmail } })
        if (!user) throw new Error('Usuario no encontrado')

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new Error('Credenciales inválidas')

        const payload = { userId: user.userId, userEmail: user.userEmail, admin: user.admin, userType: user.userType }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' })

        return { 
            token, 
            user: { 
                userId: user.userId, 
                userEmail: user.userEmail, 
                admin: user.admin, 
                userType: user.userType,
                credentials: {} 
            } 
        }
    } catch (error) {
        throw error
    }
}

export const registerService = async (userEmail, password, admin = false, userType = 'aprendiz') => {
    try {
        if (!userEmail || !password) {
            throw new Error('Todos los campos son requeridos')
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener mínimo 6 caracteres')
        }

        const tiposValidos = ['aprendiz', 'gestor', 'instructor', 'intructor', 'pasante']
        if (!tiposValidos.includes(userType)) {
            throw new Error('Tipo de usuario inválido. Debe ser: aprendiz, gestor, instructor o pasante')
        }

        const usuarioExistente = await userModel.findOne({ where: { userEmail } })
        if (usuarioExistente) {
            throw new Error('El correo ya está registrado')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const nuevoUsuario = await userModel.create({
            userEmail,
            password: passwordHash,
            userType,
            admin
        })

        // generate a token as we do in login
        const payload = { userId: nuevoUsuario.userId, userEmail: nuevoUsuario.userEmail, admin: nuevoUsuario.admin, userType: nuevoUsuario.userType }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' })

        return {
            token,
            user: {
                userId: nuevoUsuario.userId,
                userEmail: nuevoUsuario.userEmail,
                userType: nuevoUsuario.userType,
                admin: nuevoUsuario.admin,
                credentials: {}
            }
        }
    } catch (error) {
        throw error
    }
}

export const listUsersService = async () => {
    try {
        const users = await userModel.findAll({ attributes: ['userId', 'userEmail', 'userType'] })
        return users
    } catch (error) {
        throw error
    }
}
