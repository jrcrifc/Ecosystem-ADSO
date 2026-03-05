import express from 'express';
import { getAllEquipos, getEquipos, createEquipos, updateEquipos, deleteEquipos } from '../controller/EquiposController.js';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: almacenamiento });

router.get('/', authMiddleware ,getAllEquipos);
router.get('/:id', authMiddleware , getEquipos);
router.post('/',  authMiddleware , upload.single('foto_equipo'), createEquipos);
router.put('/:id', authMiddleware, upload.single('foto_equipo'), updateEquipos);
router.delete('/:id', authMiddleware, deleteEquipos);

export default router;
