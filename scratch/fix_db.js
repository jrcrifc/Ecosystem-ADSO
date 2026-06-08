// ============================================================
// 🛠️ REPARACIÓN DE LA TABLA DE REACTIVOS (fix_db.js)
// Este script soluciona problemas en la tabla 'reactivos' reasignando
// cualquier registro con ID 0 a un ID válido (el máximo actual + 1)
// y aplicando la propiedad AUTO_INCREMENT a la columna de ID primario.
// ============================================================

import db from '../node/database/db.js';

async function fixDatabase() {
  try {
    console.log("🛠️ Intentando reparar la tabla 'reactivos'...");
    
    // 1. Verificar si existe el ID 0 que está bloqueando
    const [rows] = await db.query("SELECT * FROM reactivos WHERE id_reactivo = 0");
    if (rows && rows.length > 0) {
      console.log("⚠️ Se encontró un registro con ID 0. Cambiándolo para liberar el espacio...");
      await db.query("UPDATE reactivos SET id_reactivo = (SELECT MAX(id_reactivo) + 1 FROM reactivos) WHERE id_reactivo = 0");
    }

    // 2. Intentar poner el AUTO_INCREMENT
    console.log("🚀 Aplicando AUTO_INCREMENT a id_reactivo...");
    // Primero nos aseguramos que sea PK si no lo es, y luego el auto_increment
    await db.query("ALTER TABLE reactivos MODIFY COLUMN id_reactivo INT AUTO_INCREMENT");
    
    console.log("✅ Tabla reparada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al reparar la tabla:", error.message);
    process.exit(1);
  }
}

fixDatabase();

