import db from "../database/db.js";

async function alterEnum() {
  try {
    await db.query("ALTER TABLE equipos MODIFY COLUMN grupo_equipo ENUM('Equipo de Laboratorio') NOT NULL DEFAULT 'Equipo de Laboratorio'");
    console.log("✅ Columna grupo_equipo actualizada a ENUM('Equipo de Laboratorio')");
  } catch (error) {
    console.error("❌ Error al modificar enum:", error.message);
  }
  process.exit(0);
}

alterEnum();
