// app.js
import './models/associations.js'; // ← PRIMERA LÍNEA
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initSocket } from './socket.js';
import db from './database/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import adminRoutes from "./routes/adminRoutes.js";
// Rutas
import estadosolicitudRoutes from "./routes/EstadosolicitudRoutes.js";
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
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import configRoutes from './routes/configRoutes.js';


// =============================
// 🔥 CARGAR VARIABLES DE ENTORNO (CORREGIDO)
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env desde la raíz del proyecto (más seguro)
dotenv.config({ 
    path: path.resolve(__dirname, '../.env') 
});

console.log("🔑 JWT_SECRET cargado:", process.env.JWT_SECRET ? "✅ SÍ" : "❌ NO CARGADO");
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

// Carpeta pública para imágenes
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// =============================
// 🔥 RUTAS
// =============================
app.use("/api/estadosolicitud", estadosolicitudRoutes);
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
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/config', configRoutes);

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
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
});

export default app;