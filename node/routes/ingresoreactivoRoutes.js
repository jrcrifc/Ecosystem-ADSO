import express from 'express';
import { 
    getAllingresoreactivo, 
    getingresoreactivo, 
    createingresoreactivo, 
    updateingresoreactivo, 
    deleteingresoreactivo 
} from '../controller/ingresoreactivoController.js';
import ingresoreactivoModel from '../models/ingresoreactivoModel.js';

const router = express.Router();

router.get('/', getAllingresoreactivo);
router.get('/:id', getingresoreactivo);
router.post('/', createingresoreactivo);
router.put('/:id', updateingresoreactivo);
router.delete('/:id', deleteingresoreactivo);

// NUEVA RUTA PARA CAMBIAR ESTADO
router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ingreso = await ingresoreactivoModel.findByPk(id);

        if (!ingreso) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        const nuevoEstado = ingreso.estado === 1 ? 0 : 1;
        await ingreso.update({ estado: nuevoEstado });

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