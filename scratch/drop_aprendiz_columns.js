import db from '../node/database/db.js';

async function dropAprendizColumns() {
  try {
    await db.authenticate();
    console.log("Eliminando campos de responsable de aprendices...");
    
    const columns = ['nombre_responsable', 'telefono_responsable', 'email_responsable'];
    
    for (const col of columns) {
      try {
        await db.query(`ALTER TABLE aprendices DROP COLUMN ${col};`);
        console.log(`✅ Columna ${col} eliminada.`);
      } catch (e) {
        console.log(`⚠️ Columna ${col} ya no existe o error:`, e.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error al modificar BD:", error);
    process.exit(1);
  }
}

dropAprendizColumns();
