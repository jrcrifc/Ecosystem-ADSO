import db from './node/database/db.js';
import './node/models/associations.js';
import AprendizService from './node/service/aprendizService.js';

async function test() {
  try {
    const newA = await AprendizService.create({
      documento: "99999999",
      nombres_apellidos: "Test Aprendiz",
      email: "test@aprendiz.com",
      id_ficha: null
    });
    console.log("Created successfully:", newA.id_aprendiz);
  } catch (e) {
    console.error("Create failed:", e.message);
  } finally {
    process.exit(0);
  }
}

test();
