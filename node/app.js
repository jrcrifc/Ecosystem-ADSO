//app.js
import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import EquiposRoutes from './routes/EquiposRoutes.js'
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv'

import proveedoresRoutes from './routes/proveedoresRoutes.js'
import responsablesRoutes from './routes/responsableRoutes.js'
import personaSolicitanteRoutes from './routes/personaSolicitanteRoutes.js'


const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Rutas
app.use('/api/equipos', EquiposRoutes);
app.use('/api/proveedor',proveedoresRoutes);
app.use('/api/responsables',responsablesRoutes);
app.use('/api/personaSolicitante',personaSolicitanteRoutes);


app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Equipos');
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

//conexion a la base de datos
try{
    await db.authenticate()
    console.log('Conexion a la base de datos establecida')
}catch(error){
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) //finaliza la app si no conecta
}


dotenv.config() //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})
export default app