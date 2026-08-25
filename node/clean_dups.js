import db from './database/db.js';
import './models/associations.js';
import UserModel from './models/userModel.js';
import InstructorModel from './models/instructorModel.js';

async function run() {
  try {
    // Buscar todos los instructores
    const instructores = await InstructorModel.findAll({
      include: [{ model: UserModel, as: 'usuario' }]
    });

    const nameMap = new Map();
    const toDelete = [];

    for (const inst of instructores) {
      if (!inst.usuario) continue;
      
      const name = inst.usuario.nombres_apellidos.trim().toLowerCase();
      
      if (nameMap.has(name)) {
        // Encontramos un duplicado
        console.log(`Duplicado encontrado: ${inst.usuario.nombres_apellidos} (Doc: ${inst.usuario.documento})`);
        toDelete.push(inst);
      } else {
        nameMap.set(name, inst);
      }
    }

    console.log(`Total de duplicados a eliminar: ${toDelete.length}`);

    // Eliminar los duplicados (primero instructor, luego usuario)
    for (const inst of toDelete) {
      await inst.destroy();
      const user = await UserModel.findByPk(inst.id_usuario);
      if (user) {
        await user.destroy();
      }
    }

    console.log("Limpieza completada.");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

run();
