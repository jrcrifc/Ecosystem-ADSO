import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database/db.js";

const crearAdmin = async () => {
  await sequelize.sync();

  const existe = await UserModel.findOne({ where: { rol: "Administrador" } });
  if (existe) {
    console.log("⚠️ Ya existe un administrador");
    process.exit();
  }

  await UserModel.create({
    uuid: uuidv4(),
    documento: "00000000",
    nombres_apellidos: "Administrador Lab Ambiental",
    email: "admin@laboratorio.com",
    password: await bcrypt.hash("Admin1234!", 10),
    rol: "Administrador",
    estado: "aprobado"
  });

  console.log("✅ Admin creado:");
  console.log("   Email: admin@laboratorio.com");
  console.log("   Contraseña: Admin1234!");
  process.exit();
};

crearAdmin();