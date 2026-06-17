import db from '../node/database/db.js';

async function migrate() {
  try {
    await db.authenticate();
    console.log("Connected to database.");

    console.log("Renaming Id_solicitud in estadoxsolicitud table...");
    await db.query("ALTER TABLE estadoxsolicitud CHANGE Id_solicitud id_solicitud INT(11) NOT NULL;");
    console.log("Renamed column successfully.");

    console.log("Dropping old columns from aprendices table...");
    await db.query("ALTER TABLE aprendices DROP COLUMN fecha_inicio;").catch(err => console.log("fecha_inicio already deleted or not found:", err.message));
    await db.query("ALTER TABLE aprendices DROP COLUMN fecha_fin;").catch(err => console.log("fecha_fin already deleted or not found:", err.message));
    console.log("Dropped columns successfully.");
    
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    process.exit();
  }
}

migrate();
