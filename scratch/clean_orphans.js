import db from '../node/database/db.js';

async function cleanOrphans() {
  try {
    await db.authenticate();
    console.log("Limpiando registros huérfanos para poder crear foreign keys...");

    // 1. Solicitudes de préstamo
    let [res] = await db.query(`
      DELETE s FROM solicitud_prestamos s
      LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL;
    `);
    console.log(`Solicitudes eliminadas por usuario huérfano: ${res.affectedRows}`);

    // 2. Equipos
    [res] = await db.query(`
      DELETE e FROM equipos e
      LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL AND e.id_usuario IS NOT NULL;
    `);
    console.log(`Equipos eliminados/actualizados por usuario huérfano: ${res.affectedRows}`);
    
    // We should probably just SET NULL for equipos.id_usuario if it's orphaned, rather than deleting the equipment
    await db.query(`
      UPDATE equipos e
      LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
      SET e.id_usuario = NULL
      WHERE u.id_usuario IS NULL AND e.id_usuario IS NOT NULL;
    `);
    
    // 3. Fichas sin programa (set null)
    await db.query(`
      UPDATE fichas f
      LEFT JOIN programas p ON f.id_programa = p.id_programa
      SET f.id_programa = NULL
      WHERE p.id_programa IS NULL AND f.id_programa IS NOT NULL;
    `);

    // 4. Usuarios sin ficha o programa (set null)
    await db.query(`
      UPDATE usuarios u
      LEFT JOIN fichas f ON u.id_ficha = f.id_ficha
      SET u.id_ficha = NULL
      WHERE f.id_ficha IS NULL AND u.id_ficha IS NOT NULL;
    `);
    
    await db.query(`
      UPDATE usuarios u
      LEFT JOIN programas p ON u.id_programa = p.id_programa
      SET u.id_programa = NULL
      WHERE p.id_programa IS NULL AND u.id_programa IS NOT NULL;
    `);

    // 5. Aprendices
    [res] = await db.query(`
      DELETE a FROM aprendices a
      LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL AND a.id_usuario IS NOT NULL;
    `);
    console.log(`Aprendices eliminados por usuario huérfano: ${res.affectedRows}`);

    // 6. Instructores
    [res] = await db.query(`
      DELETE i FROM instructores i
      LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL AND i.id_usuario IS NOT NULL;
    `);
    console.log(`Instructores eliminados por usuario huérfano: ${res.affectedRows}`);

    console.log("Limpieza terminada.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

cleanOrphans();
