import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userModel from '../models/userModel.js'

dotenv.config()

// Ahora valida el JWT y además comprueba que el usuario exista en la BD
export default async function authMiddleware(req, res, next){
  try{
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader) return res.status(401).json({ msg: 'No token provided' })

    const parts = authHeader.split(' ')
    if(parts.length !== 2) return res.status(401).json({ msg: 'Token malformado' })

    const scheme = parts[0]
    const token = parts[1]
    if(!/^Bearer$/i.test(scheme)) return res.status(401).json({ msg: 'Formato de token inválido' })

    const secret = process.env.JWT_SECRET || 'secret'
    let decoded
    try {
      decoded = jwt.verify(token, secret)
    } catch (err) {
      return res.status(401).json({ msg: 'Token inválido' })
    }

    // comprobar en la base de datos que el usuario aún existe
    const user = await userModel.findByPk(decoded.userId)
    if(!user) return res.status(401).json({ msg: 'Usuario no encontrado' })

    // attach minimal user info to req.user
    req.user = {
      userId: user.userId,
      userEmail: user.userEmail,
      admin: user.admin,
      userType: user.userType
    }

    next()
  }catch(err){
    console.error('Auth middleware error:', err)
    return res.status(500).json({ msg: 'Error en autenticación' })
  }
}
