// app.js
import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Rutas
import EstadoSolicitudRoutes from "./routes/EstadosolicitudRoutes.js";
import EquiposRoutes from './routes/EquiposRoutes.js';
import proveedoresRoutes from './routes/proveedoresRoutes.js';
import reactivosRoutes from "./routes/reactivosRoutes.js";
import UserRoutes from './routes/userRoutes.js';

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
app.use("/api/estadoSolicitud", EstadoSolicitudRoutes);
app.use('/api/equipos', EquiposRoutes);
app.use('/api/proveedor', proveedoresRoutes);
app.use("/api/reactivos", reactivosRoutes);
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
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
});

export default app;