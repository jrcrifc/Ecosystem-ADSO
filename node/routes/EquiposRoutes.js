// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de equipos para manejar la lógica de cada endpoint
import { getAllEquipos, getEquipos, createEquipos, updateEquipos, deleteEquipos } from '../controller/EquiposController.js';
// Importa multer para la carga de archivos (fotos de equipos)
import multer from 'multer';
// Importa el middleware de autenticación JWT
import authMiddleware from '../middleware/authMiddleware.js';
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';
// Importa Cloudinary para almacenamiento de imágenes en la nube
import { v2 as cloudinary } from 'cloudinary';
// Importa el almacenamiento de Cloudinary para multer
import { CloudinaryStorage } from 'multer-storage-cloudinary';
// Importa dotenv para manejar variables de entorno
import dotenv from 'dotenv';
// Importa path para resolver rutas de archivos
import path from 'path';

// Carga las variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Crea una nueva instancia del Router
const router = express.Router();

// Configura las credenciales de Cloudinary desde las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configura el motor de almacenamiento de Cloudinary para Multer
const almacenamiento = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Carpeta donde se almacenarán las imágenes en Cloudinary
    folder: 'ecosystem_equipos',
    // Extensiones de imagen permitidas
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

// Instancia Multer con la configuración de almacenamiento en la nube
const upload = multer({ storage: almacenamiento });

// Define la ruta GET /api/equipos para obtener todos los equipos
router.get('/', adminOGestor, getAllEquipos);

// Define la ruta GET /api/equipos/:id para obtener un equipo por ID
router.get('/:id', adminOGestor, getEquipos);

// Define la ruta POST /api/equipos para crear un nuevo equipo con foto opcional
router.post('/', adminOGestor, upload.single('foto_equipo'), createEquipos);

// Define la ruta PUT /api/equipos/:id para actualizar un equipo existente con foto opcional
router.put('/:id', adminOGestor, upload.single('foto_equipo'), updateEquipos);

// Define la ruta DELETE /api/equipos/:id para eliminar un equipo
router.delete('/:id', adminOGestor, deleteEquipos);

// Exporta el router para ser usado en la aplicación
export default router;

