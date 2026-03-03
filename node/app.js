//app.js
import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv'
dotenv.config(); // cargar variables de entorno al inicio

import estadoSolicitudRoutes from './routes/estadoSolicitudRoutes.js'
import estadoEquipoRoutes from './routes/estadoEquipoRoutes.js'
import userRouter from './routes/userRouter.js'

// Importar modelos para sincronización
import estadoSolicitudModel from './models/estadoSolicitudModel.js'
import estadoEquipoModel from './models/estadoEquipoModel.js'
import userModel from './models/userModel.js'
import { seedDatabase } from './seeds/seedData.js'

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Rutas
app.use('/api/estadosolicitud', estadoSolicitudRoutes);
app.use('/api/estadoequipo', estadoEquipoRoutes);
app.use('/api/users', userRouter);


app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Equipos');
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

//conexion a la base de datos
try {
    await db.authenticate();
    console.log('Conexion a la base de datos establecida');

    // Sincronizar modelos con base de datos
    // `FORCE_SYNC=true` recrea todas las tablas (drop & re-create)
    // `ALTER_SYNC=true` intentará ajustar el esquema existente agregando/alterando
    // columnas sin borrar datos. En desarrollo activamos `alter` de forma
    // automática para que cambios en los modelos se propaguen sin variables.
    const force = process.env.FORCE_SYNC === 'true';
    const alter = process.env.ALTER_SYNC === 'true' || process.env.NODE_ENV === 'development';
    await db.sync({ alter, force });
    console.log('Modelos sincronizados con la base de datos', force ? '(force)' : alter ? '(alter)' : '');

    // Ejecutar seed de datos
    await seedDatabase();
    console.log('Datos iniciales cargados correctamente');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); //finaliza la app si no conecta
}
dotenv.config(); //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})
export default app