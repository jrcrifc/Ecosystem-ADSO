import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import solicitud_prestamoRoutes from './routes/solicitud_prestamosRoutes.js'
import dotenv from 'dotenv'


const app = express()

//Middleware
app.use(express.json())//para leer json en req.body
app.use(cors()) //habilitar CORS

//Rutas
app.use('/api/solicitud_prestamo', solicitud_prestamoRoutes)

//conexion a la base de datos
try{
    await db.authenticate()
    console.log('Conexion a la base de datos establecida')
}catch(error){
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) //finaliza la app si no conecta
}

app.get('/', (req, res) => {
    res.send('solicitud de prestamo a registrar')
})

dotenv.config() //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})
export default app