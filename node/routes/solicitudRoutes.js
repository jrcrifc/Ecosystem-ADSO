import express from 'express';
import { getAll, getById, create, update, remove } from '../controller/solicitudController.js';
import solicitudModel from '../models/solicitudModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, create); // ✅ authMiddleware para tomar id_usuario del token
router.put('/:id', update);
router.delete('/:id', remove);

router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await solicitudModel.findByPk(id);
        if (!solicitud) return res.status(404).json({ message: "solicitud no encontrada" });
        const nuevoEstado = solicitud.estado === 1 ? 0 : 1;
        await solicitud.update({ estado: nuevoEstado });
        res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
});

export default router;