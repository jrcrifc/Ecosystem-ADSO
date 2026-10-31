// ============================================================
// 👥 SERVICIO DE USUARIOS (UserService)
// Este servicio orquesta toda la lógica de negocio relacionada con
// la gestión de usuarios: registro, login, asignación de roles,
// procesos de aprobación, cambio de perfiles y contraseñas, e
// importación masiva desde archivos de Excel.
// ============================================================

import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import NotificacionService from "./notificacionService.js";
import emailService from "./emailService.js";
import { registrarLog } from "./logService.js";
import { getIO } from "../socket.js";
import XLSX from "xlsx";
import InstructorModel from "../models/instructorModel.js";

class UserService {

  // Crea el administrador predeterminado del sistema si no existe en la base de datos
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
          estado: 'activo',
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

  // Registra un nuevo usuario en el sistema (Pasante o Gestor en tabla usuarios)
  async registerUser(data) {
    let { tipo_documento, documento, nombres_apellidos, email, rol } = data;
    documento = (documento || "").trim();
    nombres_apellidos = (nombres_apellidos || "").trim();
    email = (email || "").trim().toLowerCase();
    const password = documento;

    if (!/^\d+$/.test(documento)) throw new Error("El documento debe contener solo números");
    if (nombres_apellidos.length < 3) throw new Error("Por favor ingresa un nombre válido");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("El formato del correo electrónico no es válido");

    // Si por algún motivo envían rol Instructor a este endpoint, redirigirlo a InstructorModel
    if (rol === 'Instructor') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existInst = await InstructorModel.findOne({
        where: { [Op.or]: [{ email }, { documento }] }
      });
      if (existInst) throw new Error("El documento o correo ya está registrado como instructor");

      const nuevoInst = await InstructorModel.create({
        documento,
        nombres_apellidos,
        email,
        password: hashedPassword,
        estado: 'activo'
      });
      await registrarLog(email, 'REGISTRO', 'AUTH', `Instructor registrado: ${nombres_apellidos}`);
      const { password: _, ...instSinPassword } = nuevoInst.toJSON();
      return { ...instSinPassword, rol: 'Instructor' };
    }

    if (!['Pasante', 'Gestor'].includes(rol)) {
      throw new Error("Solo los Pasantes y Gestores pueden registrarse en usuarios.");
    }

    // Verificar que no exista en instructores
    const existInInst = await InstructorModel.findOne({
      where: { [Op.or]: [{ email }, { documento }] }
    });
    if (existInInst) {
      throw new Error("Este documento o correo ya pertenece a un Instructor registrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let existUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ email }, { documento }]
      }
    });

    let user;
    if (existUser) {
      await existUser.update({
        tipo_documento: tipo_documento || existUser.tipo_documento || 'CC',
        documento,
        nombres_apellidos: nombres_apellidos || existUser.nombres_apellidos,
        email,
        password: hashedPassword,
        rol,
        estado: 'activo'
      });
      user = existUser;
      await registrarLog(email, 'ACTUALIZACION', 'AUTH', `Usuario actualizado a rol ${rol} por administrador`);
    } else {
      user = await UserModel.create({
        uuid: uuidv4(),
        tipo_documento: tipo_documento || 'CC',
        documento,
        nombres_apellidos,
        email,
        password: hashedPassword,
        rol,
        estado: 'activo'
      });
      await registrarLog(email, 'REGISTRO', 'AUTH', `Usuario registrado como ${rol}`);
    }

    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  // Actualiza un usuario (Gestor o Pasante) por parte del administrador
  async updateUserByAdmin(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");

    const documento = data.documento ? data.documento.trim() : user.documento;
    const nombres_apellidos = data.nombres_apellidos ? data.nombres_apellidos.trim() : user.nombres_apellidos;
    const email = data.email ? data.email.trim().toLowerCase() : user.email;
    const rol = ['Gestor', 'Pasante', 'Administrador'].includes(data.rol) ? data.rol : user.rol;
    const tipo_documento = data.tipo_documento || user.tipo_documento || 'CC';

    if (documento !== user.documento) {
      const existDoc = await UserModel.findOne({ where: { documento } });
      const existInst = await InstructorModel.findOne({ where: { documento } });
      if (existDoc || existInst) throw new Error("El documento ya está en uso");
    }
    if (email !== user.email) {
      const existEmail = await UserModel.findOne({ where: { email } });
      const existInst = await InstructorModel.findOne({ where: { email } });
      if (existEmail || existInst) throw new Error("El correo electrónico ya está en uso");
    }

    await user.update({
      tipo_documento,
      documento,
      nombres_apellidos,
      email,
      rol
    });

    await registrarLog('ADMIN', 'ACTUALIZAR_USUARIO', 'GESTION_USUARIOS', `Actualizado usuario ${email} (${rol})`);
    const { password: _, token: __, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  // Inicia sesión validando en usuarios (Admin, Gestor, Pasante) o en instructores (Instructor)
  async loginUser(data) {
    const documento = (data.documento || "").trim();
    const password = data.password || "";

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado. Revisa tu archivo .env");
    }

    // 1. Buscar en UserModel (SOLO si tiene un rol válido de usuarios: Administrador, Gestor, Pasante)
    const user = await UserModel.findOne({ 
      where: { 
        [Op.or]: [
          { documento: documento },
          { email: documento.toLowerCase() }
        ]
      } 
    });

    if (user && ['Administrador', 'Gestor', 'Pasante'].includes(user.rol)) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Documento o contraseña incorrectos");
      if (user.estado === 'inactivo') {
        throw new Error("Tu cuenta está inactiva. Contacta al administrador del Laboratorio Ambiental.");
      }
      const token = jwt.sign(
        { id: user.id_usuario, uuid: user.uuid, rol: user.rol, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );
      user.token = token;
      await user.save();
      await registrarLog(user.email, 'LOGIN', 'AUTH', `Inicio de sesión exitoso (${user.rol})`);
      const { password: _, ...userSinPassword } = user.toJSON();
      return { token, user: userSinPassword };
    }

    // 2. Si no está en usuarios (o era un registro huérfano), buscar en la tabla instructores
    const instructor = await InstructorModel.findOne({
      where: {
        [Op.or]: [
          { documento: documento },
          { email: documento.toLowerCase() }
        ]
      }
    });

    if (!instructor) {
      throw new Error("Documento/Correo o contraseña incorrectos");
    }

    if (instructor.estado === 'inactivo') {
      throw new Error("Tu cuenta está inactiva. Contacta al administrador del Laboratorio Ambiental.");
    }

    // Validar contraseña de instructor
    let isValidInst = false;
    if (instructor.password) {
      isValidInst = await bcrypt.compare(password, instructor.password);
    }
    if (!isValidInst && String(password).trim() === String(instructor.documento).trim()) {
      isValidInst = true;
    }

    if (!isValidInst) {
      throw new Error("Documento o contraseña incorrectos");
    }

    const token = jwt.sign(
      { id: instructor.id_instructor, rol: 'Instructor', email: instructor.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await registrarLog(instructor.email || instructor.documento, 'LOGIN', 'AUTH', `Inicio de sesión exitoso (Instructor)`);

    const instructorUserObj = {
      id_usuario: instructor.id_instructor,
      id_instructor: instructor.id_instructor,
      documento: instructor.documento,
      nombres_apellidos: instructor.nombres_apellidos,
      email: instructor.email,
      telefono: instructor.telefono,
      tipo_vinculacion: instructor.tipo_vinculacion,
      avatar: instructor.avatar || null,
      rol: 'Instructor',
      estado: instructor.estado || 'activo'
    };

    return { token, user: instructorUserObj };
  }

  // Obtiene una lista de todos los usuarios registrados (Administrador, Gestor, Pasante) del último al primero
  async getTodos() {
    return await UserModel.findAll({
      where: {
        rol: { [Op.in]: ['Administrador', 'Gestor', 'Pasante'] }
      },
      attributes: { exclude: ['password', 'token'] },
      order: [['id_usuario', 'DESC']]
    });
  }

  // Activa o inactiva a un usuario y notifica o expulsa según corresponda
  async toggleActivoUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    const nuevoEstado = user.estado === 'inactivo' ? 'activo' : 'inactivo';
    await user.update({ estado: nuevoEstado });
    if (nuevoEstado === 'inactivo') {
      try {
        const io = getIO();
        io.to(`user_${id}`).emit("force_logout", {
          mensaje: "Tu cuenta ha sido inactivada por el administrador."
        });
      } catch (err) {
        console.error("No se pudo emitir force_logout:", err);
      }
      await registrarLog('ADMIN', 'INACTIVAR_USUARIO', 'GESTION_USUARIOS', `Inactivado usuario: ${user.email}`);
    } else {
      await NotificacionService.crearNotificacion({
        id_usuario_origen: null,
        id_usuario_destino: user.id_usuario,
        titulo: '¡Cuenta Reactivada!',
        mensaje: 'El administrador ha reactivado tu cuenta. Ya puedes acceder al sistema.',
        tipo: 'aprobado'
      });
      await registrarLog('ADMIN', 'ACTIVAR_USUARIO', 'GESTION_USUARIOS', `Reactivado usuario: ${user.email}`);
    }
    return { ...user.toJSON(), estado: nuevoEstado };
  }

  // Obtiene los datos de un usuario o instructor según su rol
  async getById(id, rol = null) {
    if (rol === 'Instructor') {
      const inst = await InstructorModel.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (!inst) throw new Error("Instructor no encontrado");
      return {
        ...inst.toJSON(),
        id_usuario: inst.id_instructor,
        id_instructor: inst.id_instructor,
        rol: 'Instructor',
        estado: inst.estado || 'activo'
      };
    }

    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ['password', 'token'] }
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  // Actualiza la información básica del perfil de un usuario o instructor
  async updateProfile(id, data, rol = null) {
    if (!data.passwordConfirmacion) {
      throw new Error("Se requiere la contraseña para actualizar el perfil");
    }

    if (rol === 'Instructor') {
      const inst = await InstructorModel.findByPk(id);
      if (!inst) throw new Error("Instructor no encontrado");

      let isValid = false;
      if (inst.password) {
        isValid = await bcrypt.compare(data.passwordConfirmacion, inst.password);
      }
      if (!isValid && String(data.passwordConfirmacion).trim() === String(inst.documento).trim()) {
        isValid = true;
      }
      if (!isValid) throw new Error("La contraseña ingresada es incorrecta");

      const updateData = {
        nombres_apellidos: data.nombres_apellidos,
        email: data.email
      };
      if (data.avatar) {
        updateData.avatar = data.avatar;
      } else if (data.remove_avatar === "true") {
        updateData.avatar = null;
      }
      await inst.update(updateData);
      const { password: _, ...instSinPassword } = inst.toJSON();
      return {
        ...instSinPassword,
        id_usuario: inst.id_instructor,
        id_instructor: inst.id_instructor,
        rol: 'Instructor',
        estado: inst.estado || 'activo'
      };
    }

    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await bcrypt.compare(data.passwordConfirmacion, user.password);
    if (!isValid) throw new Error("La contraseña ingresada es incorrecta");

    const updateData = {
      nombres_apellidos: data.nombres_apellidos,
      email: data.email
    };

    if (data.avatar) {
      updateData.avatar = data.avatar;
    } else if (data.remove_avatar === "true") {
      updateData.avatar = null;
    }

    await user.update(updateData);
    return user;
  }

  // Cambia la contraseña de un usuario por parte de un administrador
  async changePasswordByAdmin(id, { nuevaPassword }) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    await user.update({ password: hashedPassword });
    await registrarLog('ADMIN', 'CAMBIO_PASSWORD', 'GESTION_USUARIOS', `Contraseña actualizada para el usuario ${user.documento}`);
    return true;
  }

  // Importa usuarios o instructores de forma masiva desde un archivo de Excel
  async importarExcel(buffer, userEmailLog, rolForzado = null) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    let creados = 0;
    let omitidos = 0;
    let errores = [];
    const rolesValidos = ['Pasante', 'Gestor', 'Instructor', 'Administrador'];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2;
      let documento = "";
      let nombres_apellidos = "";
      let email = "";
      let rol = "Pasante";
      let telefono = null;
      let tipo_vinculacion = null;
      let tipo_documento = null;

      for (const key of Object.keys(row)) {
        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();
        if (normalizedKey === "documento" || normalizedKey === "identificacion" || normalizedKey === "documento de identidad" || normalizedKey === "cedula" || normalizedKey.includes("documento") || normalizedKey.includes("cedula")) {
          documento = val;
        } else if (normalizedKey === "nombres_apellidos" || normalizedKey === "nombres" || normalizedKey === "apellidos" || normalizedKey === "nombres y apellidos" || normalizedKey === "nombre completo" || normalizedKey.includes("nombre") || normalizedKey.includes("apellido")) {
          nombres_apellidos = val;
        } else if (normalizedKey === "email" || normalizedKey === "correo" || normalizedKey === "correo electronico" || normalizedKey.includes("correo") || normalizedKey.includes("email")) {
          email = val.toLowerCase();
        } else if (normalizedKey === "rol") {
          rol = val;
        } else if (normalizedKey === "telefono" || normalizedKey === "celular" || normalizedKey === "telefono de contacto") {
          telefono = val;
        } else if (normalizedKey.includes("vinculacion") || normalizedKey.includes("contrato") || normalizedKey.includes("tipo vinculacion")) {
          const v = val.toLowerCase();
          if (v.includes("planta") || v.includes("nombramiento") || v.includes("fijo") || v.includes("indefinido")) {
            tipo_vinculacion = "Instructor de planta";
          } else if (v.includes("contrat") || v.includes("prestacion") || v.includes("servicios")) {
            tipo_vinculacion = "Instructor por prestacion de servicios";
          } else {
            tipo_vinculacion = "Instructor por prestacion de servicios";
          }
        } else if (normalizedKey === "tipo_documento" || normalizedKey === "tipo de documento" || normalizedKey === "tipo documento") {
          tipo_documento = val;
        }
      }
      
      if (rolForzado) {
        rol = rolForzado;
      }
      
      const isRowEmpty = Object.values(row).every(v => v === null || v === undefined || String(v).trim() === "");
      if (isRowEmpty) continue;
      if (!documento || !nombres_apellidos) continue;

      documento = documento.replace(/\D/g, '');
      if (!documento) continue;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        email = `${documento}@sena.edu.co`;
      }
      const rolEncontrado = rolesValidos.find(r => r.toLowerCase() === rol.toLowerCase());
      if (!rolEncontrado) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El rol "${rol}" no es válido. Roles permitidos: ${rolesValidos.join(", ")}`);
        continue;
      }
      rol = rolEncontrado;

      try {
        const hashedPassword = await bcrypt.hash(documento, 10);

        // Si es Instructor -> Se guarda EXCLUSIVAMENTE en la tabla instructores
        if (rol.toLowerCase() === 'instructor') {
          const existInstDoc = await InstructorModel.findOne({ where: { documento } });
          if (existInstDoc) {
            if (tipo_vinculacion) {
              await existInstDoc.update({ tipo_vinculacion });
            }
            omitidos++;
            continue;
          }
          const existInstEmail = await InstructorModel.findOne({ where: { email } });
          if (existInstEmail) {
            omitidos++;
            continue;
          }

          await InstructorModel.create({
            documento,
            nombres_apellidos,
            email,
            password: hashedPassword,
            telefono,
            tipo_vinculacion,
            estado: 'activo',
            id_usuario: null
          });
          creados++;
          continue;
        }

        // Si es Gestor, Pasante o Administrador -> Se guarda en la tabla usuarios
        const existDoc = await UserModel.findOne({ where: { documento } });
        if (existDoc) {
          omitidos++;
          continue;
        }
        const existEmail = await UserModel.findOne({ where: { email } });
        if (existEmail) {
          omitidos++;
          continue;
        }

        await UserModel.create({
          uuid: uuidv4(),
          tipo_documento: tipo_documento || 'CC',
          documento,
          nombres_apellidos,
          email,
          password: hashedPassword,
          rol,
          estado: 'activo'
        });

        creados++;
      } catch (err) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): ${err.message}`);
      }
    }

    if (creados > 0) {
      await registrarLog(userEmailLog || 'ADMIN', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', `Se importaron ${creados} registros desde Excel`);
    }
    return { creados, omitidos, errores };
  }

  // Solicita restablecimiento de contraseña verificando que el correo exista en usuarios o instructores
  async resetPassword(email) {
    const emailClean = (email || "").trim().toLowerCase();
    if (!emailClean) {
      throw new Error("Debes ingresar un correo electrónico válido.");
    }

    // 1. Buscar primero en la tabla de usuarios (Admin, Gestor, Pasante)
    const user = await UserModel.findOne({ where: { email: emailClean } });
    if (user) {
      const tokenForPassword = jwt.sign(
        { user: { id: user.id_usuario, tipo: 'usuario' } },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      await emailService.sendPasswordResetEmail(emailClean, tokenForPassword);
      return;
    }

    // 2. Buscar en la tabla de instructores
    const instructor = await InstructorModel.findOne({ where: { email: emailClean } });
    if (instructor) {
      const tokenForPassword = jwt.sign(
        { user: { id: instructor.id_instructor, tipo: 'instructor' } },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      await emailService.sendPasswordResetEmail(emailClean, tokenForPassword);
      return;
    }

    throw new Error("El correo electrónico ingresado no se encuentra registrado en el sistema.");
  }

  // Recibe la nueva contraseña y la actualiza en la tabla correspondiente (usuarios o instructores)
  async setNewPassword(data) {
    const { tokenForPassword, newPassword } = data;
    const decodificado = jwt.verify(tokenForPassword, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (decodificado.user.tipo === 'instructor') {
      const instructor = await InstructorModel.findByPk(decodificado.user.id);
      if (!instructor) throw new Error("Instructor no encontrado.");
      await instructor.update({ password: hashedPassword });
      return;
    }

    const user = await UserModel.findByPk(decodificado.user.id);
    if (!user) throw new Error("Usuario no encontrado.");
    await user.update({ password: hashedPassword });
    return;
  }
}

export default new UserService();
