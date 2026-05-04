import express from 'express';
import { getAllEquipos, getEquipos, createEquipos, updateEquipos, deleteEquipos } from '../controller/EquiposController.js';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOGestor } from '../middleware/roleMiddleware.js';

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

router.get('/', adminOGestor, getAllEquipos);
router.get('/:id', adminOGestor, getEquipos);
router.post('/', adminOGestor, upload.single('foto_equipo'), createEquipos);
router.put('/:id', adminOGestor, upload.single('foto_equipo'), updateEquipos);
router.delete('/:id', adminOGestor, deleteEquipos);

export default router;
