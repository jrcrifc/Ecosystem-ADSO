import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const UserModel = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    documentos: {type: DataTypes.STRING},
    nombres: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    uuid: {type: DataTypes.STRING},
    token: {type: DataTypes.STRING},
}, {
    freezeTableName: true,
});

export default UserModel;