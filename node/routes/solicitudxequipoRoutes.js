import express from 'express';
import { 
  getAllsolicitudxequipo, 
  getsolicitudxequipo, 
  createsolicitudxequipo, 
  updatesolicitudxequipo, 
  deletesolicitudxequipo 
} from '../controller/solicitudxequipoController.js';

// IMPORT QUE FALTABA (ESTE ES EL CULPABLE DEL 500)
import solicitudxequipoModel from '../models/solicitudxequipoModel.js';

const router = express.Router();

router.get('/', getAllsolicitudxequipo);
router.get('/:id', getsolicitudxequipo);
router.post('/', createsolicitudxequipo);
router.put('/:id', updatesolicitudxequipo);
router.delete('/:id', deletesolicitudxequipo);

// RUTA PARA CAMBIAR ESTADO
router.put('/estado/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const relacion = await solicitudxequipoModel.findByPk(id);
    if (!relacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    const nuevoEstado = relacion.estado === 1 ? 0 : 1;
    await relacion.update({ estado: nuevoEstado });

    res.json({ 
      message: "Estado cambiado correctamente", 
      estado: nuevoEstado 
    });
  } catch (error) {
    console.error("Error en /estado/:id:", error);
    res.status(500).json({ 
      message: "Error del servidor", 
      error: error.message 
    });
  }
});

export default router;