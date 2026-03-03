import db from '../database/db.js';
import userModel from '../models/userModel.js';

const run = async () => {
  try {
    await db.authenticate();
    const users = await userModel.findAll({ attributes: ['userId', 'userEmail', 'userType', 'admin', 'createdat'] });
    console.log('Usuarios en la tabla:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error inspeccionando usuarios:', err);
    process.exit(1);
  }
};

run();