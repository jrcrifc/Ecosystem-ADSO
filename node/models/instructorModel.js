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
  tipo_vinculacion: {
    type: DataTypes.ENUM('Planta', 'Contrato'),
    allowNull: true
  },
  correo_personal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  programa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_usuario: { 
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default InstructorModel;
