import db from '../database/db.js';

async function main() {
  try {
    await db.authenticate();
    console.log('Conexión DB OK - alter');
    // Añade la columna si no existe
    const sql = `ALTER TABLE estadoxequipo ADD COLUMN observacion VARCHAR(255) NULL;`;
    try {
      await db.query(sql);
      console.log('Columna `observacion` añadida correctamente.');
    } catch (err) {
      console.error('Error al ejecutar ALTER TABLE (es posible que la columna ya exista):', err.message);
    }
  } catch (err) {
    console.error('Error de conexión DB:', err.message);
  } finally {
    await db.close();
  }
}

main();
