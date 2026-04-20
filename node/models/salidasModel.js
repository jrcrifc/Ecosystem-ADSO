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
    // ✅ NUEVO: cuánto sale en esta operación
    cantidad_salida: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        defaultValue: 0
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
    timestamps: true,
});

export default salidasModel;