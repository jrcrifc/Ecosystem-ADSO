// ============================================================
// 👥 SCRIPT DE DIAGNÓSTICO DE USUARIOS (check_users.js)
// Este script consulta e imprime por consola todos los usuarios registrados
// en la base de datos (con su ID, nombre, email, rol y estado).
// Es una herramienta utilitaria rápida de diagnóstico en desarrollo.
// Ejecución:
//   node scripts/check_users.js
// ============================================================

import db from "../database/db.js";
import { QueryTypes } from "sequelize";

async function run() {
  try {
    // Consultar directamente la tabla de usuarios usando una query SQL nativa mediante Sequelize
    const users = await db.query("SELECT id_usuario, nombres_apellidos, email, rol, estado FROM usuarios", {
      type: QueryTypes.SELECT
    });
    console.log("👥 Usuarios en base de datos local:", users);
    process.exit(0); // Terminar exitosamente
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    process.exit(1); // Terminar con código de error
  }
}

run();
