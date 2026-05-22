import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env')
];

let loaded = false;
for (const p of paths) {
    if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        loaded = true;
        break;
    }
}
if (!loaded) {
    dotenv.config();
}

const db = new Sequelize(
    process.env.DB_NAME || 'ecosystem',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '', 
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
);

export default db;