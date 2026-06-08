// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';
// Importa la conexión a la base de datos
import db from '../database/db.js';

// Define el modelo de la tabla 'auditoria' en la base de datos
const LogModel = db.define('auditoria', {
  // Campo ID - clave primaria autoincrementable
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Campo usuario - email o identificador del usuario que ejecutó la acción
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo accion - tipo de acción efectuada
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo modulo - módulo del sistema donde se produjo la acción
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo detalles - información adicional sobre la acción
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Campo fecha - fecha y hora de ejecución de la acción
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true,
  // Desactiva timestamps automáticos para evitar conflictos con el campo fecha manual
  timestamps: false
});

// Exporta el modelo de logs para ser usado en la aplicación
export default LogModel;
