import fs from 'fs';

// Override env vars
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '';
process.env.DB_NAME = 'ecosystem';
process.env.DB_PORT = 3306;

async function syncAll() {
    const dbModule = await import('./database/db.js');
    const db = dbModule.default;
    await import('./models/associations.js');

    try {
        await db.authenticate();
        console.log('✅ Conexión establecida a MySQL (localhost)');
        
        // Sync models one by one to avoid one failing model stopping the rest
        for (const [name, model] of Object.entries(db.models)) {
            try {
                console.log(`🔄 Sincronizando tabla: ${name}...`);
                await model.sync({ alter: true });
                console.log(`✅ ${name} sincronizada.`);
            } catch (err) {
                console.error(`❌ Error sincronizando ${name}:`, err.message);
            }
        }
        
        console.log('✅ Proceso de sincronización finalizado.');
    } catch (e) {
        console.error('❌ Error de conexión:', e.message);
    } finally {
        process.exit();
    }
}

syncAll();
