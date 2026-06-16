import { Sequelize } from 'sequelize';
const db = new Sequelize('ecosystem', 'root', '', { host: 'localhost', port: 3306, dialect: 'mysql' });
async function fix() {
  try {
    await db.authenticate();
    const [tables] = await db.query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'ecosystem'");
    for (const row of tables) {
      const table = row.TABLE_NAME;
      try { await db.query(`ALTER TABLE \`${table}\` DROP COLUMN createdAt`); console.log(`Dropped createdAt from ${table}`); } catch(e){}
      try { await db.query(`ALTER TABLE \`${table}\` DROP COLUMN updatedAt`); console.log(`Dropped updatedAt from ${table}`); } catch(e){}
      try { await db.query(`ALTER TABLE \`${table}\` DROP COLUMN createdat`); console.log(`Dropped createdat from ${table}`); } catch(e){}
      try { await db.query(`ALTER TABLE \`${table}\` DROP COLUMN updatedat`); console.log(`Dropped updatedat from ${table}`); } catch(e){}
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
fix();
