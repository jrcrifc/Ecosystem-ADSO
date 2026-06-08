// ============================================================
// 📦 CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS (Sequelize + MySQL)
// Este archivo crea y exporta la instancia de Sequelize que se usa
// en toda la aplicación para interactuar con la base de datos MySQL.
// ============================================================

// Importa Sequelize para crear la instancia de ORM
import { Sequelize } from 'sequelize';
// Importa dotenv para cargar variables de entorno
import dotenv from 'dotenv';
// Importa path para manejar rutas de archivos
import path from 'path';
// Importa fs para verificar la existencia de archivos
import fs from 'fs';
// Importa fileURLToPath para obtener la ruta del archivo actual en ESM
import { fileURLToPath } from 'url';

// Obtiene la ruta del archivo actual (necesario en ESM porque __dirname no existe)
const __filename = fileURLToPath(import.meta.url);
// Obtiene el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Define múltiples rutas posibles para el archivo .env
const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env')
];

// Variable para indicar si se cargó el archivo .env
let loaded = false;
// Recorre las rutas buscando el primer archivo .env existente
for (const p of paths) {
    if (fs.existsSync(p)) {
        // Carga las variables de entorno desde el archivo .env encontrado
        dotenv.config({ path: p });
        loaded = true;
        break;
    }
}
// Si no se encontró ningún archivo .env, intenta cargar desde la ubicación predeterminada
if (!loaded) {
    dotenv.config();
}

// Crea la instancia de Sequelize para conectar con MySQL usando variables de entorno o valores por defecto
const db = new Sequelize(
    process.env.DB_NAME || 'ecosystem',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        // Si el host no es localhost, activa SSL para conexiones remotas seguras
        dialectOptions: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
);

// Exporta la instancia de Sequelize para usarla en toda la aplicación
export default db;