import db from '../node/database/db.js';

async function run() {
  try {
    await db.authenticate();
    console.log("Connected to database.");

    console.log("Renaming Observaciones to observaciones in salidas_reactivos...");
    // Let's check if we can run CHANGE column. We can use CHANGE which works in all MySQL versions
    await db.query("ALTER TABLE salidas_reactivos CHANGE Observaciones observaciones VARCHAR(1000) NULL DEFAULT NULL;");
    console.log("Renamed column successfully!");
  } catch (error) {
    console.error("Error running fix:", error);
  } finally {
    process.exit();
  }
}

run();
