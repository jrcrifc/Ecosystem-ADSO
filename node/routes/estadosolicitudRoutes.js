import express from 'express'
import { getAllestadosolicitud, getestadosolicitud, createestadosolicitud, updateestadosolicitud, deleteestadosolicitud } from '../controller/estadosolicitudController.js'
import estadoSolicitudModel from '../models/estadosolicitudModel.js';



const router = express.Router()

router.get('/', getAllestadosolicitud);
router.get('/:id', getestadosolicitud);
router.post('/', createestadosolicitud);
router.put('/:id', updateestadosolicitud);
router.delete('/:id', deleteestadosolicitud);
router.put("/estado/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const relacion = await solicitudxequipoModel.findByPk(id);
    if (!relacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    const nuevoEstado = relacion.estado === 1 ? 0 : 1;
    await relacion.update({ estado: nuevoEstado });

    // RESPUESTA CLARA Y SIN ERROR
    return res.status(200).json({
      success: true,
      message: "Estado actualizado",
      estado: nuevoEstado,
    });
  } catch (error) {
    console.error("Error en ruta /estado/:id:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});
export default router;





