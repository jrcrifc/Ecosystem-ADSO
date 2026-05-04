import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import sequelize from "../database/db.js";

const resetAdmin = async () => {
  try {
    const pass = await bcrypt.hash("Admin1234!", 10);
    const [affectedCount] = await UserModel.update(
      { password: pass },
      { where: { email: "admin@laboratorio.com" } }
    );
    
    if (affectedCount > 0) {
      console.log("✅ Contraseña restablecida para admin@laboratorio.com");
      console.log("   Nueva contraseña: Admin1234!");
    } else {
      console.log("❌ No se encontró el usuario admin@laboratorio.com");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit();
  }
};

resetAdmin();
