// ============================================================
// 🔧 SCRIPT DE MIGRACIÓN DE BASE DE DATOS
// Ejecutar UNA SOLA VEZ antes de arrancar el servidor en producción.
// Uso: node scripts/migrate.js
// ============================================================

import db from '../database/db.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Buscar y cargar .env
const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env')
];
for (const p of paths) {
    if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        break;
    }
}

async function migrate() {
    try {
        await db.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // 1. Asegurar ENUM de estado de usuarios
        console.log('📦 Migrando ENUM de usuarios.estado...');
        await db.query(`
          ALTER TABLE usuarios 
          MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado', 'inactivo') 
          NOT NULL DEFAULT 'pendiente';
        `).catch(err => console.warn("⚠️ Advertencia:", err.message));

        // 2. Asegurar columna tipo_documento en usuarios
        console.log('📦 Asegurando columna tipo_documento...');
        await db.query(`
          ALTER TABLE usuarios 
          ADD COLUMN tipo_documento VARCHAR(50) NULL DEFAULT 'CC';
        `).catch(err => {
            if (!err.message.toLowerCase().includes("duplicate column") && !err.message.toLowerCase().includes("already exists")) {
                console.warn("⚠️ Advertencia:", err.message);
            } else {
                console.log('   ↳ tipo_documento ya existe, OK');
            }
        });

        // 3. Migrar ENUM de instructores.tipo_vinculacion
        console.log('📦 Migrando ENUM de instructores.tipo_vinculacion...');
        
        // Primero ampliar para soportar valores viejos y nuevos
        await db.query(`
          ALTER TABLE instructores
          MODIFY COLUMN tipo_vinculacion ENUM('Instructor de planta', 'Instructor por prestacion de servicios', 'Planta', 'Contrato') 
          NULL DEFAULT NULL;
        `).catch(err => console.warn("⚠️ Advertencia:", err.message));

        // Migrar valores antiguos a los nuevos
        await db.query(`UPDATE instructores SET tipo_vinculacion = 'Instructor de planta' WHERE tipo_vinculacion = 'Planta';`).catch(() => null);
        await db.query(`UPDATE instructores SET tipo_vinculacion = 'Instructor por prestacion de servicios' WHERE tipo_vinculacion = 'Contrato';`).catch(() => null);

        // Dejar solo los valores correctos
        await db.query(`
          ALTER TABLE instructores
          MODIFY COLUMN tipo_vinculacion ENUM('Instructor de planta', 'Instructor por prestacion de servicios') 
          NULL DEFAULT NULL;
        `).catch(err => console.warn("⚠️ Advertencia:", err.message));

        console.log('');
        console.log('✅ ¡Migración completada exitosamente!');
        console.log('   Ahora puedes arrancar el servidor con: npm start');

    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    } finally {
        await db.close();
        process.exit(0);
    }
}

migrate();
