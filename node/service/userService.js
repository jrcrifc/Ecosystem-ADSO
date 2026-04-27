import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import NotificacionService from "./notificacionService.js";
class UserService {

  // ✅ Crea el admin predeterminado si no existe
  async crearAdminPredeterminado() {
    try {
      const adminExistente = await UserModel.findOne({ where: { email: 'admin@laboratorio.com' } });
      if (!adminExistente) {
        const passwordHash = await bcrypt.hash('Admin1234!', 10);
        await UserModel.create({
          documento: '000000000',
          nombres_apellidos: 'Administrador Ecosystem',
          email: 'admin@laboratorio.com',
          password: passwordHash,
          rol: 'Administrador',
          estado: 'aprobado',
          uuid: uuidv4()
        });
        console.log('✅ Admin creado → admin@laboratorio.com / Admin1234!');
      } else {
        console.log('ℹ️ Admin ya existe');
      }
    } catch (error) {
      console.error('❌ Error al crear admin:', error);
    }
  }

 async registerUser(data) {
    const { documento, nombres_apellidos, email, password, rol } = data;

    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) throw new Error("El usuario ya existe");

    // Verificar documento duplicado
    const existDoc = await UserModel.findOne({ where: { documento } });
    if (existDoc) throw new Error("Ya existe un usuario con ese documento");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      uuid: uuidv4(),
      documento,
      nombres_apellidos,
      email,
      password: hashedPassword,
      rol,
      estado: 'pendiente'
    });

    // ✅ Notificar al admin si es Pasante o Gestor
    if (['Pasante', 'Gestor'].includes(rol)) {
      await NotificacionService.notificarAdmins({
        id_usuario_origen: user.id_usuario,
        titulo: '👤 Nuevo usuario pendiente de aprobación',
        mensaje: `${nombres_apellidos} se registró como ${rol} y está esperando aprobación para acceder al sistema.`,
        tipo: 'solicitud_acceso'
      });
    }

    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  async loginUser(data) {
    const { email, password } = data;
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado. Revisa tu archivo .env");
    }
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error("Usuario y contraseña incorrectos");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Usuario y contraseña incorrectos");

    // ✅ Bloquear pendientes y rechazados EXCEPTO Pasante y Gestor
    // Aprendiz e Instructor entran pero ven solo el formulario
    if (user.estado === 'rechazado') {
      throw new Error("Tu cuenta fue rechazada. Contacta al administrador del Laboratorio Ambiental.");
    }
    if (user.estado === 'inactivo') {
      throw new Error("Tu cuenta está inactiva. Contacta al administrador del Laboratorio Ambiental.");
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

  // ✅ Obtener todos los usuarios
  async getTodos() {
    return await UserModel.findAll({
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // ✅ Obtener usuarios pendientes
  async getPendientes() {
    return await UserModel.findAll({
      where: { estado: 'pendiente' },
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // ✅ Aprobar usuario
  async aprobarUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    await user.update({ estado: 'aprobado' });
    return user;
  }

  // ✅ Rechazar usuario
  async rechazarUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    await user.update({ estado: 'rechazado' });
    return user;
  }

  // ✅ Activar/Inactivar usuario (toggle)
  async toggleActivoUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    const nuevoEstado = user.estado === 'inactivo' ? 'aprobado' : 'inactivo';
    await user.update({ estado: nuevoEstado });
    return { ...user.toJSON(), estado: nuevoEstado };
  }
}


export default new UserService();