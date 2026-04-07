import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const UserModel = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  documentos: { 
    type: DataTypes.STRING,
    allowNull: false
  },

  nombres: { 
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
    type: DataTypes.ENUM('Aprendiz', 'Pasante', 'Instructor'),
    allowNull: false,
    defaultValue: 'Aprendiz'
  }

}, {
  freezeTableName: true,
});

export default UserModel;