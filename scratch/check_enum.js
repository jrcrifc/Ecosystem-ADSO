import db from '../node/database/db.js';

async function checkEnum() {
  try {
    await db.authenticate();
    const [rows] = await db.query(`SHOW COLUMNS FROM instructores LIKE 'tipo_vinculacion';`);
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkEnum();
