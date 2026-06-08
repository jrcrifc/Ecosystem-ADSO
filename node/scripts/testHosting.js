// ============================================================
// 🌐 SCRIPT DE PRUEBA DE SERVICIOS EN HOSTING DE PRODUCCIÓN (testHosting.js)
// Este script simula el comportamiento de un cliente frontend realizando peticiones
// HTTP nativas (usando fetch) hacia la API desplegada en producción (Clever Cloud/Hetzner).
// Prueba secuencialmente:
//   1. Inicio de sesión del administrador y obtención del token JWT.
//   2. Consulta a los endpoints de Equipos, Proveedores, Reactivos, Usuarios y Solicitudes.
// Ejecución:
//   node scripts/testHosting.js
// ============================================================

const API_URL = 'https://app-fab54542-5aea-4bb3-ba23-e95350ce5d8e.cleverapps.io/api';

async function testModules() {
    console.log("🚀 Iniciando prueba de módulos en producción...");
    let token = '';

    // 1️⃣ Probando Módulo de Autenticación (Login)
    try {
        console.log("\n1️⃣ Probando Módulo de Autenticación (Login)...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@laboratorio.com',
                password: 'Admin1234!'
            })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message || 'Error en Login');
        
        // Almacenar el token JWT para los siguientes requests protegidos
        token = loginData.token;
        console.log("✅ Login exitoso. Token obtenido.");
    } catch (error) {
        console.error("❌ Fallo en Login:", error.message);
        return;
    }

    // Cabecera con el token Bearer JWT
    const headers = { Authorization: `Bearer ${token}` };

    // Lista de módulos y endpoints protegidos a probar
    const modulos = [
        { nombre: 'Equipos', endpoint: '/equipos' },
        { nombre: 'Proveedores', endpoint: '/proveedor' },
        { nombre: 'Reactivos', endpoint: '/reactivos' },
        { nombre: 'Usuarios', endpoint: '/auth/usuarios' }, 
        { nombre: 'Solicitudes', endpoint: '/solicitud' }
    ];

    // Consumir cada endpoint y reportar su estado
    for (const modulo of modulos) {
        try {
            console.log(`\n⏳ Probando Módulo: ${modulo.nombre}...`);
            const res = await fetch(`${API_URL}${modulo.endpoint}`, { headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error en petición');
            console.log(`✅ ¡Módulo ${modulo.nombre} funciona perfectamente! (Registros encontrados: ${Array.isArray(data) ? data.length : 'OK'})`);
        } catch (error) {
            console.error(`❌ Fallo en el módulo ${modulo.nombre}:`, error.message);
        }
    }

    console.log("\n🎉 Pruebas de módulos finalizadas.");
}

testModules();
