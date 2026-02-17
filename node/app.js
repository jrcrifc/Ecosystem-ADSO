import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import dotenv from 'dotenv'


import movimientoreactivoRoutes from './routes/movimientoreactivosRoutes.js'
import reactivosRoutes from './routes/reactivosRoutes.js'
import salidasRoutes from './routes/salidasRoutes.js'
import proveedoresRoutes from'./routes/proveedoresRoutes.js'

import equiposRoutes from'./routes/EquiposRoutes.js'

const app = express()

app.use(express.static('public'));           // sirve todo lo que esté en /public
// o más específico y seguro:
app.use('/uploads', express.static('public/uploads'));

// Middleware
app.use(express.json())
app.use(cors())

//Middleware
app.use(express.json())//para leer json en req.body
app.use(cors()) //habilitar CORS

//Rutas

app.use('/api/movimientoreactivo', movimientoreactivoRoutes)
app.use('/api/reactivo', reactivosRoutes)
app.use('/api/salidas', salidasRoutes)
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/equipos', equiposRoutes)



//conexion a la base de datos
try{
    await db.authenticate()
    console.log('Conexion a la base de datos establecida')
}catch(error){
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) //finaliza la app si no conecta
}

app.get('/', (req, res) => {
    res.send('Bienvenidos a Ecosystem')
})

dotenv.config() //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})
export default app