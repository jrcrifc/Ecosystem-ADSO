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
// Importa Op de sequelize para operadores lógicos
import { Op } from "sequelize";
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
// Importa modelos adicionales para la lógica de importación
import ProgramaModel from "../models/programaModel.js";
import FichaModel from "../models/fichaModel.js";
import AprendizModel from "../models/aprendizModel.js";
import InstructorModel from "../models/instructorModel.js";

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
    let { documento, nombres_apellidos, email, rol, id_ficha, id_programa } = data;
    // Limpia y normaliza espacios y minúsculas en los campos de texto
    documento = (documento || "").trim();
    nombres_apellidos = (nombres_apellidos || "").trim();
    email = (email || "").trim().toLowerCase();
    // La contraseña por defecto será el mismo documento
    const password = documento;
    // VALIDACIONES DE SEGURIDAD EN EL SERVIDOR
    // Valida que el documento contenga solo números
    if (!/^\d+$/.test(documento)) throw new Error("El documento debe contener solo números");
    // Valida que se hayan ingresado nombres y apellidos completos
    if (nombres_apellidos.split(" ").length < 2) throw new Error("Por favor ingresa nombres y apellidos completos");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Valida el formato del correo electrónico
    if (!emailRegex.test(email)) throw new Error("El formato del correo electrónico no es válido");
    // Valida que el rol sea únicamente Pasante o Gestor para el registro manual
    if (!['Pasante', 'Gestor'].includes(rol)) {
      throw new Error("Solo los Pasantes y Gestores pueden registrarse manualmente.");
    }
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
      id_ficha,    // Se guarda la ficha seleccionada
      id_programa  // Se guarda el programa seleccionado
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

  // Inicia sesión de un usuario validando su documento como usuario y contraseña
  async loginUser(data) {
    // Se recibe documento como nombre de usuario y password (que también debe ser el documento)
    const { documento, password } = data;
    // Verifica que la variable de entorno JWT_SECRET esté configurada
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado. Revisa tu archivo .env");
    }
    // Busca el usuario por su número de documento o por su correo electrónico
    const user = await UserModel.findOne({ 
      where: { 
        [Op.or]: [
          { documento: documento },
          { email: documento }
        ]
      } 
    });
    if (!user) throw new Error("Documento/Correo o contraseña incorrectos");
    // Verifica la contraseña encriptada comparándola con la ingresada
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Documento o contraseña incorrectos");
    // Verifica restricciones de estado de cuenta
    if (user.estado === 'rechazado') {
      throw new Error("Tu cuenta fue rechazada. Contacta al administrador del Laboratorio Ambiental.");
    }
    if (user.estado === 'inactivo') {
      throw new Error("Tu cuenta está inactiva. Contacta al administrador del Laboratorio Ambiental.");
    }
    // Genera token JWT con firma y expiración de 8 horas
    const token = jwt.sign(
      { id: user.id_usuario, uuid: user.uuid, rol: user.rol, email: user.email },
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
      email: data.email
    });
    // Retorna el usuario actualizado
    return user;
  }

  // Cambia la contraseña de un usuario por parte de un administrador
  async changePasswordByAdmin(id, { nuevaPassword }) {
    // Busca el usuario por su ID
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    // Encripta la nueva contraseña ingresada por el admin
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    // Actualiza la contraseña en la base de datos
    await user.update({ password: hashedPassword });
    // Guarda log de auditoría
    await registrarLog('ADMIN', 'CAMBIO_PASSWORD', 'GESTION_USUARIOS', `Contraseña actualizada para el usuario ${user.documento}`);
    // Retorna true indicando que el cambio fue exitoso
    return true;
  }

  // Importa usuarios de forma masiva desde un archivo de Excel
  async importarExcel(buffer, userEmailLog, rolForzado = null) {
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
      // Campos extra para Instructor
      let correo_personal = null;
      let programa_instructor = null;
      let telefono = null;
      let tipo_vinculacion = null;
      // Campos extra para Aprendiz
      let tipo_documento = null;
      let fecha_nacimiento = null;
      let genero = null;
      let direccion = null;
      let tipo_direccion = null;
      let estrato = null;
      let estado_civil = null;
      let tipo_aprendiz = null;
      let nombre_responsable = null;
      let telefono_responsable = null;
      let email_responsable = null;
      // Mapea cada columna buscando variaciones ortográficas comunes
      for (const key of Object.keys(row)) {
        // Normaliza la clave eliminando tildes y espacios
        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();
        // Mapea la columna de documento con distintas variantes
        if (normalizedKey === "documento" || normalizedKey === "identificacion" || normalizedKey === "documento de identidad" || normalizedKey === "cedula" || normalizedKey.includes("documento") || normalizedKey.includes("cedula")) {
          documento = val;
        // Mapea la columna de nombres y apellidos con distintas variantes
        } else if (normalizedKey === "nombres_apellidos" || normalizedKey === "nombres" || normalizedKey === "apellidos" || normalizedKey === "nombres y apellidos" || normalizedKey === "nombre completo" || normalizedKey.includes("nombre") || normalizedKey.includes("apellido")) {
          nombres_apellidos = val;
        // Mapea la columna de email con distintas variantes
        } else if (normalizedKey === "email" || normalizedKey === "correo" || normalizedKey === "correo electronico" || normalizedKey.includes("correo") || normalizedKey.includes("email")) {
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
        // --- Campos extra para Instructor ---
        } else if (normalizedKey === "correo_personal" || normalizedKey === "correo personal") {
          correo_personal = val;
        } else if (normalizedKey === "telefono" || normalizedKey === "celular" || normalizedKey === "telefono de contacto") {
          telefono = val;
        } else if (normalizedKey.includes("vinculacion") || normalizedKey.includes("contrato") || normalizedKey.includes("tipo vinculacion")) {
          // Normalizar el valor a los permitidos por el ENUM ('Planta', 'Contrato')
          const v = val.toLowerCase();
          if (v.includes("planta") || v.includes("nombramiento") || v.includes("fijo") || v.includes("indefinido")) {
            tipo_vinculacion = "Planta";
          } else if (v.includes("contrat") || v.includes("prestacion") || v.includes("servicios")) {
            tipo_vinculacion = "Contrato";
          } else {
            tipo_vinculacion = "Contrato"; // Valor por defecto si hay algo pero no se reconoce bien
          }
        } else if (normalizedKey === "programa_instructor" || normalizedKey === "area" || normalizedKey === "tipo de programa") {
          programa_instructor = val;
        // --- Campos extra para Aprendiz ---
        } else if (normalizedKey === "tipo_documento" || normalizedKey === "tipo de documento" || normalizedKey === "tipo documento") {
          tipo_documento = val;
        } else if (normalizedKey === "fecha_nacimiento" || normalizedKey === "fecha de nacimiento" || normalizedKey === "nacimiento") {
          fecha_nacimiento = val;
        } else if (normalizedKey === "genero" || normalizedKey === "sexo") {
          genero = val;
        } else if (normalizedKey === "direccion" || normalizedKey === "direccion residencial") {
          direccion = val;
        } else if (normalizedKey === "tipo_direccion" || normalizedKey === "tipo de direccion" || normalizedKey === "zona") {
          tipo_direccion = val;
        } else if (normalizedKey === "estrato" || normalizedKey === "estrato socioeconomico") {
          estrato = val;
        } else if (normalizedKey === "estado_civil" || normalizedKey === "estado civil") {
          estado_civil = val;
        } else if (normalizedKey === "tipo_aprendiz" || normalizedKey === "tipo de aprendiz") {
          tipo_aprendiz = val;
        } else if (normalizedKey === "nombre_responsable" || normalizedKey === "nombre del responsable" || normalizedKey === "acudiente" || normalizedKey === "nombre responsable") {
          nombre_responsable = val;
        } else if (normalizedKey === "telefono_responsable" || normalizedKey === "telefono del responsable" || normalizedKey === "telefono responsable") {
          telefono_responsable = val;
        } else if (normalizedKey === "email_responsable" || normalizedKey === "correo del responsable" || normalizedKey === "correo responsable" || normalizedKey === "email del responsable") {
          email_responsable = val;
        }
      }
      
      // Sobrescribe el rol si se especificó rolForzado
      if (rolForzado) {
        rol = rolForzado;
      }
      
      // Ignorar filas completamente vacías
      const isRowEmpty = Object.values(row).every(v => v === null || v === undefined || String(v).trim() === "");
      if (isRowEmpty) continue;

      // Si no tiene documento O no tiene nombre, es una fila de separación/encabezado/subtotal — ignorar silenciosamente
      // Un registro real de instructor/aprendiz SIEMPRE tiene ambos campos
      if (!documento || !nombres_apellidos) continue;

      // Limpia TODOS los caracteres que no sean dígitos del documento (puntos, guiones, espacios, letras como "CC", etc.)
      documento = documento.replace(/\D/g, '');
      
      // Si después de limpiar no quedó ningún número, ignorar la fila
      if (!documento) continue;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Si no tiene correo, o el correo es inválido (ej: "N/A", "-", "no tiene", typos), le asignamos uno por defecto
      if (!email || !emailRegex.test(email)) {
        email = `${documento}@sena.edu.co`;
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
        // Crea contraseña por defecto usando el número de documento
        const password = documento;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Manejo de Programa y Ficha
        let id_programa = null;
        let id_ficha = null;

        if (nombre_ficha) {
          // Busca o crea el programa
          const [programa] = await ProgramaModel.findOrCreate({
            where: { nombre_programa: nombre_ficha },
            defaults: { estado: true }
          });
          id_programa = programa.id_programa;
        }

        if (numero_ficha) {
          // Busca o crea la ficha
          const [ficha] = await FichaModel.findOrCreate({
            where: { numero_ficha },
            defaults: { id_programa, estado: true }
          });
          id_ficha = ficha.id_ficha;
        }

        // Crea el usuario en la base de datos con estado aprobado automáticamente
        const nuevoUsuario = await UserModel.create({
          uuid: uuidv4(),
          documento,
          nombres_apellidos,
          email,
          password: hashedPassword,
          rol,
          estado: 'aprobado',
          id_ficha,
          id_programa
        });

        // Si es Aprendiz, se registra en su tabla con todos los campos extendidos
        if (rol.toLowerCase() === 'aprendiz') {
          await AprendizModel.create({
            documento,
            nombres_apellidos,
            email,
            id_ficha,
            tipo_documento,
            fecha_nacimiento,
            genero,
            direccion,
            tipo_direccion,
            telefono,
            estrato,
            estado_civil,
            tipo_aprendiz,
            nombre_responsable,
            telefono_responsable,
            email_responsable,
            id_usuario: nuevoUsuario.id_usuario
          });
        }
        
        // Si es Instructor, se registra en su tabla con todos los campos extendidos
        if (rol.toLowerCase() === 'instructor') {
          await InstructorModel.create({
            documento,
            nombres_apellidos,
            email,
            correo_personal,
            programa: programa_instructor,
            telefono,
            tipo_vinculacion,
            id_usuario: nuevoUsuario.id_usuario
          });
        }
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
