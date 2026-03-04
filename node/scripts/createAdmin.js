import db from '../database/db.js'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

const createAdmin = async () => {
  try {
    await db.authenticate()
    console.log('📡 Conectado a la base de datos')

    const adminEmail = 'juanpablotocaremaavila@gmail.com'
    const adminPassword = 'Admin123456'

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findOne({ where: { userEmail: adminEmail } })
    
    if (existingUser) {
      console.log('❌ El usuario ya existe')
      process.exit(1)
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Crear administrador
    await userModel.create({
      userEmail: adminEmail,
      password: hashedPassword,
      userType: 'gestor',
      admin: true
    })

    console.log('✅ Administrador creado exitosamente')
    console.log('📧 Email: ' + adminEmail)
    console.log('🔑 Contraseña: ' + adminPassword)
    console.log('\n⚠️  Guarda estas credenciales en un lugar seguro')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al crear administrador:', error)
    process.exit(1)
  }
}

createAdmin()
