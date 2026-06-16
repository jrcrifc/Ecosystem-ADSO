import { Sequelize } from 'sequelize';
import db from './database/db.js';
import './models/associations.js';
async function sync() { try { await db.authenticate(); console.log('Conectado'); await db.sync({ alter: true }); console.log('Sync global terminado con alter: true'); } catch(e) { console.error('Error global:', e); } finally { process.exit(); } } sync();
