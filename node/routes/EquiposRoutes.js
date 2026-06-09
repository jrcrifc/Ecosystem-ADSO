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
// Importa path para resolver rutas de archivos
import path from 'path';
// Importa fileURLToPath para obtener __dirname en ESM
import { fileURLToPath } from 'url';
// Importa fs para crear directorios si no existen
import fs from 'fs';

// Obtiene la ruta del archivo actual (necesario en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la carpeta destino para las fotos de equipos
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'equipos');
// Crea la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Crea una nueva instancia del Router
const router = express.Router();

// Configura el almacenamiento local en disco con Multer
const almacenamiento = multer.diskStorage({
  // Define la carpeta de destino para los archivos subidos
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Define el nombre del archivo con timestamp para evitar duplicados
  filename: (req, file, cb) => {
    const uniqueName = `equipo_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtra solo archivos de imagen válidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, jpeg, webp)'), false);
  }
};

// Instancia Multer con almacenamiento local y filtro de archivos
const upload = multer({ storage: almacenamiento, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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
