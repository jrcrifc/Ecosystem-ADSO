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
import solicitudPrestamosRoutes from './routes/solicitud_prestamosRoutes.js';
import solicitudxEquipoRoutes from './routes/solicitudxequipoRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import salidasRoutes from './routes/salidasRoutes.js';
import estadoxSolicitudRoutes from './routes/estadoxsolicitudRoutes.js';
import estadoxEquipoRoutes from './routes/estadoxequipoRoutes.js';
import estadoEquipoRoutes from './routes/estadoEquipoRoutes.js';
import userRouter from './routes/userRouter.js';

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

// rutas adicionales
app.use('/api/solicitud-prestamos', solicitudPrestamosRoutes);
app.use('/api/solicitudxequipo', solicitudxEquipoRoutes);
app.use('/api/solicitud', solicitudRoutes);
app.use('/api/salidas', salidasRoutes);
app.use('/api/estadoxsolicitud', estadoxSolicitudRoutes);
app.use('/api/estadoxequipo', estadoxEquipoRoutes);
app.use('/api/estadoequipo', estadoEquipoRoutes);
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Equipos');
});

// =============================
// 🔥 IMPORT MODELS
// Esto asegura que Sequelize las registre antes de la sincronización.
// =============================
import './models/estadoSolicitudModel.js';
import './models/estadoxequipoModel.js';
import './models/Estadosolicitud.js';
import './models/estadoxsolicitudModel.js';
import './models/estadoEquipoModel.js';
import './models/EquiposModel.js';
import './models/userModel.js';
import './models/solicitudxequipoModel.js';
import './models/solicitudModel.js';
import './models/salidasModel.js';
import './models/reactivosModel.js';
import './models/proveedoresModel.js';

// =============================
// 🔥 CONEXIÓN BASE DE DATOS
// =============================
try {
  await db.authenticate();
  console.log('✅ Conexión a la base de datos establecida');
  // sincronizar con alter/force igual que antes
  const force = process.env.FORCE_SYNC === 'true';
  const alter = process.env.ALTER_SYNC === 'true' || process.env.NODE_ENV === 'development';
  await db.sync({ alter, force });
  console.log('Modelos sincronizados', force ? '(force)' : alter ? '(alter)' : '');
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


