import db from '../database/db.js'

const syncTables = async () => {
  try {
    await db.authenticate()
    console.log('✅ Conectado a la base de datos')

    console.log('\n🔄 Sincronizando sin alterar...')
    
    // Sincronizar sin forzar y sin alterar
    await db.sync({ force: false, alter: false })
    
    console.log('✅ Sincronización completada')

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

syncTables()
