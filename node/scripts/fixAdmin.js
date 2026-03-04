import db from '../database/db.js'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

const fixAdmin = async () => {
  try {
    await db.authenticate()
    console.log('📡 Conectado a la base de datos')

    const adminEmail = 'juanpablotocaremaavila@gmail.com'
    const adminPassword = 'Admin123456'

    // Buscar usuario existente
    const user = await userModel.findOne({ where: { userEmail: adminEmail } })
    
    if (user) {
      console.log('✅ Usuario encontrado, actualizando contraseña...')
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      await user.update({ password: hashedPassword })
      console.log('✅ Contraseña actualizada')
    } else {
      console.log('⚠️ Usuario no encontrado, creando...')
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      await userModel.create({
        userEmail: adminEmail,
        password: hashedPassword,
        userType: 'gestor',
        admin: true
      })
      console.log('✅ Usuario creado')
    }

    console.log('\n✅ Credenciales finales:')
    console.log('📧 Email: ' + adminEmail)
    console.log('🔑 Contraseña: ' + adminPassword)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixAdmin()
