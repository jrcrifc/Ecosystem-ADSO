import db from './database/db.js';
import './models/associations.js';

async function syncLocal() {
    try {
        console.log('Autenticando en localhost...');
        await db.authenticate();
        console.log('✅ Conexión establecida a MySQL (localhost)');
        
        console.log('🔄 Sincronizando tabla Aprendices...');
        await db.models.aprendices.sync({ alter: true });
        
        console.log('🔄 Sincronizando tabla Instructores...');
        await db.models.instructores.sync({ alter: true });
        
        console.log('✅ Tablas actualizadas con éxito.');
    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        process.exit();
    }
}

syncLocal();
