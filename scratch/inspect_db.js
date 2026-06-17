import db from '../node/database/db.js';

async function inspect() {
  try {
    await db.authenticate();
    const [cols] = await db.query("SHOW COLUMNS FROM salidas_reactivos");
    console.log("Columns of salidas_reactivos:", cols);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}
inspect();
