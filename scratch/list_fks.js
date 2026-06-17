import db from '../node/database/db.js';

async function listForeignKeys() {
  try {
    await db.authenticate();
    const [rows] = await db.query(`
      SELECT 
        TABLE_NAME, 
        COLUMN_NAME, 
        CONSTRAINT_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        TABLE_SCHEMA = 'ecosystem' 
        AND REFERENCED_TABLE_NAME IS NOT NULL;
    `);
    console.log("=== FOREIGN KEYS ACTUALES EN MYSQL ===");
    console.table(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listForeignKeys();
