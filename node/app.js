// app.js
import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import EstadoSolicitudRoutes from "./routes/EstadosolicitudRoutes.js";
import EquiposRoutes from './routes/EquiposRoutes.js';
import proveedoresRoutes from './routes/proveedoresRoutes.js';
import reactivosRoutes from "./routes/reactivosRoutes.js";

dotenv.config();

const app = express();

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// 🔥 MIDDLEWARES
// =============================
app.use(cors());
app.use(express.json());

// 🔥 CARPETA PUBLICA PARA IMÁGENES
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// =============================
// 🔥 RUTAS
// =============================
app.use("/api/estadoSolicitud", EstadoSolicitudRoutes);
app.use('/api/equipos', EquiposRoutes);
app.use('/api/proveedor', proveedoresRoutes);
app.use("/api/reactivos", reactivosRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Equipos');
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
// 🔥 SERVIDOR
// =============================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in http://localhost:${PORT}`);
});

export default app;


