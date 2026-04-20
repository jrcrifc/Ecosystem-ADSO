import express from 'express';
import { 
    getAllcuentadante, 
    getcuentadante, 
    createcuentadante, 
    updatecuentadante, 
    deletecuentadante 
} from '../controller/cuentadanteController.js';


const router = express.Router();

router.get('/', getAllcuentadante);
router.get('/:id', getcuentadante);
router.post('/', createcuentadante);
router.put('/:id', updatecuentadante);
router.delete('/:id', deletecuentadante);


export default router;