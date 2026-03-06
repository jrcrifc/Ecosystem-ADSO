import db from "../database/db.js";
import { DataTypes } from "sequelize";

const salidasModel = db.define('salidas_reactivos', {
    id_salida: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_movimiento_reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'movimientos_reactivos',
        key: 'id_movimiento_reactivo'
    },
  onDelete: 'CASCADE'
},
    
   fecha_salida: { 
        type: DataTypes.DATE 
    },
}, {
    freezeTableName: true,
    timestamps: true       // ← si no tienes createdAt/updatedAt
});

export default salidasModel;