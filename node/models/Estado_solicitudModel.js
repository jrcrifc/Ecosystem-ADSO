// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'estado_solicitud' en la base de datos
const estadosolicitudModel = db.define('estado_solicitud', {
    // Campo ID - clave primaria autoincrementable
    id_estado_solicitud: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    // Campo estado - enum con los estados del ciclo de vida de una solicitud
    estado: { 
        type: DataTypes.ENUM("generado", "aceptado", "prestado", "entregado", "cancelado", "rechazado"),
        allowNull: false
    },
    
    // Campo activo - flag de activación del estado
    activo: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }

}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Activa los campos createdAt y updatedAt
    timestamps: true
});

// Exporta el modelo de estados de solicitud
export default estadosolicitudModel;