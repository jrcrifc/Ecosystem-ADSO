import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const UserModel = sequelize.define('usuarios', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  documento: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  nombres_apellidos: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  uuid: { type: DataTypes.STRING },
  token: { type: DataTypes.STRING },
  rol: {
    type: DataTypes.ENUM('Aprendiz', 'Pasante', 'Gestor', 'Instructor', 'Administrador'),
    allowNull: false,
    defaultValue: 'Aprendiz'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'inactivo'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  reset_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
    defaultValue: null
  },
  reset_code_expires: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  failed_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  numero_ficha: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  nombre_ficha: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  es_sena_empresa: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  freezeTableName: true,
});

export default UserModel;