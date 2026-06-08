// ============================================================
// 👥 LISTADO GENERAL DE USUARIOS (check_users.js)
// Este script realiza una consulta SQL directa a la base de datos
// para obtener e imprimir el listado completo de usuarios con su ID,
// nombres, correo, rol y estado.
// ============================================================

import db from "../node/database/db.js";
import { QueryTypes } from "sequelize";

async function run() {
  try {
    const users = await db.query("SELECT id_usuario, nombres_apellidos, email, rol, estado FROM usuarios", {
      type: QueryTypes.SELECT
    });
    console.log("👥 Usuarios en base de datos local:", users);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    process.exit(1);
  }
}

run();

