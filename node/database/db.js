import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.warn(`⚠️ No se encontró .env en ${envPath}. Usando variables de entorno del sistema o valores por defecto.`);
}

const db = new Sequelize(
  process.env.DB_NAME || 'ecosystem',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

export default db;