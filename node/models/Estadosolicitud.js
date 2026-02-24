import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoSolicitud = db.define('movimientos_reactivos', {
    id_movimiento_reactivo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_reactivo: { 
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    cantidad_inicial: { 
        type: DataTypes.DECIMAL(10,3),
        allowNull: false
    },
    lote: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    id_proveedor: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_salida: { 
        type: DataTypes.DECIMAL(10,3),
        allowNull: true
    },
    fecha_ingreso: { 
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_inventario: { 
        type: DataTypes.ENUM("en stock","agotado"),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true
});

export default estadoSolicitud;