// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla pivote 'solicitudxequipo' en la base de datos
const solicitudxequipoModel = db.define('solicitudxequipo', {
    // Campo ID - clave primaria autoincrementable de la relación pivote
    id_solicitudxequipo: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    
    // Campo id_solicitud - clave foránea que referencia a la solicitud
    id_solicitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'solicitud',
        key: 'id_solicitud'
      },
      onDelete: 'CASCADE'
    },
    
    // Campo id_equipo - clave foránea que referencia al equipo solicitado
    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id_equipo'
      },
      onDelete: 'CASCADE'
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true
});

// Exporta el modelo de relación solicitud-equipo
export default solicitudxequipoModel;
