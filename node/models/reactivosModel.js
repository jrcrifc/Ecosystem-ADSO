// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'reactivos' en la base de datos
const reactivosModel = db.define('reactivos', {
    // Campo ID - clave primaria autoincrementable
    id_reactivo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        field: 'id_reactivo'
    },
    
    // Campo presentacion_reactivo - unidad de presentación del reactivo
    presentacion_reactivo: {
        type: DataTypes.ENUM("kilogramos", "gramos", "litros", "sobres"),
        allowNull: false
    },
    
    // Campo nom_reactivo - nombre del reactivo en español
    nom_reactivo: { type: DataTypes.STRING },
    
    // Campo nom_reactivo_ingles - nombre del reactivo en inglés
    nom_reactivo_ingles: { type: DataTypes.STRING },
    
    // Campo formula_reactivo - fórmula química del reactivo
    formula_reactivo: { type: DataTypes.STRING },
    
    // Campo color_almacenamiento - color de seguridad según normativas
    color_almacenamiento: {
        type: DataTypes.ENUM("Peligro para la salud", "Inflamabilidad", "N/A", "Peligro de contacto", "Riesgo minimo", "Riesgo de reactividad", "Preparados")
    },
    
    // Campo color_stand - color de etiqueta del stand de ubicación
    color_stand: {
        type: DataTypes.ENUM("Morado", "Negro", "Agua marina", "Rosado", "Fucsia", "Gris claro", "Ciruela", "Purpura", "Marron", "Gris oscuro", "Cafe")
    },
    
    // Campo stand - ubicación física del stand o estante
    stand: { type: DataTypes.STRING },
    
    // Campo columna - ubicación física de la columna del stand
    columna: { type: DataTypes.STRING },
    
    // Campo fila - ubicación física de la fila del stand
    fila: { type: DataTypes.STRING },
    
    // Campo clasificacion_reactivo - clasificación según tipo de peligrosidad
    clasificacion_reactivo: {
        type: DataTypes.ENUM('Peligro de contacto', 'Peligro de reactividad', 'Peligro de inflamabilidad', 'Riesgo minimo', 'Peligro para salud', 'Evalué el almacenamiento individualmente')
    },
    
    // Campo estado - estado del reactivo (1 activo, 0 inactivo)
    estado: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Activa las marcas de tiempo automáticas
    timestamps: true,
    // Mapea la columna createdAt al nombre real en la base de datos
    createdAt: 'createdat',
    // Mapea la columna updatedAt al nombre real en la base de datos
    updatedAt: 'updatedat'
});

// Exporta el modelo de reactivos para ser usado en la aplicación
export default reactivosModel;