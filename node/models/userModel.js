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
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat'
});

export default UserModel;