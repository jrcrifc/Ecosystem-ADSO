// ============================================================
// 🛠️ REPARACIÓN COMPLETA DE TABLAS DEL INVENTARIO (full_fix.js)
// Este script automatiza la limpieza y corrección de llaves primarias
// con valor 0 y la habilitación de AUTO_INCREMENT para las tablas
// clave de inventario: reactivos, movimientos, salidas y proveedores.
// ============================================================

import db from '../node/database/db.js';

async function fullRepair() {
  const tablesToFix = [
    { table: 'movimientos_reactivos', pk: 'id_movimiento_reactivo' },
    { table: 'salidas_reactivos', pk: 'id_salida' },
    { table: 'proveedor', pk: 'id_proveedor' },
    { table: 'reactivos', pk: 'id_reactivo' }
  ];

  for (const item of tablesToFix) {
    try {
      console.log(`🛠️ Reparando tabla '${item.table}'...`);
      
      // 1. Limpiar ID 0 si existe
      const [rows] = await db.query(`SELECT * FROM ${item.table} WHERE ${item.pk} = 0`);
      if (rows && rows.length > 0) {
        console.log(`   ⚠️ Encontrado ID 0 en ${item.table}. Cambiándolo...`);
        await db.query(`UPDATE ${item.table} SET ${item.pk} = (SELECT IFNULL(MAX(${item.pk}), 0) + 1 FROM (SELECT * FROM ${item.table}) AS tmp) WHERE ${item.pk} = 0`);
      }

      // 2. Aplicar AUTO_INCREMENT
      console.log(`   🚀 Aplicando AUTO_INCREMENT a ${item.pk}...`);
      await db.query(`ALTER TABLE ${item.table} MODIFY COLUMN ${item.pk} INT AUTO_INCREMENT`);
      
      console.log(`✅ Tabla '${item.table}' reparada.`);
    } catch (error) {
      console.error(`❌ Error en tabla '${item.table}':`, error.message);
    }
  }
  process.exit(0);
}

fullRepair();

