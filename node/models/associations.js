// models/associations.js

// ← TODOS LOS IMPORTS ARRIBA
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
// 🔗 ESTADO x SOLICITUD ↔ SOLICITUD
// ============================================================
estadoxsolicitudModel.belongsTo(solicitudModel, { foreignKey: 'id_solicitud', as: 'solicitud' });
solicitudModel.hasMany(estadoxsolicitudModel,   { foreignKey: 'id_solicitud', as: 'estados' });

// ============================================================
// 🔗 ESTADO x EQUIPO ↔ EQUIPO
// ============================================================
estadoxEquipoModel.belongsTo(equipoModel, { foreignKey: 'id_equipo', as: 'equipo' });
equipoModel.hasMany(estadoxEquipoModel,   { foreignKey: 'id_equipo', as: 'estadosEquipo' });

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