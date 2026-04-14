import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class UserService {
  async registerUser(data) {
    const { documento, nombres_apellidos, email, password, rol } = data;

    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) throw new Error("El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      uuid: uuidv4(),
      documento,
      nombres_apellidos,
      email,
      password: hashedPassword,
      rol,
      estado: 'pendiente'  // Todo usuario nuevo queda pendiente
    });

    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  async loginUser(data) {
    const { email, password } = data;

    console.log("🔑 JWT_SECRET en login:", process.env.JWT_SECRET || "❌ UNDEFINED");
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado. Revisa tu archivo .env");
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error("Usuario y contraseña incorrectos");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Usuario y contraseña incorrectos");

    // Bloquear si no está aprobado
    if (user.estado === 'pendiente') {
      throw new Error("Tu cuenta está pendiente de aprobación por el administrador");
    }
    if (user.estado === 'rechazado') {
      throw new Error("Tu cuenta fue rechazada. Contacta al administrador");
    }

    const token = jwt.sign(
      { id: user.id_usuario, uuid: user.uuid, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    user.token = token;
    await user.save();

    const { password: _, ...userSinPassword } = user.toJSON();
    return { token, user: userSinPassword };
  }
}

export default new UserService();