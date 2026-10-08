import db from './database/db.js';

async function migrate() {
    try {
        await db.authenticate();
        console.log('✅ Connected');
        await db.query('SET FOREIGN_KEY_CHECKS=0');
        await db.query('DROP TABLE IF EXISTS fichas');
        console.log('✅ Dropped fichas');
        
        try {
            await db.query('ALTER TABLE reactivos DROP COLUMN formula_reactivo, DROP COLUMN nom_reactivo_ingles');
            console.log('✅ Modified reactivos');
        } catch(e) {
            console.log('Columns in reactivos might already be dropped');
        }
        
        await db.query('UPDATE usuarios SET estado="activo" WHERE estado IN ("aprobado", "pendiente", "rechazado")');
        await db.query('ALTER TABLE usuarios MODIFY COLUMN estado ENUM("activo", "inactivo") NOT NULL DEFAULT "activo"');
        console.log('✅ Modified usuarios');
        
        await db.query('SET FOREIGN_KEY_CHECKS=1');
        console.log('🎉 Migration successful');
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
migrate();
