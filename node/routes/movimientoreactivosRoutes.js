import express from 'express'
import { getAllinventarioreactivo, getinventarioreactivo, createinventarioreactivo, updateinventarioreactivo, deleteinventarioreactivo } from '../controller/movimientoreactivosController.js'



const router = express.Router()

router.get('/', getAllinventarioreactivo);
router.get('/:id', getinventarioreactivo);
router.post('/', createinventarioreactivo);
router.put('/:id', updateinventarioreactivo);
router.delete('/:id', deleteinventarioreactivo);
router.put("/estado/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const inventario = await inventarioreactivosModel.findByPk(id);
    if (!inventario) {
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





