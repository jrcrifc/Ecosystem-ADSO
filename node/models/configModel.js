import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const ConfigModel = sequelize.define('configuracion', {
  id_config: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  clave: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  valor: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  freezeTableName: true,
  timestamps: true
});

export default ConfigModel;
