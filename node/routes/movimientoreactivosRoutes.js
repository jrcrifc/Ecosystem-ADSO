import express from 'express'
import { getAllmovimientoreactivo, getmovimientoreactivo, createmovimientoreactivo, updatemovimientoreactivo, deletemovimientoreactivo } from '../controller/movimientoreactivosController.js'
import movimientoreactivoModel from '../models/movimientoreactivosModel.js';



const router = express.Router()

router.get('/', getAllmovimientoreactivo);
router.get('/:id', getmovimientoreactivo);
router.post('/', createmovimientoreactivo);
router.put('/:id', updatemovimientoreactivo);
router.delete('/:id', deletemovimientoreactivo);
router.put("/estado/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await movimientoreactivoModel.findByPk(id);
    if (!movimiento) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }


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





