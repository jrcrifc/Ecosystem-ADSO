// models/associations.js

import equipoModel from "./EquiposModel.js";
import cuentadanteModel from "./cuentadanteModel.js";
import movimientoreactivoModel from "./movimientoreactivosModel.js";
import reactivoModel from "./reactivosModel.js";
import proveedorModel from "./proveedoresModel.js";
import estadoxsolicitudModel from "./estadoxsolicitudModel.js";
import solicitudModel from "./solicitudModel.js";
import estadoxEquipoModel from "./estadoxequipoModel.js";
import solicitudxequipoModel from "./solicitudxequipoModel.js";
import salidasModel from "./salidasModel.js";
import userModel from "./userModel.js";
import estadoEquipoModel from "./Estado_equipoModel.js";
import estadoSolicitudModel from "./Estado_solicitudModel.js";

// ============================================================
// 🔗 EQUIPOS ↔ CUENTADANTE
// ============================================================
equipoModel.belongsTo(cuentadanteModel, { foreignKey: 'id_cuentadante', as: 'cuentadante' });
cuentadanteModel.hasMany(equipoModel,   { foreignKey: 'id_cuentadante', as: 'equipos' });

// ============================================================
// 🔗 MOVIMIENTOS DE REACTIVOS ↔ REACTIVO ↔ PROVEEDOR
// ============================================================
movimientoreactivoModel.belongsTo(reactivoModel,  { foreignKey: 'id_reactivo',  as: 'reactivo' });
reactivoModel.hasMany(movimientoreactivoModel,     { foreignKey: 'id_reactivo',  as: 'movimientos' });

movimientoreactivoModel.belongsTo(proveedorModel, { foreignKey: 'id_proveedor', as: 'proveedor' });
proveedorModel.hasMany(movimientoreactivoModel,   { foreignKey: 'id_proveedor', as: 'movimientos' });

// ============================================================
// 🔗 SALIDAS ↔ MOVIMIENTO DE REACTIVOS
// ============================================================
salidasModel.belongsTo(movimientoreactivoModel,  { foreignKey: 'id_movimiento_reactivo', as: 'movimiento' });
movimientoreactivoModel.hasMany(salidasModel,    { foreignKey: 'id_movimiento_reactivo', as: 'salidas' });

// ============================================================
// 🔗 ESTADO x SOLICITUD ↔ SOLICITUD + ESTADO SOLICITUD
// ============================================================
estadoxsolicitudModel.belongsTo(solicitudModel,      { foreignKey: 'id_solicitud',       as: 'solicitud' });
estadoxsolicitudModel.belongsTo(estadoSolicitudModel, { foreignKey: 'id_estado_solicitud', as: 'estadoSolicitud' });
solicitudModel.hasMany(estadoxsolicitudModel,         { foreignKey: 'id_solicitud',       as: 'estados' });
estadoSolicitudModel.hasMany(estadoxsolicitudModel,   { foreignKey: 'id_estado_solicitud', as: 'registros' });

// ============================================================
// 🔗 ESTADO x EQUIPO ↔ EQUIPO + ESTADO EQUIPO
// ============================================================
estadoxEquipoModel.belongsTo(equipoModel,      { foreignKey: 'id_equipo',        as: 'equipo' });
estadoxEquipoModel.belongsTo(estadoEquipoModel, { foreignKey: 'id_estado_equipo', as: 'estadoEquipo' });
equipoModel.hasMany(estadoxEquipoModel,         { foreignKey: 'id_equipo',        as: 'estadosEquipo' });
estadoEquipoModel.hasMany(estadoxEquipoModel,   { foreignKey: 'id_estado_equipo', as: 'registros' });

// ============================================================
// 🔗 SOLICITUD x EQUIPO ↔ SOLICITUD + EQUIPO
// ============================================================
solicitudxequipoModel.belongsTo(solicitudModel, { foreignKey: 'id_solicitud', as: 'solicitud' });
solicitudxequipoModel.belongsTo(equipoModel,    { foreignKey: 'id_equipo',    as: 'equipo' });
solicitudModel.hasMany(solicitudxequipoModel,   { foreignKey: 'id_solicitud', as: 'equiposSolicitud' });
equipoModel.hasMany(solicitudxequipoModel,      { foreignKey: 'id_equipo',    as: 'solicitudesEquipo' });

// ============================================================
// 🔗 SOLICITUD ↔ USUARIO
// ============================================================
solicitudModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'usuario' });
userModel.hasMany(solicitudModel,   { foreignKey: 'id_usuario', as: 'solicitudes' });