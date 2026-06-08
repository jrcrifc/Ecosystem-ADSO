// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'estado_equipo' en la base de datos
const estadoEquipoModel = db.define('estado_equipo', {
    // Campo ID - clave primaria autoincrementable
    id_estado_equipo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    // Campo estado - enum con los estados disponibles para equipos
    estado: { 
        type: DataTypes.ENUM("disponible", "mantenimiento", "solicitado", "prestado"),
        allowNull: false
    },
    
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Activa los campos createdAt y updatedAt
    timestamps: true
});

// Exporta el modelo de estados de equipo
export default estadoEquipoModel;