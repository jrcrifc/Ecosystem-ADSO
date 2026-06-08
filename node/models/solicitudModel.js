// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'solicitud_prestamos' en la base de datos
const solicitudModel = db.define('solicitud_prestamos', {
    // Campo ID - clave primaria autoincrementable
    id_solicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // Campo id_usuario - clave foránea que referencia al usuario solicitante
    id_usuario: { type: DataTypes.INTEGER },
    
    // Campo fecha_inicio - fecha de inicio del préstamo
    fecha_inicio: { type: DataTypes.DATE },
    
    // Campo fecha_fin - fecha de devolución del préstamo
    fecha_fin: { type: DataTypes.DATE },
    
    // Campo estado - estado lógico de la solicitud (1 activo, 0 inactivo)
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,
        allowNull: false 
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true
});

// Exporta el modelo de solicitud para ser usado en la aplicación
export default solicitudModel;
