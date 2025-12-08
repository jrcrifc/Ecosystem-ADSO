import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Equipo = db.define('equipos', {
  id_equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fech_inventario: { type: DataTypes.DATE },
  grupo_equipo: { type: DataTypes.STRING },
  nom_equipo: { type: DataTypes.STRING },
  marca_equipo: { type: DataTypes.STRING },
  cantidad_equipo: { type: DataTypes.INTEGER },
  no_placa: { type: DataTypes.STRING },
  nom_cuentadante: { type: DataTypes.STRING },
  observaciones: { type: DataTypes.TEXT },
  foto_equipo: { type: DataTypes.STRING }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'equipos'
});

export default Equipo;
