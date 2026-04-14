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
        references: { model: 'reactivos', key: 'id_reactivo' },
        onDelete: 'RESTRICT'
    },

    // ✅ Campos nuevos
    lote: {
    type: DataTypes.STRING,
    allowNull: true  // ← verifica que esté en true
},
fecha_ingreso: {
    type: DataTypes.DATEONLY,
    allowNull: true  // ← igual este
},

    cantidad_inicial: { 
        type: DataTypes.DECIMAL(10,3),
        allowNull: true,
        defaultValue: 0
    },
    id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: true,  // ← que esté en true
    references: { model: 'proveedor', key: 'id_proveedor' },
    onDelete: 'SET NULL'
},
    cantidad_salida: { 
        type: DataTypes.DECIMAL(10,3),
        allowNull: true,
        defaultValue: 0
    },
    estado_inventario: { 
        type: DataTypes.ENUM("en stock", "agotado"),
        allowNull: false
    },

}, {
    freezeTableName: true,
    timestamps: true
});

export default movimientoreactivoModel; // ← ¿está esta línea?