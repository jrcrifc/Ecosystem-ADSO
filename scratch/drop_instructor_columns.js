import db from '../node/database/db.js';

async function dropColumns() {
  try {
    await db.authenticate();
    console.log("Eliminando columnas programa y correo_personal de instructores...");
    
    try {
      await db.query(`ALTER TABLE instructores DROP COLUMN programa;`);
      console.log("✅ Columna programa eliminada.");
    } catch (e) {
      console.log("⚠️ Columna programa ya no existe o error:", e.message);
    }

    try {
      await db.query(`ALTER TABLE instructores DROP COLUMN correo_personal;`);
      console.log("✅ Columna correo_personal eliminada.");
    } catch (e) {
      console.log("⚠️ Columna correo_personal ya no existe o error:", e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error al modificar BD:", error);
    process.exit(1);
  }
}

dropColumns();
