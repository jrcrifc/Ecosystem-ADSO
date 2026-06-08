// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';
// Importa la conexión a la base de datos
import sequelize from '../database/db.js';

// Define el modelo de la tabla 'configuracion' en la base de datos
const ConfigModel = sequelize.define('configuracion', {
  // Campo ID - clave primaria autoincrementable
  id_config: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  
  // Campo clave - identificador único de la configuración
  clave: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  
  // Campo valor - valor asignado a la clave de configuración
  valor: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  
  // Campo descripcion - descripción del propósito de esta configuración
  descripcion: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true,
  // Activa los campos createdAt y updatedAt
  timestamps: true
});

// Exporta el modelo de configuración para ser usado en la aplicación
export default ConfigModel;
