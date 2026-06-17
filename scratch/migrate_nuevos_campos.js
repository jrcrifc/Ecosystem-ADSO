import db from '../node/database/db.js';

async function migrate() {
  try {
    await db.authenticate();
    console.log("Connected to database.");

    console.log("Altering table instructores to add new fields...");
    await db.query(`
      ALTER TABLE instructores 
      ADD COLUMN correo_personal VARCHAR(255) NULL,
      ADD COLUMN programa VARCHAR(255) NULL,
      ADD COLUMN telefono VARCHAR(100) NULL;
    `).catch(err => console.log("Note on instructores alter:", err.message));

    console.log("Altering table aprendices to add new fields...");
    await db.query(`
      ALTER TABLE aprendices 
      ADD COLUMN tipo_documento VARCHAR(50) NULL,
      ADD COLUMN fecha_nacimiento DATE NULL,
      ADD COLUMN genero VARCHAR(50) NULL,
      ADD COLUMN direccion VARCHAR(255) NULL,
      ADD COLUMN tipo_direccion VARCHAR(50) NULL,
      ADD COLUMN telefono VARCHAR(100) NULL,
      ADD COLUMN estrato VARCHAR(20) NULL,
      ADD COLUMN estado_civil VARCHAR(50) NULL,
      ADD COLUMN tipo_aprendiz VARCHAR(100) NULL,
      ADD COLUMN nombre_responsable VARCHAR(255) NULL,
      ADD COLUMN telefono_responsable VARCHAR(100) NULL,
      ADD COLUMN email_responsable VARCHAR(255) NULL;
    `).catch(err => console.log("Note on aprendices alter:", err.message));

    console.log("Migration queries executed successfully.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    process.exit();
  }
}

migrate();
