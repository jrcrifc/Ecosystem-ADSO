import express from 'express';
import { 
    getAllsolicitud, 
    getsolicitud, 
    createsolicitud, 
    updatesolicitud, 
    deletesolicitud 
} from '../controller/solicitudController.js';
import solicitudModel from '../models/solicitudModel.js';

const router = express.Router();

router.get('/', getAllsolicitud);
router.get('/:id', getsolicitud);
router.post('/', createsolicitud);
router.put('/:id', updatesolicitud);
router.delete('/:id', deletesolicitud);

// NUEVA RUTA PARA CAMBIAR ESTADO
router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await solicitudModel.findByPk(id);

        if (!solicitud) {
            return res.status(404).json({ message: "solicitud no encontrada" });
        }

        const nuevoEstado = solicitud.estado === 1 ? 0 : 1;
        await solicitud.update({ estado: nuevoEstado });

        res.json({ 
            message: "Estado cambiado correctamente",
            estado: nuevoEstado 
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

export default router;