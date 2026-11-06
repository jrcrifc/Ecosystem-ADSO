// ============================================================
// 🔄 SINCRONIZACIÓN Y CREACIÓN DE ESTRUCTURA LIMPIA
// Crea todas las tablas a partir de los modelos de Sequelize,
// siembra los estados indispensables y crea el usuario admin inicial.
// ============================================================
import db from '../database/db.js';
import '../models/associations.js';
import UserModel from '../models/userModel.js';
import estadoEquipoModel from '../models/Estado_equipoModel.js';
import estadosolicitudModel from '../models/Estado_solicitudModel.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function inicializarBD() {
  try {
    console.log('🔄 Conectando a la base de datos MySQL...');
    await db.authenticate();
    console.log('✅ Conexión establecida.');

    console.log('📦 Sincronizando y creando todas las tablas del sistema...');
    // Sincroniza todas las tablas definidas en associations.js
    await db.sync({ alter: true });
    console.log('✅ Todas las tablas fueron creadas/actualizadas con éxito.');

    // 1. Sembrar estados de equipo
    console.log('🌱 Sembrando estados de equipos...');
    const estadosEquipo = ['disponible', 'mantenimiento', 'solicitado', 'prestado'];
    for (const est of estadosEquipo) {
      await estadoEquipoModel.findOrCreate({ where: { estado: est } });
    }
    console.log('✅ Estados de equipo listos.');

    // 2. Sembrar estados de solicitud
    console.log('🌱 Sembrando estados de solicitudes...');
    const estadosSolicitud = ['generado', 'aceptado', 'prestado', 'entregado', 'cancelado', 'rechazado'];
    for (const est of estadosSolicitud) {
      await estadosolicitudModel.findOrCreate({ where: { estado: est } });
    }
    console.log('✅ Estados de solicitud listos.');

    // 3. Crear usuario Administrador inicial (si no existe)
    console.log('👑 Verificando Administrador inicial...');
    const adminExiste = await UserModel.findOne({ where: { rol: 'Administrador' } });
    if (!adminExiste) {
      await UserModel.create({
        uuid: uuidv4(),
        documento: '00000000',
        nombres_apellidos: 'Administrador Lab Ambiental',
        email: 'admin@laboratorio.com',
        password: await bcrypt.hash('Admin1234!', 10),
        rol: 'Administrador',
        estado: 'activo'
      });
      console.log('✅ Administrador creado: admin@laboratorio.com / Admin1234!');
    } else {
      console.log('ℹ️ Ya existe un administrador en la BD.');
    }

    console.log('\n🎉 ¡Base de datos completamente actualizada, sincronizada y lista!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

inicializarBD();

