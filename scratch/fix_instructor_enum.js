// Script para migrar el ENUM de tipo_vinculacion en la tabla instructores
import db from '../node/database/db.js';

async function fixEnum() {
  try {
    await db.authenticate();
    console.log('✅ Conectado a la BD');

    // Paso 1: Cambiar ENUM para aceptar valores nuevos y viejos
    console.log('🔄 Paso 1: Ampliando ENUM...');
    await db.query(`
      ALTER TABLE instructores
      MODIFY COLUMN tipo_vinculacion ENUM('Instructor de planta', 'Instructor por prestacion de servicios', 'Planta', 'Contrato') 
      NULL DEFAULT NULL;
    `);
    console.log('✅ ENUM ampliado');

    // Paso 2: Migrar valores viejos a nuevos
    console.log('🔄 Paso 2: Migrando valores viejos...');
    const [r1] = await db.query(`UPDATE instructores SET tipo_vinculacion = 'Instructor de planta' WHERE tipo_vinculacion = 'Planta';`);
    console.log(`  → Planta → Instructor de planta: ${r1.affectedRows || 0} registros`);
    
    const [r2] = await db.query(`UPDATE instructores SET tipo_vinculacion = 'Instructor por prestacion de servicios' WHERE tipo_vinculacion = 'Contrato';`);
    console.log(`  → Contrato → Instructor por prestacion de servicios: ${r2.affectedRows || 0} registros`);

    // Paso 3: Limpiar ENUM dejando solo los nuevos valores
    console.log('🔄 Paso 3: Limpiando ENUM final...');
    await db.query(`
      ALTER TABLE instructores
      MODIFY COLUMN tipo_vinculacion ENUM('Instructor de planta', 'Instructor por prestacion de servicios') 
      NULL DEFAULT NULL;
    `);
    console.log('✅ ENUM final establecido');

    // Verificar
    const [rows] = await db.query(`SELECT id_instructor, documento, nombres_apellidos, tipo_vinculacion FROM instructores LIMIT 5;`);
    console.log('\n📋 Verificación (primeros 5):');
    rows.forEach(r => console.log(`  ${r.documento} - ${r.nombres_apellidos} → ${r.tipo_vinculacion || 'NULL'}`));

    console.log('\n🎉 ¡Migración completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixEnum();
