import express from 'express';
import { 
    getAllsalidas, 
    getsalidas, 
    createsalidas, 
    updatesalidas, 
    deletesalidas 
} from '../controller/salidasController.js';
import salidasModel from '../models/salidasModel.js';
import salidasService from "../service/salidasService.js";
import { adminOGestor } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.get('/', adminOGestor, getAllsalidas);
router.get('/:id', adminOGestor, getsalidas);
router.post('/', adminOGestor, createsalidas);
router.put('/:id', adminOGestor, updatesalidas);
router.delete('/:id', adminOGestor, deletesalidas);

// NUEVA RUTA PARA CAMBIAR ESTADO
router.put('/estado/:id', adminOGestor, async (req, res) => {
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

// ✅ Ruta para obtener lotes FEFO de un reactivo — ANTES de las rutas con :id
router.get('/lotes-fefo/:id_reactivo', adminOGestor, async (req, res) => {
  try {
    const lotes = await salidasService.getLotesFefo(req.params.id_reactivo);
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;