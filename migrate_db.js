import db from './node/database/db.js';

async function run() {
  try {
    await db.authenticate();
    console.log('✅ Connected to database');

    try {
      await db.query('ALTER TABLE reactivos DROP COLUMN formula_reactivo;');
      console.log('✅ Dropped formula_reactivo');
    } catch (e) {
      console.log('⚠️ formula_reactivo drop failed (might already be deleted):', e.message);
    }

    try {
      await db.query('ALTER TABLE reactivos DROP COLUMN nom_reactivo_ingles;');
      console.log('✅ Dropped nom_reactivo_ingles');
    } catch (e) {
      console.log('⚠️ nom_reactivo_ingles drop failed (might already be deleted):', e.message);
    }

    try {
      await db.query('SET FOREIGN_KEY_CHECKS = 0;');
      await db.query('DROP TABLE IF EXISTS fichas;');
      await db.query('SET FOREIGN_KEY_CHECKS = 1;');
      console.log('✅ Dropped table fichas');
    } catch (e) {
      console.log('⚠️ drop fichas failed:', e.message);
    }

    try {
      // First, update existing 'aprobado' or 'pendiente' to 'activo' so the ALTER doesn't fail
      await db.query("UPDATE usuarios SET estado = 'activo' WHERE estado IN ('aprobado', 'pendiente', 'rechazado');");
      await db.query("ALTER TABLE usuarios MODIFY COLUMN estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo';");
      console.log('✅ Altered table usuarios estado ENUM');
    } catch (e) {
      console.log('⚠️ alter usuarios failed:', e.message);
    }

  } catch (error) {
    console.error('Error connecting:', error);
  } finally {
    process.exit();
  }
}

run();
