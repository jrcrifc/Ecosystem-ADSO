import db from '../database/db.js';

async function limpiarYReparar() {
  try {
    await db.authenticate();
    console.log('✅ Conexión establecida con la base de datos MySQL.');

    // Desactivar temporalmente revisión de claves foráneas
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');

    console.log('🧹 Limpiando y preparando tablas de Equipos, Reactivos y Proveedores...');

    // 1. PROVEEDOR
    await db.query('DROP TABLE IF EXISTS `proveedor`;');
    await db.query(`
      CREATE TABLE \`proveedor\` (
        \`id_proveedor\` int(11) NOT NULL AUTO_INCREMENT,
        \`nit_empresa\` varchar(255) DEFAULT NULL,
        \`nom_proveedor\` varchar(255) DEFAULT NULL,
        \`apel_proveedor\` varchar(255) DEFAULT NULL,
        \`tel_proveedor\` varchar(255) DEFAULT NULL,
        \`dir_proveedor\` varchar(255) DEFAULT NULL,
        \`estado\` tinyint(4) NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_proveedor\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('  ✅ Tabla `proveedor` creada y limpia.');

    // 2. REACTIVOS
    await db.query('DROP TABLE IF EXISTS `salidas_reactivos`;');
    await db.query('DROP TABLE IF EXISTS `movimientos_reactivos`;');
    await db.query('DROP TABLE IF EXISTS `reactivos`;');
    await db.query(`
      CREATE TABLE \`reactivos\` (
        \`id_reactivo\` int(11) NOT NULL AUTO_INCREMENT,
        \`presentacion_reactivo\` enum('kilogramos','gramos','litros','sobres') NOT NULL,
        \`nom_reactivo\` varchar(255) DEFAULT NULL,
        \`color_almacenamiento\` enum('Peligro para la salud','Inflamabilidad','N/A','Peligro de contacto','Riesgo minimo','Riesgo de reactividad') DEFAULT NULL,
        \`color_stand\` enum('Morado','Negro','Agua marina','Rosado','Fucsia','Gris claro','Ciruela','Purpura','Marron','Gris oscuro','Cafe') DEFAULT NULL,
        \`stand\` varchar(255) DEFAULT NULL,
        \`columna\` varchar(255) DEFAULT NULL,
        \`fila\` varchar(255) DEFAULT NULL,
        \`clasificacion_reactivo\` enum('Peligro de contacto','Peligro de reactividad','Peligro de inflamabilidad','Riesgo minimo','Peligro para salud') DEFAULT NULL,
        \`estado\` tinyint(4) NOT NULL DEFAULT 1,
        \`createdat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_reactivo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('  ✅ Tabla `reactivos` creada y limpia.');

    // 3. MOVIMIENTOS Y SALIDAS DE REACTIVOS
    await db.query(`
      CREATE TABLE \`movimientos_reactivos\` (
        \`id_movimiento\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_reactivo\` int(11) NOT NULL,
        \`tipo_movimiento\` enum('ingreso','salida','ajuste') NOT NULL,
        \`cantidad\` decimal(10,2) NOT NULL,
        \`fecha_movimiento\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`id_usuario\` int(11) NOT NULL,
        \`id_proveedor\` int(11) DEFAULT NULL,
        \`motivo\` varchar(255) DEFAULT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_movimiento\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await db.query(`
      CREATE TABLE \`salidas_reactivos\` (
        \`id_salida\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_reactivo\` int(11) NOT NULL,
        \`cantidad\` decimal(10,2) NOT NULL,
        \`fecha_salida\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`id_usuario\` int(11) NOT NULL,
        \`destino\` varchar(255) DEFAULT NULL,
        \`observaciones\` text DEFAULT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_salida\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('  ✅ Tablas `movimientos_reactivos` y `salidas_reactivos` creadas y limpias.');

    // 4. ESTADO EQUIPO (Catálogo necesario)
    await db.query('DROP TABLE IF EXISTS `estadoxequipo`;');
    await db.query('DROP TABLE IF EXISTS `solicitudxequipo`;');
    await db.query('DROP TABLE IF EXISTS `equipos`;');
    await db.query('DROP TABLE IF EXISTS `estado_equipo`;');
    await db.query(`
      CREATE TABLE \`estado_equipo\` (
        \`id_estado_equipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`estado\` enum('disponible','mantenimiento','solicitado','prestado') NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estado_equipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    await db.query(`
      INSERT INTO \`estado_equipo\` (\`id_estado_equipo\`, \`estado\`) VALUES
      (1, 'disponible'),
      (2, 'mantenimiento'),
      (3, 'solicitado'),
      (4, 'prestado')
      ON DUPLICATE KEY UPDATE \`estado\` = VALUES(\`estado\`);
    `);
    console.log('  ✅ Tabla `estado_equipo` lista con sus estados predeterminados.');

    // 5. EQUIPOS
    await db.query(`
      CREATE TABLE \`equipos\` (
        \`id_equipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`grupo_equipo\` enum('Equipo de Laboratorio') NOT NULL DEFAULT 'Equipo de Laboratorio',
        \`nom_equipo\` varchar(255) NOT NULL,
        \`marca_equipo\` varchar(255) DEFAULT NULL,
        \`no_placa\` varchar(255) DEFAULT NULL,
        \`id_usuario\` int(11) DEFAULT NULL,
        \`observaciones\` text DEFAULT NULL,
        \`foto_equipo\` varchar(1000) DEFAULT NULL,
        \`estado\` tinyint(4) NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_equipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('  ✅ Tabla `equipos` creada y limpia.');

    // 6. ESTADO X EQUIPO
    await db.query(`
      CREATE TABLE \`estadoxequipo\` (
        \`id_estadoxequipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_equipo\` int(11) NOT NULL,
        \`id_estado_equipo\` int(11) NOT NULL,
        \`fecha_cambio\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`id_usuario\` int(11) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estadoxequipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 7. ESTADO SOLICITUD Y SOLICITUDES
    await db.query('DROP TABLE IF EXISTS `estadoxsolicitud`;');
    await db.query('DROP TABLE IF EXISTS `solicitud_prestamos`;');
    await db.query('DROP TABLE IF EXISTS `estado_solicitud`;');
    await db.query(`
      CREATE TABLE \`estado_solicitud\` (
        \`id_estado_solicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`estado\` enum('generado','aceptado','prestado','entregado','cancelado','rechazado') NOT NULL,
        \`activo\` tinyint(4) DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estado_solicitud\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    await db.query(`
      INSERT INTO \`estado_solicitud\` (\`id_estado_solicitud\`, \`estado\`, \`activo\`) VALUES
      (1, 'generado', 1),
      (2, 'aceptado', 1),
      (3, 'prestado', 1),
      (5, 'entregado', 1),
      (6, 'cancelado', 1)
      ON DUPLICATE KEY UPDATE \`estado\` = VALUES(\`estado\`);
    `);

    await db.query(`
      CREATE TABLE \`solicitud_prestamos\` (
        \`id_solicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_usuario_solicitante\` int(11) NOT NULL,
        \`fecha_solicitud\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`fecha_prestamo\` datetime DEFAULT NULL,
        \`fecha_devolucion\` datetime DEFAULT NULL,
        \`observaciones\` text DEFAULT NULL,
        \`id_estado_solicitud\` int(11) NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_solicitud\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await db.query(`
      CREATE TABLE \`solicitudxequipo\` (
        \`id_solicitudxequipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_solicitud\` int(11) NOT NULL,
        \`id_equipo\` int(11) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_solicitudxequipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await db.query(`
      CREATE TABLE \`estadoxsolicitud\` (
        \`id_estadoxsolicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_solicitud\` int(11) NOT NULL,
        \`id_estado_solicitud\` int(11) NOT NULL,
        \`fecha_cambio\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`id_usuario\` int(11) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estadoxsolicitud\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('  ✅ Tablas de Solicitudes y SolicitudxEquipo creadas y limpias.');

    // Reactivar Foreign Key Checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('\n🔒 TABLAS PROTEGIDAS E INTACTAS:');
    console.log('  🛡️ `usuarios` (Tus credenciales y perfiles NO fueron tocados)');
    console.log('  🛡️ `instructores` (Intacta)');
    console.log('  🛡️ `auditoria` (Intacta)');

    console.log('\n🎉 ¡PROCESO COMPLETADO CON ÉXITO! Las tablas de reactivos, equipos y proveedores quedaron limpias y con su estructura perfecta.');
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error);
  } finally {
    process.exit();
  }
}

limpiarYReparar();
