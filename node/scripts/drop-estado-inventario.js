// ============================================================
// 🗑️ SCRIPT DE MIGRACIÓN: ELIMINAR COLUMNA SOBRANTE (drop-estado-inventario.js)
// Este script elimina la columna deprecada 'estado_inventario' de la tabla
// 'movimientos_reactivos'. Se utiliza para realizar correcciones sobre el
// esquema sin requerir wipes completos de la base de datos.
// Ejecución:
//   node scripts/drop-estado-inventario.js
// ============================================================

import db from "../database/db.js";

async function dropColumn() {
  try {
    console.log("⏳ Eliminando columna deprecada 'estado_inventario'...");

    // Llamar a la interfaz de queries de Sequelize para eliminar físicamente la columna
    await db.queryInterface.removeColumn('movimientos_reactivos', 'estado_inventario');

    console.log("✅ ¡Columna 'estado_inventario' eliminada correctamente de la base de datos!");
  } catch (error) {
    console.error("❌ Error al eliminar la columna:", error.message);
  } finally {
    // Cerrar de forma limpia la conexión de Sequelize a MySQL
    await db.close();
    process.exit(0);
  }
}

dropColumn();