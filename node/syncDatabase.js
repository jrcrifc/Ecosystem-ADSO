import db from './database/db.js';
import './models/associations.js';

async function syncDB() {
    try {
        await db.authenticate();
        console.log('✅ Conexión establecida a Aiven MySQL');
        
        console.log('🔄 Sincronizando modelos con la base de datos...');
        await db.sync({ alter: true });
        
        console.log('✅ Base de datos sincronizada exitosamente.');
    } catch (error) {
        console.error('❌ Error sincronizando base de datos:', error);
    } finally {
        process.exit();
    }
}

syncDB();
