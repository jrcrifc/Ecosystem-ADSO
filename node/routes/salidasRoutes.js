import express from 'express';
import { 
    getAllsalidas, 
    getsalidas, 
    createsalidas, 
    updatesalidas, 
    deletesalidas 
} from '../controller/salidasController.js';
import salidasModel from '../models/salidasModel.js';

const router = express.Router();

router.get('/', getAllsalidas);
router.get('/:id', getsalidas);
router.post('/', createsalidas);
router.put('/:id', updatesalidas);
router.delete('/:id', deletesalidas);

// NUEVA RUTA PARA CAMBIAR ESTADO
router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const salidas = await salidasModel.findByPk(id);

        if (!salidas) {
            return res.status(404).json({ message: "salidas no encontradas" });
        }

        const nuevoEstado = salidas.estado === 1 ? 0 : 1;
        await salidas.update({ estado: nuevoEstado });

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