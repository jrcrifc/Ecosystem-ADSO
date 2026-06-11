import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const AprendizModel = sequelize.define('aprendices', {
  id_aprendiz: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
  id_ficha: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tipo_direccion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estrato: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  estado_civil: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tipo_aprendiz: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre_responsable: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  telefono_responsable: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email_responsable: {
    type: DataTypes.STRING(255),
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

export default AprendizModel;
