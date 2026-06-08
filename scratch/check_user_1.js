// ============================================================
// 👤 COMPROBACIÓN DE USUARIO CON ID 1 (check_user_1.js)
// Este script consulta e imprime por consola los detalles del usuario
// registrado con el identificador único (ID) 1 en la base de datos.
// ============================================================

import db from '../node/database/db.js';

async function checkUser1() {
  try {
    const [rows] = await db.query("SELECT id_usuario, nombres_apellidos, rol, estado FROM usuarios WHERE id_usuario = 1");
    console.log("👤 Usuario con ID 1:");
    console.table(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkUser1();

