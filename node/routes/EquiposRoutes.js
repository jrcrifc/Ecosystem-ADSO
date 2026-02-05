import express from 'express';
import { getAllEquipos, getEquipos, createEquipos, updateEquipos, deleteEquipos } from '../controllers/EquiposController.js';
import multer from 'multer';
import path from 'path';

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

router.get('/', getAllEquipos);
router.get('/:id', getEquipos);
router.post('/', upload.single('foto'), createEquipos);
router.put('/:id', upload.single('foto'), updateEquipos);
router.delete('/:id', deleteEquipos);

export default router;
