// ============================================================
// 🧹 SCRIPT DE LIMPIEZA PARA PRUEBAS EN CALIENTE (clean_for_tests.js)
// Limpia las tablas transaccionales dejando solo instructores, usuarios,
// programas, fichas y las tablas maestras de estados intactas.
// Ejecución:
//   node scripts/clean_for_tests.js
// ============================================================

import db from "../database/db.js";

async function run() {
  console.log("🚀 Iniciando limpieza de BD para pruebas en caliente...");

  try {
    // 1. Desactivar validaciones de llaves foráneas
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 2. Tablas a limpiar (orden seguro)
    const tablesToWipe = [
      "solicitudxequipo",
      "estadoxsolicitud",
      "solicitud_prestamos",
      "estadoxequipo",
      "equipos",
      "salidas_reactivos",
      "movimientos_reactivos",
      "reactivos",
      "proveedor",
      "notificaciones",
      "auditoria",
    ];

    for (const table of tablesToWipe) {
      try {
        console.log(`🧹 Limpiando tabla: ${table}...`);
        await db.query(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`   ✅ ${table} limpia`);
      } catch (e) {
        console.log(`   ⚠️ ${table}: ${e.message}`);
      }
    }

    // 3. Reactivar validaciones de llaves foráneas
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 4. Verificar conteos finales
    console.log("\n📊 Conteos finales:");
    const tablesCheck = [
      "instructores", "usuarios", "programas", "fichas",
      "estado_equipo", "estado_solicitud",
      "equipos", "reactivos", "proveedor",
      "solicitud_prestamos", "notificaciones", "auditoria"
    ];
    for (const t of tablesCheck) {
      try {
        const [rows] = await db.query(`SELECT COUNT(*) as c FROM ${t}`);
        console.log(`   ${t}: ${rows[0].c} registros`);
      } catch (e) {
        console.log(`   ${t}: (tabla no existe)`);
      }
    }

    console.log("\n🎉 ¡BD limpia! Solo quedan instructores, usuarios, programas, fichas y tablas maestras.");
    process.exit(0);
  } catch (error) {
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

run();
