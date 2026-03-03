import db from '../database/db.js'
import { DataTypes } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const TABLE_NAME = process.env.USER_TABLE || 'usuarios'

const userModel = db.define(TABLE_NAME, {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_usuario' },
    userEmail: { type: DataTypes.STRING, unique: true, allowNull: false, field: 'documento' },
    password: { type: DataTypes.STRING, field: 'contraseña' },
    userType: { type: DataTypes.STRING, defaultValue: 'aprendiz', field: 'tipo_usuario' },
    // flag to indicate administrative privileges
    admin: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'admin' }
}, {
    tableName: TABLE_NAME,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default userModel;
