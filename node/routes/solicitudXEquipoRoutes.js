import { Router } from 'express';
import { getAll, createRelation, updateRelation, deleteRelation } from '../controllers/solicitudXEquipoController.js';

const router = Router();

router.get('/', getAll);
router.post('/', createRelation);
router.put('/:id', updateRelation);
router.delete('/:id', deleteRelation);

export default router;
