import db from './database/db.js';

async function run() {
  const [res] = await db.query("SELECT id_usuario, documento, nombres_apellidos FROM usuarios WHERE nombres_apellidos LIKE '%LAURA VANESSA BOLAÑO%'");
  console.log(res);
  
  const [inst] = await db.query("SELECT id_instructor, id_usuario, documento, nombres_apellidos FROM instructores WHERE nombres_apellidos LIKE '%LAURA VANESSA BOLAÑO%'");
  console.log(inst);
  
  process.exit(0);
}

run();
