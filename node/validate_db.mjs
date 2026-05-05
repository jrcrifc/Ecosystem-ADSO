/**
 * Script de validación de Base de Datos
 * Verifica que todos los campos requeridos existan en la BD
 * Ejecutar: node validate_db.mjs
 */

import db from './database/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const DB_NAME = process.env.DB_NAME || 'ecosystem';

console.log('🔍 Iniciando validación de Base de Datos...\n');

try {
    await db.authenticate();
    console.log('✅ Conexión a BD exitosa\n');

    // ============================================================
    // 1️⃣ VALIDAR TABLA REACTIVOS
    // ============================================================
    console.log('📊 Validando tabla: reactivos');
    const [reactivosColumns] = await db.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'reactivos' AND TABLE_SCHEMA = ?
        ORDER BY ORDINAL_POSITION
    `, { replacements: [DB_NAME] });

    if (reactivosColumns.length === 0) {
        console.error('❌ La tabla reactivos NO existe. Ejecuta: npm start');
    } else {
        console.log(`   ✅ Campos encontrados: ${reactivosColumns.length}`);
        
        const requiredFields = ['id_reactivo', 'nom_reactivo'];
        requiredFields.forEach(field => {
            const fieldData = reactivosColumns.find(col => col.COLUMN_NAME === field);
            if (fieldData) {
                console.log(`   ✅ ${field} (${fieldData.COLUMN_TYPE})`);
            } else {
                console.log(`   ❌ ${field} - FALTA`);
            }
        });
    }

    console.log('');

    // ============================================================
    // 2️⃣ VALIDAR TABLA MOVIMIENTOS_REACTIVOS
    // ============================================================
    console.log('📊 Validando tabla: movimientos_reactivos');
    const [movimientosColumns] = await db.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'movimientos_reactivos' AND TABLE_SCHEMA = ?
        ORDER BY ORDINAL_POSITION
    `, { replacements: [DB_NAME] });

    if (movimientosColumns.length === 0) {
        console.error('❌ La tabla movimientos_reactivos NO existe. Ejecuta: npm start');
    } else {
        console.log(`   ✅ Campos encontrados: ${movimientosColumns.length}`);
        
        const requiredFields = ['id_movimiento_reactivo', 'id_reactivo', 'cantidad_inicial', 'lote', 'fecha_vencimiento'];
        requiredFields.forEach(field => {
            const exists = movimientosColumns.some(col => col.COLUMN_NAME === field);
            console.log(`   ${exists ? '✅' : '❌'} ${field}`);
        });
    }

    console.log('');

    // ============================================================
    // 3️⃣ VALIDAR TABLA SALIDAS_REACTIVOS
    // ============================================================
    console.log('📊 Validando tabla: salidas_reactivos');
    const [salidasColumns] = await db.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'salidas_reactivos' AND TABLE_SCHEMA = ?
        ORDER BY ORDINAL_POSITION
    `, { replacements: [DB_NAME] });

    if (salidasColumns.length === 0) {
        console.error('❌ La tabla salidas_reactivos NO existe. Ejecuta: npm start');
    } else {
        console.log(`   ✅ Campos encontrados: ${salidasColumns.length}`);
        
        const requiredFields = ['id_salida', 'id_movimiento_reactivo', 'cantidad_salida'];
        requiredFields.forEach(field => {
            const exists = salidasColumns.some(col => col.COLUMN_NAME === field);
            console.log(`   ${exists ? '✅' : '❌'} ${field}`);
        });
    }

    console.log('\n✅ Validación completada');

} catch (error) {
    console.error('❌ Error durante la validación:', error.message);
    if (error.message.includes('ER_BAD_DB_ERROR')) {
        console.error('   La base de datos "ecosystem" no existe. Créala primero.');
    }
} finally {
    await db.close();
}
