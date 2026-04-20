import db from './database/db.js';

try {
  const [results] = await db.query('SHOW FULL COLUMNS FROM equipos');
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Error inspecting equipos:', error);
} finally {
  await db.close();
}
