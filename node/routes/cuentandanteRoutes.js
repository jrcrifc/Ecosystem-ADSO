import express from 'express';
import { 
    getAllcuentadante, 
    getcuentadante, 
    createcuentadante, 
    updatecuentadante, 
    deletecuentadante 
} from '../controller/cuentadanteController.js';
import { adminOGestor } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', adminOGestor, getAllcuentadante);
router.get('/:id', adminOGestor, getcuentadante);
router.post('/', adminOGestor, createcuentadante);
router.put('/:id', adminOGestor, updatecuentadante);
router.delete('/:id', adminOGestor, deletecuentadante);

export default router;