// Importa la conexión a la base de datos
import db from "../database/db.js";
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from "sequelize";

// Define el modelo de la tabla 'movimientos_reactivos' en la base de datos
const movimientoreactivoModel = db.define('movimientos_reactivos', {
    // Campo ID - clave primaria autoincrementable
    id_movimiento_reactivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // Campo id_reactivo - clave foránea que referencia al reactivo asociado
    id_reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reactivos', key: 'id_reactivo' },
        onDelete: 'RESTRICT'
    },
    
    // Campo lote - código o nombre del lote del fabricante
    lote: { type: DataTypes.STRING, allowNull: true },
    
    // Campo fecha_vencimiento - fecha de caducidad del lote
    fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: true },
    
    // Campo cantidad_inicial - cantidad física con la que ingresó el lote
    cantidad_inicial: {
        type: DataTypes.DECIMAL(10,3),
        allowNull: true,
        defaultValue: 0
    },
    
    // Campo id_proveedor - clave foránea que referencia al proveedor
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'proveedor', key: 'id_proveedor' },
        onDelete: 'SET NULL'
    },
    
    // Campo cantidad_salida - cantidad acumulada retirada de este lote
    cantidad_salida: {
        type: DataTypes.DECIMAL(10,3),
        allowNull: true,
        defaultValue: 0
    },
    
    // Campo estado - estado lógico de activación del movimiento
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
}, {
    // Evita la pluralización automática del nombre de la tabla
    freezeTableName: true,
    // Activa los campos createdAt y updatedAt
    timestamps: true
});

// Exporta el modelo de movimientos de reactivos
export default movimientoreactivoModel;