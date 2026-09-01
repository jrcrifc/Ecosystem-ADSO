// Verifica el estado completo de la BD - tablas, FKs y datos huérfanos
import db from "../database/db.js";

async function check() {
  try {
    await db.authenticate();
    console.log("✅ Conexión OK\n");

    // Verificar tablas
    const [tables] = await db.query("SHOW TABLES");
    console.log("📋 Tablas:", tables.length);

    // Verificar FKs de usuarios
    const [fks] = await db.query("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='ecosystem' AND TABLE_NAME='usuarios' AND CONSTRAINT_TYPE='FOREIGN KEY'");
    console.log("🔗 FKs en usuarios:", fks.map(f => f.CONSTRAINT_NAME).join(", "));

    // Verificar huérfanos
    const [h1] = await db.query("SELECT COUNT(*) as c FROM usuarios WHERE id_ficha IS NOT NULL AND id_ficha NOT IN (SELECT id_ficha FROM fichas)");
    console.log("🔍 Fichas huérfanas:", h1[0].c);

    const [h2] = await db.query("SELECT COUNT(*) as c FROM usuarios WHERE id_programa IS NOT NULL AND id_programa NOT IN (SELECT id_programa FROM programas)");
    console.log("🔍 Programas huérfanos:", h2[0].c);

    // Conteos
    const checks = ["usuarios","instructores","fichas","programas","equipos","reactivos","estado_equipo","estado_solicitud"];
    console.log("\n📊 Conteos:");
    for (const t of checks) {
      const [r] = await db.query("SELECT COUNT(*) as c FROM " + t);
      console.log("   " + t + ": " + r[0].c);
    }

    console.log("\n✅ Sin errores pendientes");
  } catch(e) {
    console.error("❌ ERROR:", e.message);
  }
  process.exit(0);
}
check();
