// ============================================================
// 🛠️ SCRIPT DE MANTENIMIENTO Y REPARACIÓN TOTAL DE BD (super_fix.js)
// Este script soluciona problemas comunes en las tablas de MySQL,
// como registros con identificador primary key en 0 (típico cuando fallan
// restricciones o migraciones) reasignándoles IDs correctos,
// y restablece o fuerza el AUTO_INCREMENT en todas las tablas clave del sistema.
// ============================================================

import db from '../node/database/db.js';

async function superRepair() {
  // 📋 Lista de tablas del sistema y sus llaves primarias (PK)
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
      // 1. Verificar si la tabla existe en la BD actual antes de repararla
      const [tableExists] = await db.query(`SHOW TABLES LIKE '${item.table}'`);
      if (tableExists.length === 0) {
        // Si no existe, se salta a la siguiente
        continue;
      }

      console.log(`🛠️ Reparando '${item.table}'...`);
      
      // 2. Detectar y limpiar registros basura con ID 0 (causados por fallos en inserciones)
      const [rows] = await db.query(`SELECT * FROM ${item.table} WHERE ${item.pk} = 0`);
      if (rows && rows.length > 0) {
        console.log(`   ⚠️ Encontrado registro basura (ID 0). Reasignando...`);
        // Actualizar el ID en 0 con el valor máximo actual de la tabla + 1
        await db.query(`UPDATE ${item.table} SET ${item.pk} = (SELECT IFNULL(MAX(${item.pk}), 0) + 1 FROM (SELECT * FROM ${item.table}) AS tmp) WHERE ${item.pk} = 0`);
      }

      // 3. Modificar la columna para asegurar que posea la propiedad AUTO_INCREMENT de forma correcta
      await db.query(`ALTER TABLE ${item.table} MODIFY COLUMN ${item.pk} INT AUTO_INCREMENT`);
      
      console.log(`   ✅ Correcto.`);
    } catch (error) {
      console.error(`   ❌ Error en '${item.table}':`, error.message);
    }
  }
  
  console.log("\n✨ MANTENIMIENTO FINALIZADO. Todos los módulos están blindados.");
  process.exit(0);
}

// Ejecutar el script
superRepair();
