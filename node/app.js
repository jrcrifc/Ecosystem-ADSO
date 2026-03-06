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
import estadoEquipoRoutes from './routes/estado_equipoRoutes.js';
import userRouter from './routes/userRouter.js';
import reactivosRoutes from './routes/reactivosRoutes.js';
import movimientoreactivosRoutes from './routes/movimientoreactivosRoutes.js';
import salidasRoutes from './routes/salidasRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import solicitudxequipoRoutes from './routes/solicitudxequipoRoutes.js';
import estadoxequipoRoutes from './routes/EstadoxequipoRoutes.js';
import estadoxsolicitudRoutes from './routes/estadoxsolicitudRoutes.js';
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
app.use('/api/estadoequipo', estadoEquipoRoutes);
app.use('/api/reactivos', reactivosRoutes);
app.use('/api/movimientoreactivos', movimientoreactivosRoutes);
app.use('/api/salidas', salidasRoutes);
app.use('/api/solicitud', solicitudRoutes);
app.use('/api/solicitudxequipo', solicitudxequipoRoutes);
app.use('/api/estadoxequipo', estadoxequipoRoutes);
app.use('/api/estadoxsolicitud', estadoxsolicitudRoutes);
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Equipos');
});

// =============================
// 🔥 IMPORT MODELS
// Esto asegura que Sequelize las registre antes de la sincronización.
// =============================
//import './models/Estado_equipoModel.js';
//import './models/EquiposModel.js';
//import './models/userModel.js';
//import './models/proveedoresModel.js';
//import './models/estadoxequipoModel.js';
//import './models/estadoxsolicitudModel.js';
//import './models/reactivosModel.js';
//import './models/userModel.js';
//import './models/movimientoreactivosModel.js';

// =============================
// 🔥 CONEXIÓN BASE DE DATOS
// =============================
try {
  await db.authenticate();
  console.log('✅ Conexión a la base de datos establecida');
  // sincronizar: sólo `force` recrea tablas si se solicita explícitamente; desactivar `alter`
  const force = process.env.FORCE_SYNC === 'true';
  await db.sync({ force, alter: false });
  console.log('Modelos sincronizados', force ? '(force)' : '');
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


