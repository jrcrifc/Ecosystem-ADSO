import db from '../node/database/db.js';

async function checkPrestacion() {
  try {
    await db.authenticate();
    const [rows] = await db.query(`SELECT id_instructor, nombres_apellidos, tipo_vinculacion FROM instructores WHERE tipo_vinculacion = 'Instructor por prestacion de servicios';`);
    console.log("Registros con prestacion:", rows.length);
    if(rows.length > 0) console.log(rows[0]);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkPrestacion();
