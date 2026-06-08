// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'estadoxequipo' en la base de datos
const estadoxEquipoModel = db.define('estadoxequipo', {
  // Campo ID - clave primaria autoincrementable
  id_estadoxequipo: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  // Campo id_equipo - clave foránea que referencia al equipo
  id_equipo: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Campo id_estado_equipo - clave foránea que referencia al estado del equipo
  id_estado_equipo: {   
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true,
  // Activa los campos createdAt y updatedAt
  timestamps: true
});

// Exporta el modelo de historial de estados de equipo
export default estadoxEquipoModel;