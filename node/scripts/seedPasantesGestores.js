// Script para insertar registros de prueba de Pasantes y Gestores en la tabla usuarios
import '../database/db.js';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const pasantes = [
  { documento: '1098765001', nombres_apellidos: 'Laura Marcela Gómez Ríos', email: 'laura.gomez@sena.edu.co' },
  { documento: '1098765002', nombres_apellidos: 'Andrés Felipe Castro Díaz', email: 'andres.castro@sena.edu.co' },
  { documento: '1098765003', nombres_apellidos: 'Valentina Herrera López', email: 'valentina.herrera@sena.edu.co' },
];

const gestores = [
  { documento: '1098765004', nombres_apellidos: 'Carlos Eduardo Martínez Ruiz', email: 'carlos.martinez@sena.edu.co' },
  { documento: '1098765005', nombres_apellidos: 'María José Ramírez Soto', email: 'maria.ramirez@sena.edu.co' },
];

async function seed() {
  try {
    console.log('🌱 Insertando Pasantes y Gestores de prueba...\n');

    for (const p of pasantes) {
      const exists = await UserModel.findOne({ where: { documento: p.documento } });
      if (exists) {
        console.log(`⏩ Pasante "${p.nombres_apellidos}" ya existe, omitido.`);
        continue;
      }
      const hashed = await bcrypt.hash(p.documento, 10);
      await UserModel.create({
        uuid: uuidv4(),
        tipo_documento: 'CC',
        documento: p.documento,
        nombres_apellidos: p.nombres_apellidos,
        email: p.email,
        password: hashed,
        rol: 'Pasante',
        estado: 'aprobado'
      });
      console.log(`✅ Pasante creado: ${p.nombres_apellidos} (${p.documento})`);
    }

    for (const g of gestores) {
      const exists = await UserModel.findOne({ where: { documento: g.documento } });
      if (exists) {
        console.log(`⏩ Gestor "${g.nombres_apellidos}" ya existe, omitido.`);
        continue;
      }
      const hashed = await bcrypt.hash(g.documento, 10);
      await UserModel.create({
        uuid: uuidv4(),
        tipo_documento: 'CC',
        documento: g.documento,
        nombres_apellidos: g.nombres_apellidos,
        email: g.email,
        password: hashed,
        rol: 'Gestor',
        estado: 'aprobado'
      });
      console.log(`✅ Gestor creado: ${g.nombres_apellidos} (${g.documento})`);
    }

    console.log('\n🎉 Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar seed:', error.message);
    process.exit(1);
  }
}

seed();
