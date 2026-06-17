import db from '../node/database/db.js';
import '../node/models/associations.js';

async function syncAlter() {
  try {
    await db.authenticate();
    console.log("Sincronizando modelos con la BD para ver qué falta...");
    // This will print the SQL queries it executes
    await db.sync({ alter: true, logging: console.log });
    console.log("¡Sincronización terminada!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

syncAlter();
