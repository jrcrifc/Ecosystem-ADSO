// ============================================================
// 👥 COMPROBACIÓN DE ADMINISTRADORES (check_admins.js)
// Este script consulta e imprime por consola (usando console.table)
// todos los usuarios con rol de 'Administrador' registrados en la BD.
// Si no hay administradores, lista los roles disponibles.
// ============================================================

import db from '../node/database/db.js';

async function checkAdmins() {
  try {
    const [rows] = await db.query("SELECT id_usuario, nombres_apellidos, rol, estado FROM usuarios WHERE rol = 'Administrador'");
    console.log("👥 Usuarios con rol 'Administrador' encontrados:");
    console.table(rows);
    
    if (rows.length === 0) {
      console.log("❌ NO SE ENCONTRARON ADMINISTRADORES. Revisando todos los roles...");
      const [all] = await db.query("SELECT DISTINCT rol FROM usuarios");
      console.table(all);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkAdmins();

