// Script de prueba para diagnosticar errores de solicitudes y equipos
import '../node/models/associations.js';
import solicitudService from '../node/service/solicitudService.js';
import EquiposService from '../node/service/EquiposService.js';

console.log('=== TEST SOLICITUDES ===');
try {
  const solicitudes = await solicitudService.getAll();
  console.log('✅ Solicitudes OK:', solicitudes.length, 'registros');
} catch (e) {
  console.error('❌ Error en solicitudes:', e.message);
  if (e.parent) console.error('   SQL Error:', e.parent.sqlMessage || e.parent.message);
}

console.log('\n=== TEST EQUIPOS ===');
try {
  const equipos = await EquiposService.getAll();
  console.log('✅ Equipos OK:', equipos.length, 'registros');
} catch (e) {
  console.error('❌ Error en equipos:', e.message);
  if (e.parent) console.error('   SQL Error:', e.parent.sqlMessage || e.parent.message);
}

process.exit(0);
