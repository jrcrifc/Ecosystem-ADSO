// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";
// Importa la conexión a la base de datos
import db from "../database/db.js";

// Define el modelo de la tabla 'estadoxsolicitud' en la base de datos
const Estadoxsolicitud = db.define('estadoxsolicitud', {
  // Campo ID - clave primaria autoincrementable
  id_estadoxsolicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Campo id_solicitud - clave foránea que referencia a la solicitud
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  // Campo id_estado_solicitud - clave foránea que referencia al estado de solicitud
  id_estado_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  // Campo createdat - registro temporal de creación del cambio de estado
  createdat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  // Campo updatedat - registro temporal de última modificación
  updatedat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  // Forza el nombre exacto de la tabla en la base de datos
  tableName: 'estadoxsolicitud',
  // Desactiva timestamps automáticos porque se definen explícitamente
  timestamps: false
});

// Exporta el modelo de historial de estados de solicitud
export default Estadoxsolicitud;
