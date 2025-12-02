import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import dotenv from 'dotenv'


import consumosreactivosRoutes from './routes/consumosreactivosRoutes.js'
import ingresoreactivoRoutes from './routes/ingresoreactivoRoutes.js'
import solicitudxequipoRoutes from './routes/solicitudxequipoRoutes.js'
import estadosolicitudRoutes from './routes/estadosolicitudRoutes.js'

const app = express()

//Middleware
app.use(express.json())//para leer json en req.body
app.use(cors()) //habilitar CORS

//Rutas

app.use('/api/estadosolicitud', estadosolicitudRoutes)
app.use('/api/consumoreactivo', consumosreactivosRoutes)
app.use('/api/ingresoreactivo', ingresoreactivoRoutes)
app.use('/api/solicitudxequipo', solicitudxequipoRoutes)

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