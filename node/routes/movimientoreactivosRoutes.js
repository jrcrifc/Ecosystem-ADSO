import express from 'express';
import { 
  getAllmovimientoreactivo, 
  getmovimientoreactivo, 
  createmovimientoreactivo, 
  updatemovimientoreactivo, 
  deletemovimientoreactivo 
} from '../controller/movimientoreactivosController.js';
import movimientoreactivoModel from '../models/movimientoreactivosModel.js';

const router = express.Router();

// ✅ RUTA STOCK POR LOTES — debe ir ANTES de '/:id'
router.get('/stock-lotes/:id_reactivo', async (req, res) => {
  try {
    const { id_reactivo } = req.params;
    const hoy = new Date();

    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo }
    });

    // Calcular cantidad disponible por lote
    const loteMap = {};
    movimientos.forEach(m => {
      const lote = m.lote || 'Sin lote';
      if (!loteMap[lote]) {
        loteMap[lote] = {
          lote,
          id_movimiento_reactivo: m.id_movimiento_reactivo,
          fecha_vencimiento: m.fecha_vencimiento || null,
          cantidad_disponible: 0
        };
      }
      loteMap[lote].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
      loteMap[lote].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
    });

    const todosLotes = Object.values(loteMap).map(l => {
      const diasParaVencer = l.fecha_vencimiento
        ? Math.floor((new Date(l.fecha_vencimiento) - hoy) / (1000 * 60 * 60 * 24))
        : null;
      return {
        ...l,
        cantidad_disponible: Math.max(0, parseFloat(l.cantidad_disponible.toFixed(3))),
        dias_para_vencer: diasParaVencer
      };
    });

    // Separar disponibles y vencidos
    const lotes_disponibles = todosLotes.filter(l =>
      l.cantidad_disponible > 0 && (l.dias_para_vencer === null || l.dias_para_vencer > 0)
    );

    const lotes_vencidos = todosLotes.filter(l =>
      l.dias_para_vencer !== null && l.dias_para_vencer <= 0
    );

    res.json({
      lotes_disponibles,
      resumen_vencidos: {
        cantidad_lotes_vencidos: lotes_vencidos.length,
        detalles: lotes_vencidos
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', getAllmovimientoreactivo);
router.get('/:id', getmovimientoreactivo);
router.post('/', createmovimientoreactivo);
router.put('/:id', updatemovimientoreactivo);
router.delete('/:id', deletemovimientoreactivo);

router.put("/estado/:id", async (req, res) => {
  try {
    const movimiento = await movimientoreactivoModel.findByPk(req.params.id);
    if (!movimiento) return res.status(404).json({ message: "Relación no encontrada" });
    return res.status(200).json({ success: true, message: "Estado actualizado" });
  } catch (error) {
    console.error("Error en ruta /estado/:id:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
  }
});

export default router;