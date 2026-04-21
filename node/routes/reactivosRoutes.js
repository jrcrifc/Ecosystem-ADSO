import express from 'express';
import { 
    getAllreactivos, 
    getreactivos, 
    createreactivos, 
    updatereactivos, 
    deletereactivos 
} from '../controller/reactivosController.js';
import reactivosModel from '../models/reactivosModel.js';
import movimientoreactivoModel from '../models/movimientoreactivosModel.js';

const router = express.Router();

// ✅ RUTA STOCK — debe ir ANTES de '/:id' para que no la intercepte
router.get('/stock/disponibilidad', async (req, res) => {
  try {
    const reactivos = await reactivosModel.findAll({ where: { estado: 1 } });
    const movimientos = await movimientoreactivoModel.findAll();

    const resultado = reactivos.map(r => {
      const movs = movimientos.filter(m => m.id_reactivo === r.id_reactivo);
      const cantidad_inventario = movs.reduce((acc, m) => {
        return acc + parseFloat(m.cantidad_inicial || 0) - parseFloat(m.cantidad_salida || 0);
      }, 0);
      return {
        id_reactivo: r.id_reactivo,
        nom_reactivo: r.nom_reactivo,
        presentacion_reactivo: r.presentacion_reactivo,
        cantidad_inventario: Math.max(0, parseFloat(cantidad_inventario.toFixed(3))),
        estado_stock: cantidad_inventario > 0 ? 'disponible' : 'agotado'
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Rutas normales
router.get('/', getAllreactivos);
router.get('/:id', getreactivos);
router.post('/', createreactivos);
router.put('/:id', updatereactivos);
router.delete('/:id', deletereactivos);

// Cambiar estado activo/inactivo
router.put('/estado/:id', async (req, res) => {
    try {
        const reactivo = await reactivosModel.findByPk(req.params.id);
        if (!reactivo) return res.status(404).json({ message: "reactivo no encontrado" });
        const nuevoEstado = reactivo.estado === 1 ? 0 : 1;
        await reactivo.update({ estado: nuevoEstado });
        res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

export default router;