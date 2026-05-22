import db from '../database/db.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';
import estadosolicitudModel from '../models/Estado_solicitudModel.js';

async function seed() {
  try {
    await db.authenticate();
    console.log('✅ Conexión establecida.');

    // Seed estado_equipo
    const estadosEquipo = ['disponible', 'mantenimiento', 'solicitado', 'prestado'];
    for (const est of estadosEquipo) {
      const [exists] = await estadoEquipoModel.findOrCreate({
        where: { estado: est }
      });
      console.log(`- Estado equipo: ${est} (${exists.id_estado_equipo})`);
    }

    // Seed estado_solicitud
    const estadosSolicitud = ['generado', 'aceptado', 'prestado', 'entregado', 'cancelado', 'rechazado'];
    for (const est of estadosSolicitud) {
      const [exists] = await estadosolicitudModel.findOrCreate({
        where: { estado: est }
      });
      console.log(`- Estado solicitud: ${est} (${exists.id_estado_solicitud})`);
    }

    console.log('✅ Tablas maestras/lookup seedeadas exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seedeando tablas maestras:', error);
    process.exit(1);
  }
}

seed();
