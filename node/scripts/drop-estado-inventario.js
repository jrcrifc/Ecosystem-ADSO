import db from "../database/db.js";   // ← ajusta si tu db.js está en otra ruta

async function dropColumn() {
  try {
    console.log("⏳ Eliminando columna estado_inventario...");

    await db.queryInterface.removeColumn('movimientos_reactivos', 'estado_inventario');

    console.log("✅ ¡Columna 'estado_inventario' eliminada correctamente de la base de datos!");
  } catch (error) {
    console.error("❌ Error al eliminar la columna:", error.message);
  } finally {
    await db.close();   // cierra la conexión
    process.exit(0);
  }
}

dropColumn();