import db from '../database/db.js'

const inspectTables = async () => {
  try {
    await db.authenticate()
    console.log('📡 Conectado a la base de datos')

    const query = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'ecosystem'
    `
    
    const [tables] = await db.query(query)
    console.log('\n📋 Tablas existentes en la BD:')
    tables.forEach((table, i) => {
      console.log(`${i + 1}. ${table.TABLE_NAME}`)
    })

    console.log('\n⚠️ Tablas requeridas que faltan:')
    const requiredTables = [
      'movimientos_reactivos',
      'equipos',
      'proveedor',
      'usuarios',
      'Estado_equipo',
      'estado_solicitud',
      'reactivos',
      'salidas_reactivos',
      'solicitud',
      'estado_x_equipo',
      'estado_x_solicitud',
      'solicitud_x_equipo'
    ]

    const existingNames = tables.map(t => t.TABLE_NAME.toLowerCase())
    const missing = requiredTables.filter(table => !existingNames.includes(table.toLowerCase()))

    if (missing.length === 0) {
      console.log('✅ Todas las tablas requeridas existen')
    } else {
      missing.forEach(table => {
        console.log(`❌ ${table}`)
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

inspectTables()
