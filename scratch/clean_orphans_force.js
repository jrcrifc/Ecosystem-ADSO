import db from '../node/database/db.js';

async function cleanOrphansForced() {
  try {
    await db.authenticate();
    console.log("Limpiando registros huérfanos FORZADO...");
    
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 1. Eliminar hijos de solicitudes huérfanas
    await db.query(`
      DELETE es FROM estadoxsolicitud es
      LEFT JOIN solicitud_prestamos s ON es.id_solicitud = s.id_solicitud
      LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL;
    `);

    await db.query(`
      DELETE se FROM solicitudxequipo se
      LEFT JOIN solicitud_prestamos s ON se.id_solicitud = s.id_solicitud
      LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL;
    `);

    // 2. Solicitudes de préstamo
    let [res] = await db.query(`
      DELETE s FROM solicitud_prestamos s
      LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL;
    `);
    console.log(`Solicitudes eliminadas: ${res.affectedRows}`);

    // 3. Equipos
    await db.query(`
      UPDATE equipos e
      LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
      SET e.id_usuario = NULL
      WHERE u.id_usuario IS NULL AND e.id_usuario IS NOT NULL;
    `);
    
    // 4. Fichas sin programa
    await db.query(`
      UPDATE fichas f
      LEFT JOIN programas p ON f.id_programa = p.id_programa
      SET f.id_programa = NULL
      WHERE p.id_programa IS NULL AND f.id_programa IS NOT NULL;
    `);

    // 5. Usuarios sin ficha o programa
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

    // 6. Aprendices y su FK id_programa (no existe en model pero por si acaso)
    [res] = await db.query(`
      DELETE a FROM aprendices a
      LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL AND a.id_usuario IS NOT NULL;
    `);
    
    await db.query(`
      UPDATE aprendices a
      LEFT JOIN fichas f ON a.id_ficha = f.id_ficha
      SET a.id_ficha = NULL
      WHERE f.id_ficha IS NULL AND a.id_ficha IS NOT NULL;
    `);

    // 7. Instructores
    [res] = await db.query(`
      DELETE i FROM instructores i
      LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
      WHERE u.id_usuario IS NULL AND i.id_usuario IS NOT NULL;
    `);
    
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log("Limpieza terminada.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

cleanOrphansForced();
