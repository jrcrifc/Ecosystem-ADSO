// Importa la conexión a la base de datos
import db from '../database/db.js'
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'proveedor' en la base de datos
const proveedoresModel = db.define('proveedor', {
    // Campo ID - clave primaria autoincrementable
    id_proveedor: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    
    // Campo nom_proveedor - nombre de la empresa o proveedor
    nom_proveedor: {type: DataTypes.STRING},
    
    // Campo apel_proveedor - persona de contacto del proveedor
    apel_proveedor: {type: DataTypes.STRING},
    
    // Campo tel_proveedor - teléfono de contacto del proveedor
    tel_proveedor: {type: DataTypes.STRING},
    
    // Campo dir_proveedor - dirección física del proveedor
    dir_proveedor: {type: DataTypes.STRING},
    
    // Campo estado - estado de activación del proveedor
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,
        allowNull: false 
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
});

// Exporta el modelo de proveedores para ser usado en la aplicación
export default proveedoresModel;