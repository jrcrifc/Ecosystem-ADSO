import db from "../database/db.js";
import { DataTypes } from "sequelize";

const consumosreactivosModel = db.define('consumos_reactivos',{
    id_consumo_reactivos: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_reactivo: { type: DataTypes.INTEGER },
    id_lote: { type: DataTypes.INTEGER },
    cantidad: { type: DataTypes.DECIMAL(10,2) },
    id_responsable: { type: DataTypes.INTEGER },
    estado: { 
    type: DataTypes.TINYINT, 
    defaultValue: 1,   // ACTIVO por defecto
    allowNull: false 
},
}, {
    freezeTableName: true,
    timestamps: true, // esto usa createdAt y updatedAt automáticamente
});

export default consumosreactivosModel;
