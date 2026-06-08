// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';
// Importa la conexión a la base de datos
import sequelize from '../database/db.js';

// Define el modelo de la tabla 'usuarios' en la base de datos
const UserModel = sequelize.define('usuarios', {
  // Campo ID - clave primaria autoincrementable
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  
  // Campo documento - cédula o documento de identidad del usuario
  documento: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo nombres_apellidos - nombre completo del usuario
  nombres_apellidos: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo email - correo electrónico único del usuario
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  // Campo password - contraseña encriptada con bcrypt
  password: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo uuid - identificador único universal para procesos internos
  uuid: { type: DataTypes.STRING },
  
  // Campo token - token JWT actual de autenticación
  token: { type: DataTypes.STRING },
  
  // Campo rol - enum con los roles disponibles en el sistema
  rol: {
    type: DataTypes.ENUM('Aprendiz', 'Pasante', 'Gestor', 'Instructor', 'Administrador'),
    allowNull: false,
    defaultValue: 'Aprendiz'
  },
  
  // Campo estado - estado de la cuenta (pendiente, aprobado, rechazado, inactivo)
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'inactivo'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  
  // Campo reset_code - código de 6 dígitos para recuperación de contraseña
  reset_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
    defaultValue: null
  },
  
  // Campo reset_code_expires - fecha de expiración del código de recuperación
  reset_code_expires: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  
  // Campo failed_attempts - contador de intentos fallidos al verificar código
  failed_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Campo numero_ficha - número de la ficha SENA del usuario
  numero_ficha: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  
  // Campo nombre_ficha - nombre del programa de formación
  nombre_ficha: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  
  // Campo es_sena_empresa - indica si pertenece al programa SENA Empresa
  es_sena_empresa: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true,
});

// Exporta el modelo de usuario para ser usado en la aplicación
export default UserModel;