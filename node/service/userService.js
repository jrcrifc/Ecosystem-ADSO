import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import NotificacionService from "./notificacionService.js";
import emailService from "./emailService.js";
import { registrarLog } from "./logService.js";
import { getIO } from "../socket.js";
import XLSX from "xlsx";

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
    let { documento, nombres_apellidos, email, password, rol, numero_ficha, nombre_ficha, es_sena_empresa } = data;

    // ✅ BLINDAJE: Limpieza y Normalización
    documento = (documento || "").trim();
    nombres_apellidos = (nombres_apellidos || "").trim();
    email = (email || "").trim().toLowerCase();
    numero_ficha = numero_ficha ? String(numero_ficha).trim() : null;
    nombre_ficha = nombre_ficha ? String(nombre_ficha).trim() : null;
    const esSenaEmpresa = !!es_sena_empresa;

    // ✅ VALIDACIONES DE SERVIDOR
    if (!/^\d+$/.test(documento)) throw new Error("El documento debe contener solo números");
    if (nombres_apellidos.split(" ").length < 2) throw new Error("Por favor ingresa nombres y apellidos completos");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("El formato del correo electrónico no es válido");

    if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");

    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) throw new Error("El correo electrónico ya está registrado");

    const existDoc = await UserModel.findOne({ where: { documento } });
    if (existDoc) throw new Error("Ya existe un usuario con ese número de documento");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      uuid: uuidv4(),
      documento,
      nombres_apellidos,
      email,
      password: hashedPassword,
      rol,
      estado: 'pendiente',
      numero_ficha,
      nombre_ficha,
      es_sena_empresa: esSenaEmpresa
    });

    await registrarLog(email, 'REGISTRO', 'AUTH', `Usuario registrado como ${rol}`);

    // ✅ Notificar al admin si requiere aprobación
    if (['Pasante', 'Gestor', 'Aprendiz', 'Instructor'].includes(rol)) {
      await NotificacionService.notificarAdmins({
        id_usuario_origen: user.id_usuario,
        titulo: '👤 Nuevo usuario pendiente de aprobación',
        mensaje: `${nombres_apellidos} se registró como ${rol} y está esperando aprobación para acceder al sistema.`,
        tipo: 'solicitud_acceso'
      });

      // ✅ ENVÍO DE EMAIL A ADMINS
      try {
        const admins = await UserModel.findAll({ where: { rol: 'Administrador', estado: 'aprobado' } });
        for (const admin of admins) {
          await emailService.notifyAdminNewUser(admin.email, {
            documento,
            nombres_apellidos,
            email,
            rol
          });
        }
      } catch (emailError) {
        console.error("❌ Error al enviar email de notificación a los admins:", emailError);
      }
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

    await registrarLog(user.email, 'LOGIN', 'AUTH', `Inicio de sesión exitoso`);

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
    
    // Crear notificación para el socket
    await NotificacionService.crearNotificacion({
      id_usuario_origen: null,
      id_usuario_destino: user.id_usuario,
      titulo: '¡Cuenta Aprobada!',
      mensaje: 'El administrador ha aprobado tu cuenta. Ya puedes acceder a todas las funcionalidades.',
      tipo: 'aprobado'
    });

    // Enviar correo de aprobación
    await emailService.sendAprovalEmail(user.email, user.nombres_apellidos);

    await registrarLog('ADMIN', 'APROBAR_USUARIO', 'GESTION_USUARIOS', `Aprobado usuario: ${user.email}`);

    return user;
  }

  async rechazarUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    await user.update({ estado: 'rechazado' });

    try {
      const io = getIO();
      io.to(`user_${id}`).emit("force_logout", {
        mensaje: "Tu cuenta ha sido rechazada por el administrador. Contacta al soporte si crees que es un error."
      });
    } catch (err) {
      console.error("No se pudo emitir force_logout:", err);
    }

    await registrarLog('ADMIN', 'RECHAZAR_USUARIO', 'GESTION_USUARIOS', `Rechazado usuario: ${user.email}`);

    return user;
  }

  // ✅ Activar/Inactivar usuario (toggle)
  async toggleActivoUsuario(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    const nuevoEstado = user.estado === 'inactivo' ? 'aprobado' : 'inactivo';
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

  // Obtener usuario por ID
  async getById(id) {
    return await UserModel.findByPk(id, {
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // Actualizar perfil básico
  async updateProfile(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    await user.update({
      nombres_apellidos: data.nombres_apellidos,
      email: data.email,
      numero_ficha: data.numero_ficha ? String(data.numero_ficha).trim() : null,
      nombre_ficha: data.nombre_ficha ? String(data.nombre_ficha).trim() : null,
      es_sena_empresa: !!data.es_sena_empresa
    });
    return user;
  }

  // Cambiar contraseña
  async changePassword(id, { passwordActual, passwordNueva }) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await bcrypt.compare(passwordActual, user.password);
    if (!isValid) throw new Error("La contraseña actual es incorrecta");

    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    await user.update({ password: hashedPassword });

    await registrarLog(user.email, 'CAMBIO_PASSWORD', 'PERFIL', `Contraseña actualizada correctamente`);

    return true;
  }

  // ✅ Importar usuarios desde un archivo Excel
  async importarExcel(buffer, userEmailLog) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    let creados = 0;
    let omitidos = 0;
    let errores = [];

    const rolesValidos = ['Aprendiz', 'Pasante', 'Gestor', 'Instructor', 'Administrador'];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2; // Fila 1 suele ser la cabecera

      // Mapear columnas de forma flexible
      let documento = "";
      let nombres_apellidos = "";
      let email = "";
      let rol = "Aprendiz";
      let numero_ficha = null;
      let nombre_ficha = null;
      let es_sena_empresa = false;

      for (const key of Object.keys(row)) {
        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();

        if (normalizedKey === "documento" || normalizedKey === "identificacion" || normalizedKey === "documento de identidad" || normalizedKey === "cedula") {
          documento = val;
        } else if (normalizedKey === "nombres_apellidos" || normalizedKey === "nombres" || normalizedKey === "apellidos" || normalizedKey === "nombres y apellidos" || normalizedKey === "nombre completo") {
          nombres_apellidos = val;
        } else if (normalizedKey === "email" || normalizedKey === "correo" || normalizedKey === "correo electronico") {
          email = val.toLowerCase();
        } else if (normalizedKey === "rol") {
          rol = val;
        } else if (normalizedKey === "numero_ficha" || normalizedKey === "ficha" || normalizedKey === "numero de ficha") {
          numero_ficha = val;
        } else if (normalizedKey === "nombre_ficha" || normalizedKey === "nombre de ficha" || normalizedKey === "programa" || normalizedKey === "programa de formacion") {
          nombre_ficha = val;
        } else if (normalizedKey === "es_sena_empresa" || normalizedKey === "sena empresa" || normalizedKey === "sena-empresa") {
          es_sena_empresa = val.toLowerCase() === "si" || val.toLowerCase() === "sí" || val.toLowerCase() === "true" || val === "1";
        }
      }

      // Validar campos obligatorios
      if (!documento || !nombres_apellidos || !email) {
        errores.push(`Fila ${filaNum}: Faltan campos requeridos (Documento, Nombres/Apellidos o Email)`);
        continue;
      }

      if (!/^\d+$/.test(documento)) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El documento debe contener solo números`);
        continue;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El formato del correo electrónico no es válido`);
        continue;
      }

      // Normalizar Rol
      const rolEncontrado = rolesValidos.find(r => r.toLowerCase() === rol.toLowerCase());
      if (!rolEncontrado) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El rol "${rol}" no es válido. Roles permitidos: ${rolesValidos.join(", ")}`);
        continue;
      }
      rol = rolEncontrado;

      try {
        // Verificar si ya existe por documento o email
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

        // Crear usuario
        const defaultPasswordText = `Sena${documento}`;
        const hashedPassword = await bcrypt.hash(defaultPasswordText, 10);

        await UserModel.create({
          uuid: uuidv4(),
          documento,
          nombres_apellidos,
          email,
          password: hashedPassword,
          rol,
          estado: 'aprobado', // Los importados por Excel se aprueban automáticamente
          numero_ficha: numero_ficha || null,
          nombre_ficha: nombre_ficha || null,
          es_sena_empresa: !!es_sena_empresa
        });

        creados++;
      } catch (err) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): ${err.message}`);
      }
    }

    if (creados > 0) {
      await registrarLog(userEmailLog || 'ADMIN', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', `Se importaron ${creados} usuarios desde Excel`);
    }

    return { creados, omitidos, errores };
  }
}


export default new UserService();