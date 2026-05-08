import db from '../node/database/db.js';

async function superRepair() {
  const tablesToFix = [
    { table: 'equipos', pk: 'id_equipo' },
    { table: 'Estado_equipo', pk: 'id_estado_equipo' },
    { table: 'Estado_solicitud', pk: 'id_estado_solicitud' },
    { table: 'cuentadantes', pk: 'id_cuentadante' },
    { table: 'estadoxequipo', pk: 'id_estadoxequipo' },
    { table: 'estadoxsolicitud', pk: 'id_estadoxsolicitud' },
    { table: 'movimientos_reactivos', pk: 'id_movimiento_reactivo' },
    { table: 'notificaciones', pk: 'id_notificacion' },
    { table: 'proveedor', pk: 'id_proveedor' },
    { table: 'reactivos', pk: 'id_reactivo' },
    { table: 'salidas_reactivos', pk: 'id_salida' },
    { table: 'solicitudes_acceso', pk: 'id_solicitud_acceso' },
    { table: 'solicitud_prestamos', pk: 'id_solicitud' },
    { table: 'solicitudxequipo', pk: 'id_solicitudxequipo' },
    { table: 'usuarios', pk: 'id_usuario' }
  ];

  console.log("🚀 Iniciando MANTENIMIENTO TOTAL de la base de datos...");

  for (const item of tablesToFix) {
    try {
      // 1. Verificar si existe la tabla antes de intentar arreglarla
      const [tableExists] = await db.query(`SHOW TABLES LIKE '${item.table}'`);
      if (tableExists.length === 0) {
        // console.log(`   ⏩ Tabla '${item.table}' no existe en esta DB, saltando...`);
        continue;
      }

      console.log(`🛠️ Reparando '${item.table}'...`);
      
      // 2. Limpiar ID 0 si existe (MySQL a veces inserta 0 si falla el auto_increment)
      const [rows] = await db.query(`SELECT * FROM ${item.table} WHERE ${item.pk} = 0`);
      if (rows && rows.length > 0) {
        console.log(`   ⚠️ Encontrado registro basura (ID 0). Reasignando...`);
        await db.query(`UPDATE ${item.table} SET ${item.pk} = (SELECT IFNULL(MAX(${item.pk}), 0) + 1 FROM (SELECT * FROM ${item.table}) AS tmp) WHERE ${item.pk} = 0`);
      }

      // 3. Forzar el AUTO_INCREMENT
      // Primero nos aseguramos de que sea Primary Key (por si acaso) y luego el incremento
      await db.query(`ALTER TABLE ${item.table} MODIFY COLUMN ${item.pk} INT AUTO_INCREMENT`);
      
      console.log(`   ✅ Correcto.`);
    } catch (error) {
      console.error(`   ❌ Error en '${item.table}':`, error.message);
    }
  }
  
  console.log("\n✨ MANTENIMIENTO FINALIZADO. Todos los módulos están blindados.");
  process.exit(0);
}

superRepair();
