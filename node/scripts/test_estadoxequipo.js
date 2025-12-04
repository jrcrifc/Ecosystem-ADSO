import db from '../database/db.js';
import EstadoXEquipo from '../models/estadoxequipoModel.js';

async function main() {
  try {
    await db.authenticate();
    console.log('Conexión DB OK');
    const rows = await EstadoXEquipo.findAll({ raw: true });
    console.log('Filas encontradas:', rows.length);
    console.dir(rows, { depth: null });
  } catch (err) {
    console.error('Error en diagnóstico:', err.message);
  } finally {
    await db.close();
  }
}

main();
