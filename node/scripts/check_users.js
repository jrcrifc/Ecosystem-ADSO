// ============================================================
// 👥 SCRIPT DE DIAGNÓSTICO DE USUARIOS E INSTRUCTORES (check_users.js)
// Este script consulta e imprime por consola todos los usuarios registrados
// en la tabla usuarios (Administrador, Gestor, Pasante) y los instructores
// más recientes de la tabla instructores.
// Ejecución:
//   node scripts/check_users.js
// ============================================================

import db from "../database/db.js";
import { QueryTypes } from "sequelize";

async function run() {
  try {
    const users = await db.query("SELECT id_usuario, nombres_apellidos, email, rol, estado FROM usuarios", {
      type: QueryTypes.SELECT
    });
    console.log("👥 Usuarios en tabla `usuarios` (Admin, Gestor, Pasante):", users);

    const instructores = await db.query(
      "SELECT id_instructor, documento, nombres_apellidos, email, tipo_vinculacion, estado FROM instructores ORDER BY id_instructor DESC LIMIT 10",
      { type: QueryTypes.SELECT }
    );
    console.log("\n👨‍🏫 Últimos 10 instructores en tabla `instructores`:", instructores);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    process.exit(1);
  }
}

run();
