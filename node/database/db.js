import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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