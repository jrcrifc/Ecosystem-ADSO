// ============================================================
// 🔄 SCRIPT DE SINCRONIZACIÓN DE BASE DE DATOS
// Este script sincroniza todos los modelos de Sequelize con la BD real.
// Usa { alter: true } para modificar las tablas existentes sin perder datos
// (agrega columnas nuevas, modifica tipos, etc.)
// Se ejecuta manualmente cuando se necesitan aplicar cambios al esquema:
//   node syncDatabase.js
// ============================================================

// Importa la instancia de Sequelize para conectar con la base de datos
import db from './database/db.js';
// Importa las asociaciones para que Sequelize conozca las relaciones entre modelos
import './models/associations.js';

// Función asíncrona que sincroniza todos los modelos con la base de datos
async function syncDB() {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Verifica que la conexión a la base de datos funcione
        await db.authenticate();
        console.log('✅ Conexión establecida a Aiven MySQL');
        
        // Sincroniza todos los modelos con la base de datos usando alter para modificar tablas existentes
        console.log('🔄 Sincronizando modelos con la base de datos...');
        await db.sync({ alter: true });
        
        console.log('✅ Base de datos sincronizada exitosamente.');
    } catch (error) {
        // Imprime el error si la sincronización falla
        console.error('❌ Error sincronizando base de datos:', error);
    } finally {
        // Termina el proceso al finalizar la ejecución
        process.exit();
    }
}

// Ejecuta la función de sincronización
syncDB();
