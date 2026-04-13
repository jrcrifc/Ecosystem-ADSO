// app.js
import './models/associations.js'; // ← PRIMERA LÍNEA
import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Rutas
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




// =============================
// 🔥 CARGAR VARIABLES DE ENTORNO (CORREGIDO)
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env desde la raíz del proyecto (más seguro)
const envPath = path.resolve(__dirname, '../.env');
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
    console.warn(`⚠️ No se encontró .env en ${envPath}. Intentando cargar sin ruta explícita...`);
    dotenv.config();
}

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

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Equipos - Laboratorio Ambiental');
});

// =============================
// 🔥 CONEXIÓN BASE DE DATOS
// =============================
try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
} catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
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
    const server = http.createServer(app);

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