import db from '../database/db.js'
import estadoSolicitudModel from '../models/estadoSolicitudModel.js'
import estadoEquipoModel from '../models/estadoEquipoModel.js'
import userModel from '../models/userModel.js'
import EquiposModel from '../models/EquiposModel.js'
import proveedoresModel from '../models/proveedoresModel.js'
import reactivosModel from '../models/reactivosModel.js'
import salidasModel from '../models/salidasModel.js'
import solicitudModel from '../models/solicitudModel.js'
import solicitudxequipoModel from '../models/solicitudxequipoModel.js'
import estadoxequipoModel from '../models/estadoxequipoModel.js'
import estadoxsolicitudModel from '../models/estadoxsolicitudModel.js'

const syncDatabase = async () => {
  try {
    await db.authenticate()
    console.log('✅ Conectado a la base de datos')

    console.log('\n🔄 Sincronizando modelos...')
    
    // Sincronizar todos los modelos sin forzar (sin borrar datos)
    await db.sync({ alter: true })
    
    console.log('✅ Modelos sincronizados exitosamente')

    // Listar todas las tablas
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'ecosystem'
      ORDER BY TABLE_NAME
    `)

    console.log('\n📋 Tablas en la BD:')
    tables.forEach((table, i) => {
      console.log(`${i + 1}. ${table.TABLE_NAME}`)
    })

    console.log(`\n✅ Total: ${tables.length} tablas`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

syncDatabase()
