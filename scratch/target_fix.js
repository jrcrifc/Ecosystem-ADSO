import db from '../node/database/db.js';

async function targetFix() {
  const tables = [
    { name: 'solicitud_prestamos', pk: 'id_solicitud' },
    { name: 'solicitudxequipo', pk: 'id_solicitudxequipo' },
    { name: 'usuarios', pk: 'id_usuario' }
  ];

  for (const table of tables) {
    try {
      console.log(`🛠️ Intentando reparación forzada de '${table.name}'...`);
      
      // 1. Limpiar posibles IDs 0
      await db.query(`UPDATE ${table.name} SET ${table.pk} = (SELECT IFNULL(MAX(${table.pk}), 0) + 1 FROM (SELECT * FROM ${table.name}) AS tmp) WHERE ${table.pk} = 0`);
      
      // 2. Asegurar Primary Key y Auto Increment en un solo paso
      // Usamos MODIFY y agregamos PRIMARY KEY al final del tipo
      await db.query(`ALTER TABLE ${table.name} MODIFY COLUMN ${table.pk} INT AUTO_INCREMENT PRIMARY KEY`);
      
      console.log(`✅ '${table.name}' reparada con éxito.`);
    } catch (error) {
      console.log(`⚠️ No se pudo aplicar con PRIMARY KEY (tal vez ya es PK). Intentando solo MODIFY AUTO_INCREMENT...`);
      try {
        await db.query(`ALTER TABLE ${table.name} MODIFY COLUMN ${table.pk} INT AUTO_INCREMENT`);
        console.log(`✅ '${table.name}' reparada solo con AUTO_INCREMENT.`);
      } catch (innerError) {
        console.error(`❌ Error fatal en '${table.name}':`, innerError.message);
      }
    }
  }
  process.exit(0);
}

targetFix();
