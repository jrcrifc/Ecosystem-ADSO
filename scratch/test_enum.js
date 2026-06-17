import db from '../node/database/db.js';

async function testInsert() {
  try {
    await db.authenticate();
    console.log("Probando inserción de planta...");
    const [r1] = await db.query(`
      UPDATE instructores SET tipo_vinculacion = 'Instructor de planta' WHERE id_instructor = 1;
    `);
    console.log(r1);

    console.log("Probando inserción de prestacion...");
    const [r2] = await db.query(`
      UPDATE instructores SET tipo_vinculacion = 'Instructor por prestacion de servicios' WHERE id_instructor = 2;
    `);
    console.log(r2);
    
    const [rows] = await db.query(`SELECT id_instructor, tipo_vinculacion FROM instructores WHERE id_instructor IN (1, 2);`);
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
testInsert();
