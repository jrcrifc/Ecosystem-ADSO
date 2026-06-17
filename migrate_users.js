import db from './node/database/db.js';
import './node/models/associations.js';
import UserModel from './node/models/userModel.js';
import AprendizModel from './node/models/aprendizModel.js';
import InstructorModel from './node/models/instructorModel.js';

async function migrate() {
  try {
    const aprendicesUsers = await UserModel.findAll({ where: { rol: 'Aprendiz' } });
    console.log(`Migrating ${aprendicesUsers.length} aprendices...`);
    let aCount = 0;
    for (const u of aprendicesUsers) {
      const exists = await AprendizModel.findOne({ where: { id_usuario: u.id_usuario } });
      if (!exists) {
        await AprendizModel.create({
          documento: u.documento,
          nombres_apellidos: u.nombres_apellidos,
          email: u.email,
          id_ficha: u.id_ficha,
          id_usuario: u.id_usuario
        });
        aCount++;
      }
    }
    console.log(`Migrated ${aCount} aprendices.`);

    const instructoresUsers = await UserModel.findAll({ where: { rol: 'Instructor' } });
    console.log(`Migrating ${instructoresUsers.length} instructores...`);
    let iCount = 0;
    for (const u of instructoresUsers) {
      const exists = await InstructorModel.findOne({ where: { id_usuario: u.id_usuario } });
      if (!exists) {
        await InstructorModel.create({
          documento: u.documento,
          nombres_apellidos: u.nombres_apellidos,
          email: u.email,
          id_usuario: u.id_usuario
        });
        iCount++;
      }
    }
    console.log(`Migrated ${iCount} instructores.`);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

migrate();
