// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'salidas_reactivos' en la base de datos
const salidasModel = db.define('salidas_reactivos', {
    // Campo ID - clave primaria autoincrementable
    id_salida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // Campo id_movimiento_reactivo - clave foránea que referencia al lote de origen
    id_movimiento_reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'movimientos_reactivos',
            key: 'id_movimiento_reactivo'
        },
        onDelete: 'CASCADE'
    },
    
    // Campo cantidad_salida - cantidad de reactivo sustraída en esta operación
    cantidad_salida: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        defaultValue: 0
    },
    
    // Campo fecha_salida - fecha y hora de la salida
    fecha_salida: {
        type: DataTypes.DATE
    },
    
    // Campo observaciones - notas explicativas de la salida
    observaciones: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
    },
    
    // Campo estado - estado de la salida (1 activo, 0 inactivo)
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Activa los campos createdAt y updatedAt
    timestamps: true,
});

// Exporta el modelo de salidas para ser usado en la aplicación
export default salidasModel;