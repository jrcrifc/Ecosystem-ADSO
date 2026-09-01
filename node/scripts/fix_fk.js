// Script para corregir las foreign keys huérfanas en usuarios
import db from "../database/db.js";

async function fix() {
  try {
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("1. FK checks OFF");

    const [r1] = await db.query("UPDATE usuarios SET id_ficha = NULL WHERE id_ficha IS NOT NULL AND id_ficha NOT IN (SELECT id_ficha FROM fichas)");
    console.log("2. Fichas huerfanas limpiadas:", r1.affectedRows || 0);

    const [r2] = await db.query("UPDATE usuarios SET id_programa = NULL WHERE id_programa IS NOT NULL AND id_programa NOT IN (SELECT id_programa FROM programas)");
    console.log("3. Programas huerfanos limpiados:", r2.affectedRows || 0);

    try { await db.query("ALTER TABLE usuarios DROP FOREIGN KEY usuarios_ibfk_17"); } catch(e){}
    try { await db.query("ALTER TABLE usuarios DROP FOREIGN KEY usuarios_ibfk_18"); } catch(e){}

    await db.query("ALTER TABLE usuarios ADD CONSTRAINT usuarios_ibfk_17 FOREIGN KEY (id_ficha) REFERENCES fichas (id_ficha) ON DELETE SET NULL ON UPDATE CASCADE");
    console.log("4. FK id_ficha OK");

    await db.query("ALTER TABLE usuarios ADD CONSTRAINT usuarios_ibfk_18 FOREIGN KEY (id_programa) REFERENCES programas (id_programa) ON DELETE SET NULL ON UPDATE CASCADE");
    console.log("5. FK id_programa OK");

    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("6. LISTO - Todo corregido");
  } catch(e) {
    console.error("ERROR:", e.message);
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
  }
  process.exit(0);
}

fix();
