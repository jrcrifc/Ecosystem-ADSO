import db from '../node/database/db.js';
import AprendizModel from '../node/models/aprendizModel.js';
import InstructorModel from '../node/models/instructorModel.js';
import UserModel from '../node/models/userModel.js';

async function clearData() {
  try {
    await db.authenticate();
    console.log("Conectado. Iniciando limpieza...");
    
    // Contamos antes de borrar
    const countI = await InstructorModel.count();
    const countA = await AprendizModel.count();
    const countU = await UserModel.count({ where: { rol: ['Instructor', 'Aprendiz'] } });
    
    console.log(`Instructores a borrar: ${countI}`);
    console.log(`Aprendices a borrar: ${countA}`);
    console.log(`Usuarios asociados a borrar: ${countU}`);

    // Primero borramos en tablas dependientes (para evitar errores de Foreign Key si no hay CASCADE)
    await InstructorModel.destroy({ where: {} });
    console.log("Tabla instructores vaciada.");

    await AprendizModel.destroy({ where: {} });
    console.log("Tabla aprendices vaciada.");

    // Luego borramos los usuarios asociados
    await UserModel.destroy({ where: { rol: ['Instructor', 'Aprendiz'] } });
    console.log("Usuarios asociados vaciados.");

    console.log("Limpieza exitosa.");
    process.exit(0);
  } catch (error) {
    console.error("Error limpiando BD:", error);
    process.exit(1);
  }
}

clearData();
