// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de la relación solicitud-equipo
import { 
  getAllsolicitudxequipo, 
  getsolicitudxequipo, 
  createsolicitudxequipo, 
  updatesolicitudxequipo, 
  deletesolicitudxequipo 
} from '../controller/solicitudxequipoController.js';
// Importa el modelo de la tabla pivote solicitudxequipo
import solicitudxequipoModel from '../models/solicitudxequipoModel.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/solicitudxequipo para obtener todas las asociaciones
router.get('/', getAllsolicitudxequipo);

// Define la ruta GET /api/solicitudxequipo/:id para obtener una asociación por ID
router.get('/:id', getsolicitudxequipo);

// Define la ruta POST /api/solicitudxequipo para crear una nueva asociación
router.post('/', createsolicitudxequipo);

// Define la ruta PUT /api/solicitudxequipo/:id para actualizar una asociación existente
router.put('/:id', updatesolicitudxequipo);

// Define la ruta DELETE /api/solicitudxequipo/:id para eliminar una asociación
router.delete('/:id', deletesolicitudxequipo);

// Define la ruta PUT /api/solicitudxequipo/estado/:id para activar/inactivar una asociación
router.put('/estado/:id', async (req, res) => {
  try {
    // Obtiene el ID de la relación desde los parámetros de la ruta
    const { id } = req.params;

    // Busca la relación en la base de datos
    const relacion = await solicitudxequipoModel.findByPk(id);
    // Si no existe la relación responde con 404
    if (!relacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    // Calcula el nuevo estado invirtiendo el actual
    const nuevoEstado = relacion.estado === 1 ? 0 : 1;
    // Actualiza el estado de la relación
    await relacion.update({ estado: nuevoEstado });

    // Responde con el mensaje de éxito y el nuevo estado
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

// Exporta el router para ser usado en la aplicación
export default router;