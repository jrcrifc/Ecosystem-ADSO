// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'cuentadantes' en la base de datos
const cuentadanteModel = db.define('cuentadantes', {
    // Campo ID - clave primaria autoincrementable
    id_cuentadante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Campo nom_cuentadante - nombres de la persona responsable
    nom_cuentadante: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    // Campo apell_cuentadante - apellidos de la persona responsable
    apell_cuentadante: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    // Campo tel_cuentadante - teléfono de contacto del cuentadante
    tel_cuentadante: {
        type: DataTypes.STRING(20)
    },

    // Campo estado - estado administrativo del cuentadante
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'activo'
    }

}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Desactiva las marcas de tiempo automáticas
    timestamps: false
});

// Exporta el modelo de cuentadante para ser usado en la aplicación
export default cuentadanteModel;