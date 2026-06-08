// ============================================================
// 🚀 SERVIDOR PRINCIPAL EXPRESS (app.js)
// Punto de entrada de la API REST del backend de Ecosystem.
// Configura los middlewares globales (CORS, JSON, Carpeta estática de subidas),
// inicializa el socket.io para notificaciones en tiempo real,
// importa e inyecta el grafo de relaciones de Sequelize,
// expone todas las rutas de endpoints de la aplicación,
// verifica la conexión a la base de datos MySQL,
// y arranca el servidor HTTP en el puerto configurado.
// ============================================================

// Importa las relaciones de base de datos antes que cualquier otra ruta
import './models/associations.js'; 

// Importa express para crear la aplicación web
import express from 'express';
// Importa http para crear el servidor HTTP subyacente
import http from 'http';
// Importa cors para permitir solicitudes de origen cruzado
import cors from 'cors';
// Importa la función initSocket para inicializar Socket.io
import { initSocket } from './socket.js';
// Importa la instancia de Sequelize para conectar con la base de datos
import db from './database/db.js';
// Importa fileURLToPath para obtener la ruta del archivo actual en ESM
import { fileURLToPath } from 'url';
// Importa path para manejar rutas de archivos
import path from 'path';
// Importa dotenv para cargar variables de entorno
import dotenv from 'dotenv';

// Importa las rutas de administración de usuarios
import adminRoutes from "./routes/adminRoutes.js";
// Importa las rutas de estados de solicitud
import estadosolicitudRoutes from "./routes/estadoSolicitudRoutes.js";
// Importa las rutas de equipos
import equiposRoutes from './routes/EquiposRoutes.js';
// Importa las rutas de proveedores
import proveedoresRoutes from './routes/proveedoresRoutes.js';
// Importa las rutas de reactivos
import reactivosRoutes from "./routes/reactivosRoutes.js";
// Importa las rutas de autenticación y usuarios
import UserRoutes from './routes/userRoutes.js';
// Importa las rutas de estados de equipos
import estadoequipoRoutes from "./routes/Estado_equipoRoutes.js";
// Importa las rutas de solicitudes
import solicitudRoutes from './routes/solicitudRoutes.js';
// Importa las rutas de movimientos de reactivos
import movimientosRoutes from './routes/movimientoreactivosRoutes.js';
// Importa las rutas de relaciones solicitud-equipo
import solicitudxequipoRoutes from "./routes/solicitudxequipoRoutes.js";
// Importa las rutas del historial de estados de solicitud
import estadoxsolicitudRoutes from './routes/estadoxsolicitudRoutes.js';
// Importa las rutas de salidas de reactivos
import salidasRoutes from './routes/salidasRoutes.js';
// Importa las rutas del historial de estados de equipos
import estadoxequipoRoutes from './routes/estadoxequipoRoutes.js';
// Importa las rutas de cuentadantes
import cuentadanteRoutes from './routes/cuentandanteRoutes.js';
// Importa las rutas de notificaciones
import notificacionRoutes from './routes/notificacionRoutes.js';
// Importa las rutas de solicitudes de acceso
import solicitudAccesoRoutes from './routes/solicitudAccesoRoutes.js';
// Importa las rutas del dashboard
import dashboardRoutes from './routes/dashboardRoutes.js';
// Importa las rutas de restablecimiento de contraseña
import passwordResetRoutes from './routes/passwordResetRoutes.js';
// Importa las rutas de configuración global
import configRoutes from './routes/configRoutes.js';
// Importa las rutas de auditoría
import logRoutes from "./routes/logRoutes.js";
// Importa fs para verificar la existencia de archivos
import fs from 'fs';

// Obtiene la ruta del archivo actual (necesario en ESM)
const __filename = fileURLToPath(import.meta.url);
// Obtiene el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Define múltiples rutas posibles para el archivo .env
const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env')
];
// Variable para indicar si se cargó el archivo .env
let loaded = false;
// Recorre las rutas buscando el primer archivo .env existente
for (const p of paths) {
    if (fs.existsSync(p)) {
        // Carga las variables de entorno desde el archivo .env encontrado
        dotenv.config({ path: p });
        loaded = true;
        break;
    }
}
// Si no se encontró ningún archivo .env, intenta cargar desde la ubicación predeterminada
if (!loaded) {
    dotenv.config();
}

// Imprime en consola si JWT_SECRET está cargado correctamente
console.log("🔑 JWT_SECRET cargado:", process.env.JWT_SECRET ? "✅ SÍ" : "❌ NO CARGADO");
// Imprime el puerto configurado o el valor por defecto 8000
console.log("📌 Puerto configurado:", process.env.PORT || 8000);

// Crea la aplicación de Express
const app = express();
// Crea el servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);
// Inicializa Socket.io con el servidor HTTP para WebSockets
initSocket(server);

// Habilita CORS para permitir solicitudes de diferentes orígenes
app.use(cors());
// Habilita el parseo automático del cuerpo de peticiones en formato JSON
app.use(express.json());

// Expone la carpeta de uploads como contenido estático para acceder a las fotos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Monta las rutas de estados de solicitud en /api/estadosolicitud
app.use("/api/estadosolicitud", estadosolicitudRoutes);
// Monta las rutas de equipos en /api/equipos
app.use('/api/equipos', equiposRoutes);
// Monta las rutas de proveedores en /api/proveedor
app.use('/api/proveedor', proveedoresRoutes);
// Monta las rutas de reactivos en /api/reactivos
app.use("/api/reactivos", reactivosRoutes);
// Monta las rutas del historial de estados de solicitud en /api/estadoxsolicitud
app.use("/api/estadoxsolicitud", estadoxsolicitudRoutes);
// Monta las rutas del historial de estados de equipos en /api/estadoxequipo
app.use('/api/estadoxequipo', estadoxequipoRoutes);
// Monta las rutas de estados de equipos en /api/estadoequipo
app.use('/api/estadoequipo', estadoequipoRoutes);
// Monta las rutas de relaciones solicitud-equipo en /api/solicitudxequipo
app.use("/api/solicitudxequipo", solicitudxequipoRoutes);
// Monta las rutas de solicitudes en /api/solicitud
app.use("/api/solicitud", solicitudRoutes);
// Monta las rutas de salidas en /api/salidas
app.use("/api/salidas", salidasRoutes);
// Monta las rutas de movimientos en /api/movimientos
app.use("/api/movimientos", movimientosRoutes);
// Monta las rutas de cuentadantes en /api/cuentadante
app.use("/api/cuentadante", cuentadanteRoutes);
// Monta las rutas de autenticación en /api/auth
app.use('/api/auth', UserRoutes);
// Monta las rutas de administración en /api/admin
app.use("/api/admin", adminRoutes);
// Monta las rutas de notificaciones en /api/notificaciones
app.use('/api/notificaciones', notificacionRoutes);
// Monta las rutas de solicitudes de acceso en /api/solicitud-acceso
app.use('/api/solicitud-acceso', solicitudAccesoRoutes);
// Monta las rutas del dashboard en /api/dashboard
app.use('/api/dashboard', dashboardRoutes);
// Monta las rutas de restablecimiento de contraseña en /api/password-reset
app.use('/api/password-reset', passwordResetRoutes);
// Monta las rutas de configuración en /api/config
app.use('/api/config', configRoutes);
// Monta las rutas de auditoría en /api/auditoria
app.use('/api/auditoria', logRoutes);

// Define la ruta base que retorna un mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Equipos - Laboratorio Ambiental');
});

// Ejecuta el bloque en try-catch para manejar errores de conexión a la base de datos
try {
    // Verifica que la conexión a la base de datos funcione correctamente
    await db.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Ejecuta una consulta ALTER TABLE para asegurar que el ENUM de usuarios soporte el estado inactivo
    await db.query(`
      ALTER TABLE usuarios 
      MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado', 'inactivo') 
      NOT NULL DEFAULT 'pendiente';
    `).catch(err => console.warn("⚠️ Advertencia al sincronizar ENUM en DB:", err.message));
} catch (error) {
    // Imprime el error de conexión en consola
    console.error('❌ Error al conectar a la base de datos:', error);
    // Finaliza el proceso con código de error si la base de datos no está disponible
    process.exit(1);
}

// Define el puerto del servidor desde variable de entorno o 8000 por defecto
const PORT = process.env.PORT || 8000;

// Inicia el servidor HTTP en el puerto especificado
server.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
});

// Exporta la aplicación Express para pruebas o uso externo
export default app;