import express from 'express';
import { 
    getAll, 
    getById, 
    create, 
    update,
    cambiarEstado,
    remove 
} from '../controller/solicitudController.js';
import solicitudModel from '../models/solicitudModel.js';
import authMiddleware from '../middleware/authMiddleware.js'; // ← importa el middleware
import { todosLosRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ← todas las rutas protegidas con el middleware
router.get('/',            todosLosRoles, getAll);
router.get('/:id',         todosLosRoles, getById);
router.post('/',           todosLosRoles, create);       // aquí req.user.id ya está disponible
router.put('/:id',         todosLosRoles, update);
router.delete('/:id',      todosLosRoles, remove);

// ← Cambiar estado activo/inactivo (toggle 1/0)
router.put('/estado/:id',  todosLosRoles, async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await solicitudModel.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        const nuevoEstado = solicitud.estado === 1 ? 0 : 1;
        await solicitud.update({ estado: nuevoEstado });
        res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
});

// ← Solo admin: cambiar estado (generado, aceptado, prestado, etc.)
router.post('/cambiarEstado/:id', todosLosRoles, cambiarEstado);

export default router;