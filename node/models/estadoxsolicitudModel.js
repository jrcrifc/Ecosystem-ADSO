import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Estadoxsolicitud = db.define('estadoxsolicitud', {
	id_estadoxsolicitud: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	id_solicitud: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	id_estado_solicitud: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	createdat: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW
	},
	updatedat: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW
	}
}, {
	tableName: 'estadoxsolicitud',
	timestamps: false
});

export default Estadoxsolicitud;
