import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';

// Rutas
import estadoSolicitudRoutes from './routes/estadoSolicitudRoutes.js';
import estadoXSolicitudRoutes from './routes/estadoXSolicitudRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import responsableRoutes from './routes/responsableRoutes.js';
import estadoXEquipoRoutes from './routes/estadoXEquipoRoutes.js';
import estadoEquipoRoutes from './routes/estadoEquipoRoutes.js';
import solicitudXEquipoRoutes from './routes/solicitudXEquipoRoutes.js';

// Importar modelos (NECESARIO para Sequelize)
import './models/Equipo.js';
import './models/EstadoSolicitud.js';
import './models/EstadoXSolicitud.js';
import './models/Solicitud.js';
import './models/Responsable.js';
import './models/EstadoEquipo.js';
import './models/EstadoXEquipo.js';
import './models/SolicitudXEquipo.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==================== DB ====================
try {
  await db.authenticate();
  console.log('DB connected');

  await db.sync({ alter: true });
  console.log(' DB synced');
} catch (error) {
  console.error(' DB connection error:', error.message);
  console.error(' Verifica que MySQL esté corriendo y la BD exista');
}

// ==================== ROUTES ====================
app.use('/api/estado-solicitud', estadoSolicitudRoutes);
app.use('/api/estadoxsolicitud', estadoXSolicitudRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/estadoxequipo', estadoXEquipoRoutes);
app.use('/api/estado-equipo', estadoEquipoRoutes);
app.use('/api/solicitudxequipo', solicitudXEquipoRoutes);

// ==================== SERVER ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
