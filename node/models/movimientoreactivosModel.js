import db from "../database/db.js";
import { DataTypes } from "sequelize";

const movimientoreactivoModel = db.define('movimientos_reactivos', {
    id_movimiento_reactivo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reactivos',
            key: 'id_reactivo'
        },
        onDelete: 'RESTRICT'   // no dejes borrar reactivo si tiene movimientos
    },
    cantidad_inicial: { 
        type: DataTypes.DECIMAL(10,3) 
    },
    lote: { 
        type: DataTypes.STRING
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'proveedor',
            key: 'id_proveedor'
        },
        onDelete: 'SET NULL'
    },
    cantidad_salida: { 
        type: DataTypes.DECIMAL(10,3) 
    },
    fecha_ingreso: { 
        type: DataTypes.DATE 
    },

    estado_inventario: { 
        type: DataTypes.ENUM("en stock","agotado"),
        allowNull: false
    },
    
}, {
    freezeTableName: true,
    timestamps: true       // ← si no tienes createdAt/updatedAt
});

export default movimientoreactivoModel;