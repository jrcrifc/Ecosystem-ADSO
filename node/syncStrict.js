import fs from 'fs';
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
        await db.query("SET SESSION sql_mode = ''");
        console.log('✅ sql_mode limpiado');
        for (const [name, model] of Object.entries(db.models)) {
            try {
                await model.sync({ alter: true, logging: false });
                console.log(`✅ ${name} sincronizada.`);
            } catch (err) {
                console.error(`❌ Error sincronizando ${name}:`, err.message);
            }
        }
    } finally {
        process.exit();
    }
}
syncAll();
