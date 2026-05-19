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
import { adminOGestor } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ✅ RUTA STOCK — debe ir ANTES de '/:id' para que no la intercepte
router.get('/stock/disponibilidad', adminOGestor, async (req, res) => {
  try {
    const hoy = new Date();
    const reactivos = await reactivosModel.findAll({ where: { estado: 1 } });
    const movimientos = await movimientoreactivoModel.findAll({ where: { estado: 1 } });

    const resultado = reactivos.map(r => {
      const movs = movimientos.filter(m => m.id_reactivo === r.id_reactivo);

      // Agrupar por lote para saber cuáles están vencidos
      const loteMap = {};
      movs.forEach(m => {
        const lote = m.lote || 'Sin lote';
        if (!loteMap[lote]) {
          loteMap[lote] = {
            fecha_vencimiento: m.fecha_vencimiento || null,
            cantidad_disponible: 0
          };
        }
        loteMap[lote].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
        loteMap[lote].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
      });

      // Solo contar lotes NO vencidos para el inventario disponible
      let cantidad_inventario = 0;
      let lotes_vencidos_count = 0;
      let cantidad_vencida = 0;

      Object.values(loteMap).forEach(l => {
        const disponible = parseFloat(l.cantidad_disponible.toFixed(3));
        if (disponible <= 0) return;
        const vencido = l.fecha_vencimiento && new Date(l.fecha_vencimiento) <= hoy;
        if (vencido) {
          lotes_vencidos_count++;
          cantidad_vencida += disponible;
        } else {
          cantidad_inventario += disponible;
        }
      });

      return {
        id_reactivo: r.id_reactivo,
        nom_reactivo: r.nom_reactivo,
        presentacion_reactivo: r.presentacion_reactivo,
        cantidad_inventario: Math.max(0, parseFloat(cantidad_inventario.toFixed(3))),
        estado_stock: cantidad_inventario > 0 ? 'disponible' : 'agotado',
        lotes_vencidos: lotes_vencidos_count,
        cantidad_vencida: parseFloat(cantidad_vencida.toFixed(3))
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Rutas normales
router.get('/', adminOGestor, getAllreactivos);
router.get('/:id', adminOGestor, getreactivos);
router.post('/', adminOGestor, createreactivos);
router.put('/:id', adminOGestor, updatereactivos);
router.delete('/:id', adminOGestor, deletereactivos);

// Cambiar estado activo/inactivo
router.put('/estado/:id', adminOGestor, async (req, res) => {
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