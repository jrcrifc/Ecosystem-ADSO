import db from '../database/db.js';
import EstadoXEquipo from '../models/estadoxequipoModel.js';

async function main() {
  try {
    await db.authenticate();
    console.log('Conexión DB OK - seed');
    const sample = await EstadoXEquipo.create({ id_equipo: 1, id_estado_equipo: 1 });
    console.log('Registro creado:', sample.toJSON());
  } catch (err) {
    console.error('Error al insertar seed:', err.message);
  } finally {
    await db.close();
  }
}

main();
