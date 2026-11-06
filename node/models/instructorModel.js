import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const InstructorModel = sequelize.define('instructores', {
  id_instructor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  documento: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombres_apellidos: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo_vinculacion: {
    type: DataTypes.ENUM('Instructor de planta', 'Instructor por prestacion de servicios'),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  id_usuario: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  acepta_politicas: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default InstructorModel;
