import db from '../node/database/db.js';

async function checkDates() {
  try {
    await db.authenticate();
    const [rows] = await db.query(`SELECT id_instructor, createdAt, tipo_vinculacion FROM instructores ORDER BY id_instructor DESC LIMIT 5;`);
    console.log("NUEVOS:");
    console.log(rows);

    const [rowsOld] = await db.query(`SELECT id_instructor, createdAt, tipo_vinculacion FROM instructores ORDER BY id_instructor ASC LIMIT 5;`);
    console.log("VIEJOS:");
    console.log(rowsOld);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkDates();
