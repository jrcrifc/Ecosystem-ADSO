import db from '../node/database/db.js';

async function clearData() {
  try {
    await db.authenticate();
    console.log("Conectado. Iniciando limpieza forzada...");
    
    // Desactivar comprobación de llaves foráneas para borrar en cascada de forma manual
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Borramos todas las notificaciones asociadas a los usuarios que vamos a borrar
    await db.query(`
      DELETE n FROM notificaciones n
      INNER JOIN usuarios u ON n.id_usuario_destino = u.id_usuario
      WHERE u.rol IN ('Instructor', 'Aprendiz');
    `);
    console.log("Notificaciones de instructores y aprendices borradas.");

    // Borramos dependencias (instructores y aprendices)
    await db.query(`TRUNCATE TABLE instructores;`);
    console.log("Tabla instructores vaciada.");

    await db.query(`TRUNCATE TABLE aprendices;`);
    console.log("Tabla aprendices vaciada.");

    // Finalmente borramos los usuarios asociados a esos roles
    const [result] = await db.query(`DELETE FROM usuarios WHERE rol IN ('Instructor', 'Aprendiz');`);
    console.log(`Usuarios eliminados: ${result.affectedRows}`);

    // Volver a activar las llaves foráneas
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log("Limpieza exitosa.");
    process.exit(0);
  } catch (error) {
    console.error("Error limpiando BD:", error);
    process.exit(1);
  }
}

clearData();
