// ============================================================
// 👥 SERVICIO DE USUARIOS (UserService)
// Este servicio orquesta toda la lógica de negocio relacionada con
// la gestión de usuarios: registro, login, asignación de roles,
// procesos de aprobación, cambio de perfiles y contraseñas, e
// importación masiva desde archivos de Excel.
// ============================================================

// Importa el modelo de usuario para acceder a la tabla de usuarios en la base de datos
import UserModel from "../models/userModel.js";
// Importa bcrypt para el encriptado y verificación de contraseñas
import bcrypt from "bcrypt";
// Importa jsonwebtoken para la generación de tokens JWT
import jwt from "jsonwebtoken";
// Importa uuid para la generación de identificadores únicos
import { v4 as uuidv4 } from "uuid";
// Importa el servicio de notificaciones para alertar a administradores
import NotificacionService from "./notificacionService.js";
// Importa el servicio de correos electrónicos para notificaciones por email
import emailService from "./emailService.js";
// Importa la función de registro de auditoría
import { registrarLog } from "./logService.js";
// Importa la función para obtener el servidor Socket.io
import { getIO } from "../socket.js";
// Importa la librería XLSX para procesar archivos de Excel
import XLSX from "xlsx";

// Define la clase de servicio para usuarios con registro, login, aprobación e importación masiva
class UserService {

  // Crea el administrador predeterminado del sistema si no existe en la base de datos
  async crearAdminPredeterminado() {
    try {
      // Busca si ya existe un administrador con el correo predeterminado
      const adminExistente = await UserModel.findOne({ where: { email: 'admin@laboratorio.com' } });
      // Si no existe, lo crea
      if (!adminExistente) {
        // Encripta la contraseña por defecto con un factor de costo de 10
        const passwordHash = await bcrypt.hash('Admin1234!', 10);
        // Crea el administrador en la base de datos
        await UserModel.create({
          documento: '000000000',
          nombres_apellidos: 'Administrador Ecosystem',
          email: 'admin@laboratorio.com',
          password: passwordHash,
          rol: 'Administrador',
          estado: 'aprobado',
          uuid: uuidv4()
        });
        // Muestra mensaje de confirmación con credenciales
        console.log('✅ Admin creado → admin@laboratorio.com / Admin1234!');
      } else {
        // Muestra mensaje si el administrador ya existe
        console.log('ℹ️ Admin ya existe');
      }
    } catch (error) {
      // Muestra en consola si ocurre un error al crear el administrador
      console.error('❌ Error al crear admin:', error);
    }
  }

  // Registra un nuevo usuario en el sistema con validaciones del lado del servidor
  async registerUser(data) {
    // Desestructura los datos del formulario de registro
    let { documento, nombres_apellidos, email, password, rol, numero_ficha, nombre_ficha, es_sena_empresa } = data;
    // Limpia y normaliza espacios y minúsculas en los campos de texto
    documento = (documento || "").trim();
    nombres_apellidos = (nombres_apellidos || "").trim();
    email = (email || "").trim().toLowerCase();
    numero_ficha = numero_ficha ? String(numero_ficha).trim() : null;
    nombre_ficha = nombre_ficha ? String(nombre_ficha).trim() : null;
    const esSenaEmpresa = !!es_sena_empresa;
    // VALIDACIONES DE SEGURIDAD EN EL SERVIDOR
    // Valida que el documento contenga solo números
    if (!/^\d+$/.test(documento)) throw new Error("El documento debe contener solo números");
    // Valida que se hayan ingresado nombres y apellidos completos
    if (nombres_apellidos.split(" ").length < 2) throw new Error("Por favor ingresa nombres y apellidos completos");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Valida el formato del correo electrónico
    if (!emailRegex.test(email)) throw new Error("El formato del correo electrónico no es válido");
    // Valida que la contraseña tenga al menos 8 caracteres
    if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");
    // Verifica si el correo ya está registrado
    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) throw new Error("El correo electrónico ya está registrado");
    // Verifica si el número de documento ya está registrado
    const existDoc = await UserModel.findOne({ where: { documento } });
    if (existDoc) throw new Error("Ya existe un usuario con ese número de documento");
    // Encripta la contraseña con un factor de costo de 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea el usuario en la base de datos con estado pendiente por defecto
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
    // Registra la acción en la tabla de auditoría
    await registrarLog(email, 'REGISTRO', 'AUTH', `Usuario registrado como ${rol}`);
    // Notifica a los administradores si el nuevo usuario requiere aprobación
    if (['Pasante', 'Gestor', 'Aprendiz', 'Instructor'].includes(rol)) {
      // Registra notificación en el sistema para el panel del administrador
      await NotificacionService.notificarAdmins({
        id_usuario_origen: user.id_usuario,
        titulo: '👤 Nuevo usuario pendiente de aprobación',
        mensaje: `${nombres_apellidos} se registró como ${rol} y está esperando aprobación para acceder al sistema.`,
        tipo: 'solicitud_acceso'
      });
      // Envía correos electrónicos de aviso a los administradores activos
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
    // Retorna datos del usuario omitiendo la contraseña por seguridad
    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  // Inicia sesión de un usuario validando credenciales y generando token JWT
  async loginUser(data) {
    const { email, password } = data;
    // Verifica que la variable de entorno JWT_SECRET esté configurada
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado. Revisa tu archivo .env");
    }
    // Busca el usuario por correo electrónico
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error("Usuario y contraseña incorrectos");
    // Verifica la contraseña encriptada
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Usuario y contraseña incorrectos");
    // Verifica restricciones de estado de cuenta
    if (user.estado === 'rechazado') {
      throw new Error("Tu cuenta fue rechazada. Contacta al administrador del Laboratorio Ambiental.");
    }
    if (user.estado === 'inactivo') {
      throw new Error("Tu cuenta está inactiva. Contacta al administrador del Laboratorio Ambiental.");
    }
    // Genera token JWT con firma y expiración de 8 horas
    const token = jwt.sign(
      { id: user.id_usuario, uuid: user.uuid, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    user.token = token;
    await user.save();
    // Guarda en la bitácora de auditoría
    await registrarLog(user.email, 'LOGIN', 'AUTH', `Inicio de sesión exitoso`);
    // Retorna el token y datos del usuario sin la contraseña
    const { password: _, ...userSinPassword } = user.toJSON();
    return { token, user: userSinPassword };
  }

  // Obtiene una lista de todos los usuarios registrados excluyendo password y token
  async getTodos() {
    return await UserModel.findAll({
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // Obtiene únicamente los usuarios pendientes de aprobación
  async getPendientes() {
    return await UserModel.findAll({
      where: { estado: 'pendiente' },
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // Aprueba la cuenta de un usuario pendiente y le envía notificaciones
  async aprobarUsuario(id) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Cambia el estado del usuario a aprobado
    await user.update({ estado: 'aprobado' });
    // Crea notificación interna para mostrar en la campana del usuario
    await NotificacionService.crearNotificacion({
      id_usuario_origen: null,
      id_usuario_destino: user.id_usuario,
      titulo: '¡Cuenta Aprobada!',
      mensaje: 'El administrador ha aprobado tu cuenta. Ya puedes acceder a todas las funcionalidades.',
      tipo: 'aprobado'
    });
    // Envía correo de aprobación al usuario
    await emailService.sendAprovalEmail(user.email, user.nombres_apellidos);
    // Guarda log de auditoría
    await registrarLog('ADMIN', 'APROBAR_USUARIO', 'GESTION_USUARIOS', `Aprobado usuario: ${user.email}`);
    // Retorna el usuario actualizado
    return user;
  }

  // Rechaza la cuenta de un usuario y fuerza cierre de sesión por WebSocket
  async rechazarUsuario(id) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Cambia el estado del usuario a rechazado
    await user.update({ estado: 'rechazado' });
    try {
      // Fuerza cierre de sesión inmediato en el cliente mediante WebSockets
      const io = getIO();
      io.to(`user_${id}`).emit("force_logout", {
        mensaje: "Tu cuenta ha sido rechazada por el administrador. Contacta al soporte si crees que es un error."
      });
    } catch (err) {
      console.error("No se pudo emitir force_logout:", err);
    }
    // Guarda log de auditoría
    await registrarLog('ADMIN', 'RECHAZAR_USUARIO', 'GESTION_USUARIOS', `Rechazado usuario: ${user.email}`);
    // Retorna el usuario actualizado
    return user;
  }

  // Activa o inactiva a un usuario y notifica o expulsa según corresponda
  async toggleActivoUsuario(id) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Determina el nuevo estado invirtiendo el actual
    const nuevoEstado = user.estado === 'inactivo' ? 'aprobado' : 'inactivo';
    await user.update({ estado: nuevoEstado });
    // Si el nuevo estado es inactivo, fuerza cierre de sesión
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
      // Si se reactivó, envía notificación de bienvenida
      await NotificacionService.crearNotificacion({
        id_usuario_origen: null,
        id_usuario_destino: user.id_usuario,
        titulo: '¡Cuenta Reactivada!',
        mensaje: 'El administrador ha reactivado tu cuenta. Ya puedes acceder al sistema.',
        tipo: 'aprobado'
      });
      await registrarLog('ADMIN', 'ACTIVAR_USUARIO', 'GESTION_USUARIOS', `Reactivado usuario: ${user.email}`);
    }
    // Retorna los datos del usuario con el nuevo estado
    return { ...user.toJSON(), estado: nuevoEstado };
  }

  // Obtiene los datos de un usuario por su clave primaria
  async getById(id) {
    return await UserModel.findByPk(id, {
      attributes: { exclude: ['password', 'token'] }
    });
  }

  // Actualiza la información básica del perfil de un usuario
  async updateProfile(id, data) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Actualiza los datos del perfil
    await user.update({
      nombres_apellidos: data.nombres_apellidos,
      email: data.email,
      numero_ficha: data.numero_ficha ? String(data.numero_ficha).trim() : null,
      nombre_ficha: data.nombre_ficha ? String(data.nombre_ficha).trim() : null,
      es_sena_empresa: !!data.es_sena_empresa
    });
    // Retorna el usuario actualizado
    return user;
  }

  // Cambia la contraseña de un usuario validando primero su contraseña actual
  async changePassword(id, { passwordActual, passwordNueva }) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Verifica que la contraseña actual sea correcta
    const isValid = await bcrypt.compare(passwordActual, user.password);
    if (!isValid) throw new Error("La contraseña actual es incorrecta");
    // Encripta la nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    // Actualiza la contraseña en la base de datos
    await user.update({ password: hashedPassword });
    // Guarda log de auditoría
    await registrarLog(user.email, 'CAMBIO_PASSWORD', 'PERFIL', `Contraseña actualizada correctamente`);
    // Retorna true indicando que el cambio fue exitoso
    return true;
  }

  // Importa usuarios de forma masiva desde un archivo de Excel
  async importarExcel(buffer, userEmailLog) {
    // Lee el archivo Excel desde el buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    // Obtiene el nombre de la primera hoja
    const sheetName = workbook.SheetNames[0];
    // Obtiene la primera hoja del libro
    const sheet = workbook.Sheets[sheetName];
    // Convierte los datos de la hoja a JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    // Inicializa contadores de creados, omitidos y errores
    let creados = 0;
    let omitidos = 0;
    let errores = [];
    // Define los roles válidos en el sistema
    const rolesValidos = ['Aprendiz', 'Pasante', 'Gestor', 'Instructor', 'Administrador'];
    // Recorre cada fila del Excel para procesar los usuarios
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2;
      // Inicializa campos a mapear de forma flexible
      let documento = "";
      let nombres_apellidos = "";
      let email = "";
      let rol = "Aprendiz";
      let numero_ficha = null;
      let nombre_ficha = null;
      let es_sena_empresa = false;
      // Mapea cada columna buscando variaciones ortográficas comunes
      for (const key of Object.keys(row)) {
        // Normaliza la clave eliminando tildes y espacios
        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();
        // Mapea la columna de documento con distintas variantes
        if (normalizedKey === "documento" || normalizedKey === "identificacion" || normalizedKey === "documento de identidad" || normalizedKey === "cedula") {
          documento = val;
        // Mapea la columna de nombres y apellidos con distintas variantes
        } else if (normalizedKey === "nombres_apellidos" || normalizedKey === "nombres" || normalizedKey === "apellidos" || normalizedKey === "nombres y apellidos" || normalizedKey === "nombre completo") {
          nombres_apellidos = val;
        // Mapea la columna de email con distintas variantes
        } else if (normalizedKey === "email" || normalizedKey === "correo" || normalizedKey === "correo electronico") {
          email = val.toLowerCase();
        // Mapea la columna de rol
        } else if (normalizedKey === "rol") {
          rol = val;
        // Mapea la columna de número de ficha con distintas variantes
        } else if (normalizedKey === "numero_ficha" || normalizedKey === "ficha" || normalizedKey === "numero de ficha") {
          numero_ficha = val;
        // Mapea la columna de nombre de ficha con distintas variantes
        } else if (normalizedKey === "nombre_ficha" || normalizedKey === "nombre de ficha" || normalizedKey === "programa" || normalizedKey === "programa de formacion") {
          nombre_ficha = val;
        // Mapea la columna de es_sena_empresa con distintas variantes
        } else if (normalizedKey === "es_sena_empresa" || normalizedKey === "sena empresa" || normalizedKey === "sena-empresa") {
          es_sena_empresa = val.toLowerCase() === "si" || val.toLowerCase() === "sí" || val.toLowerCase() === "true" || val === "1";
        }
      }
      // Valida datos mínimos obligatorios
      if (!documento || !nombres_apellidos || !email) {
        errores.push(`Fila ${filaNum}: Faltan campos requeridos (Documento, Nombres/Apellidos o Email)`);
        continue;
      }
      // Valida que el documento contenga solo números
      if (!/^\d+$/.test(documento)) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El documento debe contener solo números`);
        continue;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Valida el formato del correo electrónico
      if (!emailRegex.test(email)) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El formato del correo electrónico no es válido`);
        continue;
      }
      // Valida si el rol leído del Excel existe en el sistema
      const rolEncontrado = rolesValidos.find(r => r.toLowerCase() === rol.toLowerCase());
      if (!rolEncontrado) {
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): El rol "${rol}" no es válido. Roles permitidos: ${rolesValidos.join(", ")}`);
        continue;
      }
      rol = rolEncontrado;
      try {
        // Evita duplicados por documento
        const existDoc = await UserModel.findOne({ where: { documento } });
        if (existDoc) {
          omitidos++;
          continue;
        }
        // Evita duplicados por correo electrónico
        const existEmail = await UserModel.findOne({ where: { email } });
        if (existEmail) {
          omitidos++;
          continue;
        }
        // Crea contraseña por defecto usando Sena más el número de documento
        const defaultPasswordText = `Sena${documento}`;
        const hashedPassword = await bcrypt.hash(defaultPasswordText, 10);
        // Crea el usuario en la base de datos con estado aprobado automáticamente
        await UserModel.create({
          uuid: uuidv4(),
          documento,
          nombres_apellidos,
          email,
          password: hashedPassword,
          rol,
          estado: 'aprobado',
          numero_ficha: numero_ficha || null,
          nombre_ficha: nombre_ficha || null,
          es_sena_empresa: !!es_sena_empresa
        });
        // Incrementa el contador de creados
        creados++;
      } catch (err) {
        // Agrega el error a la lista de errores
        errores.push(`Fila ${filaNum} (${nombres_apellidos}): ${err.message}`);
      }
    }
    // Si se crearon usuarios, registra la acción en la bitácora
    if (creados > 0) {
      await registrarLog(userEmailLog || 'ADMIN', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', `Se importaron ${creados} usuarios desde Excel`);
    }
    // Retorna el resumen de la importación
    return { creados, omitidos, errores };
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new UserService();
