import db from '../node/database/db.js';

async function checkSchema() {
  try {
    await db.authenticate();
    const [usuarios] = await db.query(`SHOW CREATE TABLE usuarios;`);
    console.log(usuarios[0]['Create Table']);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkSchema();
