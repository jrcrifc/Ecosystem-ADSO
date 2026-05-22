import db from "../database/db.js";

async function clearNotifications() {
  try {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("TRUNCATE TABLE `notificaciones`;");
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("✅ Todas las notificaciones de la base de datos han sido eliminadas permanentemente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al limpiar las notificaciones:", error);
    process.exit(1);
  }
}

clearNotifications();
