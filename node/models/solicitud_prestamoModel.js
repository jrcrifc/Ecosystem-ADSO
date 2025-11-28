import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const solicitud_prestamoModel = db.define('solicitud_prestamos', { 
    id_solicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha_hora_registro: { type: DataTypes.DATE }, 
    id_equipo: { type: DataTypes.INTEGER },
    fecha_inicio: { type: DataTypes.DATE }, 
    fecha_fin: { type: DataTypes.DATE },
    estado_solicitud: { 
        type: DataTypes.ENUM('ENTREGADO', 'PROCESO', 'CANCELADO') 
    },
    id_persona_solicitante: { type: DataTypes.INTEGER }
    }, {
        //evitar la plurarizacion en la tabla
        freezeTableName : true
    }
        
    );
export default solicitud_prestamoModel;