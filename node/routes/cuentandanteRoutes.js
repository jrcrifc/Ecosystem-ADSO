import express from 'express';
import { 
    getAllcuentadante, 
    getcuentadante, 
    createcuentadante, 
    updatecuentadante, 
    toggleEstadoCuentadante 
} from '../controller/cuentadanteController.js';
import { adminOGestor } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', adminOGestor, getAllcuentadante);
router.post('/', adminOGestor, createcuentadante);
router.put('/toggle-estado/:id', adminOGestor, toggleEstadoCuentadante);
router.get('/:id', adminOGestor, getcuentadante);
router.put('/:id', adminOGestor, updatecuentadante);

export default router;