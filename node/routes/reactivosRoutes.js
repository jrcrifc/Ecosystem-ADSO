import express from 'express';
import { 
    getAllreactivos, 
    getreactivos, 
    createreactivos, 
    updatereactivos, 
    deletereactivos 
} from '../controller/reactivosController.js';
import reactivosModel from '../models/reactivosModel.js';

const router = express.Router();

// Rutas normales
router.get('/', getAllreactivos);
router.get('/:id', getreactivos);
router.post('/', createreactivos);
router.put('/:id', updatereactivos);
router.delete('/:id', deletereactivos);

// NUEVA RUTA: CAMBIAR ESTADO (ACTIVO/INACTIVO)
router.put('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reactivo = await reactivosModel.findByPk(id);

        if (!reactivo) {
            return res.status(404).json({ message: "reactivo no encontrado" });
        }

        const nuevoEstado = reactivo.estado === 1 ? 0 : 1;
        await reactivo.update({ estado: nuevoEstado });

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