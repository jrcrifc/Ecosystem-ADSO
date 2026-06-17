import db from '../node/database/db.js';

async function checkData() {
  try {
    await db.authenticate();
    const [rows] = await db.query(`SELECT id_instructor, nombres_apellidos, tipo_vinculacion FROM instructores ORDER BY id_instructor DESC LIMIT 10;`);
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkData();
