import express from 'express';
import {
  getAllEstadoxequipo,
  getEstadoxequipo,
  createEstadoxequipo,
  updateEstadoxequipo,
  deleteEstadoxequipo
} from '../controller/EstadoxequipoController.js';
import estadoxequipoService from '../service/EstadoxequipoService.js'; // ← arriba

const router = express.Router();

// ← Rutas específicas ANTES de /:id
router.get('/ultimos/estados', async (req, res) => {
  try {
    const data = await estadoxequipoService.getUltimosEstados();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cambiarEstado', async (req, res) => {
  try {
    const { id_equipo, id_estado_equipo } = req.body;
    const data = await estadoxequipoService.cambiarEstado(id_equipo, id_estado_equipo);
    res.status(201).json({ message: "Estado cambiado", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ← Rutas con parámetro DESPUÉS
router.get('/', getAllEstadoxequipo);
router.get('/:id', getEstadoxequipo);
router.post('/', createEstadoxequipo);
router.put('/:id', updateEstadoxequipo);
router.delete('/:id', deleteEstadoxequipo);

export default router;