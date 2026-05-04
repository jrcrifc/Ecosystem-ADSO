// app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initSocket } from './socket.js';
import db from './database/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Rutas
import adminRoutes from "./routes/adminRoutes.js";
import estadoSolicitudRoutes from "./routes/estadoSolicitudRoutes.js";
import equiposRoutes from './routes/EquiposRoutes.js';
import proveedoresRoutes from './routes/proveedoresRoutes.js';
import reactivosRoutes from "./routes/reactivosRoutes.js";
import UserRoutes from './routes/userRoutes.js';
import estadoequipoRoutes from "./routes/Estado_equipoRoutes.js";
import solicitudRoutes from './routes/solicitudRoutes.js';
import movimientosRoutes from './routes/movimientoreactivosRoutes.js';
import solicitudxequipoRoutes from "./routes/solicitudxequipoRoutes.js";
import estadoxsolicitudRoutes from './routes/estadoxsolicitudRoutes.js';
import salidasRoutes from './routes/salidasRoutes.js';
import estadoxequipoRoutes from './routes/estadoxequipoRoutes.js';
import cuentadanteRoutes from './routes/cuentandanteRoutes.js';
import notificacionRoutes from './routes/notificacionRoutes.js';
import solicitudAccesoRoutes from './routes/solicitudAccesoRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import UserService from './service/userService.js';

// =============================
// 🔥 CARGAR VARIABLES DE ENTORNO (CORREGIDO)
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env desde la raíz del proyecto (más seguro).
const envPath = path.resolve(__dirname, '../.env');
let envResult = dotenv.config({ path: envPath });
if (envResult.error) {
    console.warn(`⚠️ No se encontró .env en ${envPath}. Intentando cargar sin ruta explícita...`);
    envResult = dotenv.config();
}
if (envResult.error) {
    console.warn('⚠️ No se encontró ningún archivo .env. Se usarán valores por defecto del entorno.');
}

await import('./models/associations.js');

const jwtSecretLoaded = Boolean(process.env.JWT_SECRET);
if (!jwtSecretLoaded) {
    console.warn('⚠️ JWT_SECRET no encontrado en variables de entorno. Usando valor de desarrollo por defecto.');
    process.env.JWT_SECRET = 'dev_secret_ecosystem';
}

console.log("🔑 JWT_SECRET cargado:", jwtSecretLoaded ? "✅ SÍ" : "⚠️ USANDO SECRET POR DEFECTO");
console.log("📌 Puerto configurado:", process.env.PORT || 8000);

// =============================
// 🔥 EXPRESS APP
// =============================
const app = express();
const server = http.createServer(app);
initSocket(server);

// =============================
// 🔥 MIDDLEWARES
// =============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// =============================
// 🔥 RUTAS
// =============================
app.use("/api/estadosolicitud", estadoSolicitudRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/proveedor', proveedoresRoutes);
app.use("/api/reactivos", reactivosRoutes);
app.use("/api/estadoxsolicitud", estadoxsolicitudRoutes);
app.use('/api/estadoxequipo', estadoxequipoRoutes);
app.use('/api/estadoequipo', estadoequipoRoutes);
app.use("/api/solicitudxequipo", solicitudxequipoRoutes);
app.use("/api/solicitud", solicitudRoutes);
app.use("/api/salidas", salidasRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/cuentadante", cuentadanteRoutes);
app.use('/api/auth', UserRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/solicitud-acceso', solicitudAccesoRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Equipos - Laboratorio Ambiental');
});

// =============================
// 🔥 CONEXIÓN BASE DE DATOS
// =============================
try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Usar sync() sin alter para evitar conflictos con columnas existentes
    // Esto SOLO crea tablas nuevas, no modifica existentes
    await db.sync({ force: false });
    console.log('✅ Sincronización de tablas completada');

    // ✅ Crear admin si no existe
    await UserService.crearAdminPredeterminado();
    
    // Validar que el campo cantidad_inventario existe
    const [columns] = await db.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'reactivos' AND TABLE_SCHEMA = ?
    `, { replacements: [process.env.DB_NAME || 'ecosystem'] });
    
    const canidadInventarioExists = columns.some(col => col.COLUMN_NAME === 'cantidad_inventario');
    if (canidadInventarioExists) {
        console.log('✅ Validación: Campo cantidad_inventario existe en reactivos');
    } else {
        console.warn('⚠️ ADVERTENCIA: El campo cantidad_inventario NO fue encontrado en reactivos.');
        console.warn('   Ejecuta manualmente: ALTER TABLE reactivos ADD COLUMN cantidad_inventario DECIMAL(10,3) DEFAULT 0;');
    }
    
} catch (error) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', error.message);
    process.exit(1);
}

// =============================
// 🔥 INICIAR SERVIDOR
// =============================
const PORT = Number(process.env.PORT) || 8000;
const FALLBACK_START = Number(process.env.PORT_FALLBACK) || 8001;
const MAX_FALLBACKS = 5;
const portsToTry = [PORT];
for (let i = 0; i < MAX_FALLBACKS; i += 1) {
    const fallback = FALLBACK_START + i;
    if (!portsToTry.includes(fallback)) {
        portsToTry.push(fallback);
    }
}

const startServer = (index = 0) => {
    if (index >= portsToTry.length) {
        console.error('❌ No se encontró ningún puerto libre en la lista de intentos.');
        process.exit(1);
    }

    const port = portsToTry[index];

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️ Puerto ${port} en uso, intentando con ${portsToTry[index + 1] || 'ninguno'}...`);
            startServer(index + 1);
        } else {
            console.error('❌ Error en el servidor:', err);
            process.exit(1);
        }
    });

    server.listen(port, () => {
        console.log(`🚀 Server running → http://localhost:${port}`);
    });
};

startServer();

export default app;