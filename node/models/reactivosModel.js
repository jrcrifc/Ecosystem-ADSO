import db from "../database/db.js";
import { DataTypes } from "sequelize";

const reactivosModel = db.define('reactivos',{
    id_reactivo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    presentacion_reactivo: {  type: DataTypes.ENUM("kilogramos","gramos","litros","sobres"),
                            allowNull: false },
    cantidad_presentacion: { type: DataTypes.INTEGER },
    nom_reactivo: { type: DataTypes.STRING },
    nom_reactivo_ingles: { type: DataTypes.STRING },
    formula_reactivo: { type: DataTypes.STRING},
    color_almacenamiento: { type: DataTypes.ENUM("Peligro para la salud","Inflamabilidad","N/A","Peligro de contacto","Riesgo minimo","Riesgo de reactividad","Preparados")},
    color_stand: { type: DataTypes.ENUM("Morado","Negro","Agua marina","Rosado","Fucsia","Gris claro","Ciruela","Purpura","Marron","Gris oscuro","Cafe")},
    stand: { type: DataTypes.STRING},
    columna: { type: DataTypes.STRING},
    fila: { type: DataTypes.STRING},
    clasificacion_reactivo: { type: DataTypes.ENUM('Peligro de contacto','Peligro de reactividad','Peligro de inflamabilidad','Riesgo minimo','Peligro para salud','Evalué el almacenamiento individualmente')},
    existencia_reactivo: { type: DataTypes.ENUM("SI","NO")},
    estado: { 
    type: DataTypes.TINYINT, 
    defaultValue: 1,   // ACTIVO por defecto
    allowNull: false 
},
}, {
    freezeTableName: true,
    timestamps: true, // esto usa createdAt y updatedAt automáticamente
});

export default reactivosModel;
