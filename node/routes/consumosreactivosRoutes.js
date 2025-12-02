import express from 'express';
import { 
    getAllconsumosreactivos, 
    getconsumosreactivos, 
    createconsumosreactivos, 
    updateconsumosreactivos, 
    deleteconsumosreactivos 
} from '../controller/consumosreactivosController.js';
import consumosreactivosModel from '../models/consumosreactivosModel.js';

const router = express.Router();

// Rutas normales
router.get('/', getAllconsumosreactivos);
router.get('/:id', getconsumosreactivos);
router.post('/', createconsumosreactivos);
router.put('/:id', updateconsumosreactivos);
router.delete('/:id', deleteconsumosreactivos);

// NUEVA RUTA: CAMBIAR ESTADO (ACTIVO/INACTIVO)
router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const consumo = await consumosreactivosModel.findByPk(id);

        if (!consumo) {
            return res.status(404).json({ message: "Consumo no encontrado" });
        }

        const nuevoEstado = consumo.estado === 1 ? 0 : 1;
        await consumo.update({ estado: nuevoEstado });

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