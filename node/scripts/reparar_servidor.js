import db from '../database/db.js';

async function repararServidor() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await db.authenticate();
    console.log('✅ Conexión establecida.');

    await db.query('SET FOREIGN_KEY_CHECKS = 0;');

    console.log('🛠️ Reparando y asegurando tablas del sistema...');

    // 1. PROVEEDOR
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`proveedor\` (
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

    // 2. REACTIVOS
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`reactivos\` (
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

    // Recrear movimientos_reactivos con las columnas exactas que Sequelize espera
    await db.query('DROP TABLE IF EXISTS `movimientos_reactivos`;');
    await db.query(`
      CREATE TABLE \`movimientos_reactivos\` (
        \`id_movimiento_reactivo\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_reactivo\` int(11) NOT NULL,
        \`cantidad_inicial\` decimal(10,3) DEFAULT 0.000,
        \`lote\` varchar(255) DEFAULT NULL,
        \`id_proveedor\` int(11) DEFAULT NULL,
        \`cantidad_salida\` decimal(10,3) DEFAULT 0.000,
        \`fecha_vencimiento\` date DEFAULT NULL,
        \`estado\` tinyint(4) NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_movimiento_reactivo\`),
        KEY \`id_reactivo\` (\`id_reactivo\`),
        KEY \`id_proveedor\` (\`id_proveedor\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 3. SALIDAS REACTIVOS
    await db.query('DROP TABLE IF EXISTS `salidas_reactivos`;');
    await db.query(`
      CREATE TABLE \`salidas_reactivos\` (
        \`id_salida\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_movimiento_reactivo\` int(11) NOT NULL,
        \`fecha_salida\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`cantidad\` decimal(10,3) NOT NULL,
        \`createdat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_salida\`),
        KEY \`id_movimiento_reactivo\` (\`id_movimiento_reactivo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 4. ESTADO EQUIPO
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`estado_equipo\` (
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

    // 5. EQUIPOS
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`equipos\` (
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

    // 6. ESTADO X EQUIPO
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`estadoxequipo\` (
        \`id_estadoxequipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_equipo\` int(11) NOT NULL,
        \`id_estado_equipo\` int(11) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estadoxequipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 7. ESTADO SOLICITUD
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`estado_solicitud\` (
        \`id_estado_solicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`estado\` enum('generado','aceptado','prestado','entregado','cancelado','rechazado') NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estado_solicitud\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    await db.query(`
      INSERT INTO \`estado_solicitud\` (\`id_estado_solicitud\`, \`estado\`) VALUES
      (1, 'generado'),
      (2, 'aceptado'),
      (3, 'prestado'),
      (4, 'entregado'),
      (5, 'cancelado'),
      (6, 'rechazado')
      ON DUPLICATE KEY UPDATE \`estado\` = VALUES(\`estado\`);
    `);

    // 8. SOLICITUD PRESTAMOS (con las columnas exactas de solicitudModel.js)
    await db.query('DROP TABLE IF EXISTS `solicitudxequipo`;');
    await db.query('DROP TABLE IF EXISTS `estadoxsolicitud`;');
    await db.query('DROP TABLE IF EXISTS `solicitud_prestamos`;');

    await db.query(`
      CREATE TABLE \`solicitud_prestamos\` (
        \`id_solicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`fecha_inicio\` datetime DEFAULT NULL,
        \`fecha_fin\` datetime DEFAULT NULL,
        \`id_usuario\` int(11) NOT NULL,
        \`estado\` tinyint(4) NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_solicitud\`),
        KEY \`id_usuario\` (\`id_usuario\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 9. SOLICITUD X EQUIPO
    await db.query(`
      CREATE TABLE \`solicitudxequipo\` (
        \`id_solicitudxequipo\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_solicitud\` int(11) NOT NULL,
        \`id_equipo\` int(11) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_solicitudxequipo\`),
        KEY \`id_solicitud\` (\`id_solicitud\`),
        KEY \`id_equipo\` (\`id_equipo\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 10. ESTADO X SOLICITUD
    await db.query(`
      CREATE TABLE \`estadoxsolicitud\` (
        \`id_estadoxsolicitud\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_solicitud\` int(11) NOT NULL,
        \`id_estado_solicitud\` int(11) NOT NULL,
        \`createdat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedat\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_estadoxsolicitud\`),
        KEY \`id_solicitud\` (\`id_solicitud\`),
        KEY \`id_estado_solicitud\` (\`id_estado_solicitud\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await db.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('✅ ¡Tablas reparadas exitosamente con la estructura exacta que requiere el sistema!');
    console.log('🔒 La tabla `usuarios` se mantuvo 100% intacta.');
  } catch (error) {
    console.error('❌ Error reparando la base de datos:', error);
  } finally {
    process.exit();
  }
}

repararServidor();
