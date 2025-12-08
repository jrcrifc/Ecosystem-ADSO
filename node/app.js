import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';
import estadoSolicitudRoutes from './routes/estadoSolicitudRoutes.js';
import estadoXSolicitudRoutes from './routes/estadoXSolicitudRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import responsableRoutes from './routes/responsableRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// test connection
try {
  await db.authenticate();
  console.log('DB connected');
} catch (err) {
  console.error('DB connection error:', err);
}

// routes
app.use('/api/estado-solicitud', estadoSolicitudRoutes);
app.use('/api/estadoxsolicitud', estadoXSolicitudRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/responsables', responsableRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
