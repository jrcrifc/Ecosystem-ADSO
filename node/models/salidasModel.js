import db from "../database/db.js";
import { DataTypes } from "sequelize";

const salidasModel = db.define('salidas_reactivos', {
    id_salida: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_inventario_reactivo: { 
        type: DataTypes.INTEGER,  
    },
    cantidad_salida: { 
        type: DataTypes.DECIMAL(10,3) 
    },
    
    fecha_salida: { 
        type: DataTypes.DATE 
    },
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,
        allowNull: false 
    },
}, {
    freezeTableName: true,
    timestamps: true       // ← si no tienes createdAt/updatedAt
});

export default salidasModel;