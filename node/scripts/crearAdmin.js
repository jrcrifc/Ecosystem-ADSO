// ============================================================
// 👑 SCRIPT DE REGISTRO DEL ADMINISTRADOR PREDETERMINADO (crearAdmin.js)
// Este script inicializa la base de datos y crea el usuario
// administrador maestro de Ecosystem si no existe ya alguno.
// Permite al desarrollador acceder al panel de administración en la primera ejecución.
// Ejecución:
//   node scripts/crearAdmin.js
// ============================================================

import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database/db.js";

const crearAdmin = async () => {
  // Sincronizar todos los modelos Sequelize con las tablas correspondientes en la BD
  await sequelize.sync();

  // Verificar si ya existe un usuario con rol Administrador
  const existe = await UserModel.findOne({ where: { rol: "Administrador" } });
  if (existe) {
    console.log("⚠️ Ya existe un administrador registrado en el sistema.");
    process.exit();
  }

  // Crear el registro del administrador maestro
  await UserModel.create({
    uuid: uuidv4(),
    documento: "00000000",
    nombres_apellidos: "Administrador Lab Ambiental",
    email: "admin@laboratorio.com",
    // Encriptar contraseña segura por defecto con bcrypt
    password: await bcrypt.hash("Admin1234!", 10),
    rol: "Administrador",
    estado: "aprobado" // Aprobado automáticamente para poder iniciar sesión directamente
  });

  console.log("✅ Admin creado exitosamente:");
  console.log("   Email: admin@laboratorio.com");
  console.log("   Contraseña: Admin1234!");
  process.exit();
};

crearAdmin();