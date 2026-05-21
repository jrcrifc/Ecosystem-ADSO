import express from 'express';
import { getAllEquipos, getEquipos, createEquipos, updateEquipos, deleteEquipos } from '../controller/EquiposController.js';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOGestor } from '../middleware/roleMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Asegurar que dotenv cargue
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const almacenamiento = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecosystem_equipos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: almacenamiento });

router.get('/', adminOGestor, getAllEquipos);
router.get('/:id', adminOGestor, getEquipos);
router.post('/', adminOGestor, upload.single('foto_equipo'), createEquipos);
router.put('/:id', adminOGestor, upload.single('foto_equipo'), updateEquipos);
router.delete('/:id', adminOGestor, deleteEquipos);

export default router;
