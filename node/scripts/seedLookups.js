// ============================================================
// 🌱 SCRIPT DE ALIMENTACIÓN DE LOOKUPS / TABLAS MAESTRAS (seedLookups.js)
// Este script se encarga de poblar con registros iniciales (seed) las tablas
// de lookups o tablas maestras de estados en el sistema:
//   1. Estados posibles de un equipo (disponible, solicitado, etc.)
//   2. Estados del ciclo de una solicitud (generado, aceptado, etc.)
// Asegura la consistencia referencial de las llaves foráneas.
// Ejecución:
//   node scripts/seedLookups.js
// ============================================================

import db from '../database/db.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';
import estadosolicitudModel from '../models/Estado_solicitudModel.js';

async function seed() {
  try {
    await db.authenticate();
    console.log('✅ Conexión establecida.');

    // 1. Sembrar registros de estados para los equipos físicos
    const estadosEquipo = ['disponible', 'mantenimiento', 'solicitado', 'prestado'];
    for (const est of estadosEquipo) {
      // findOrCreate evita la duplicación del registro si ya se ejecutó el script
      const [exists] = await estadoEquipoModel.findOrCreate({
        where: { estado: est }
      });
      console.log(`- Estado equipo: ${est} (${exists.id_estado_equipo})`);
    }

    // 2. Sembrar registros de estados para las solicitudes de préstamo
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
