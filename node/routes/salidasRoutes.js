// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de salidas para manejar la lógica de cada endpoint
import { 
    getAllsalidas, 
    getsalidas, 
    createsalidas, 
    updatesalidas, 
    deletesalidas 
} from '../controller/salidasController.js';
// Importa el modelo de salidas para consultas en la base de datos
import salidasModel from '../models/salidasModel.js';
// Importa el servicio de salidas que contiene la lógica FEFO
import salidasService from "../service/salidasService.js";
// Importa la función para emitir eventos por Socket.io
import { getIO } from '../socket.js';
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/salidas/lotes-fefo/:id_reactivo para obtener lotes ordenados por FEFO
router.get('/lotes-fefo/:id_reactivo', adminOGestor, async (req, res) => {
  try {
    // Obtiene los lotes FEFO desde el servicio
    const lotes = await salidasService.getLotesFefo(req.params.id_reactivo);
    // Responde con los lotes ordenados
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define la ruta GET /api/salidas para obtener todas las salidas
router.get('/', adminOGestor, getAllsalidas);

// Define la ruta GET /api/salidas/:id para obtener una salida por ID
router.get('/:id', adminOGestor, getsalidas);

// Define la ruta POST /api/salidas para crear una nueva salida
router.post('/', adminOGestor, createsalidas);

// Define la ruta PUT /api/salidas/:id para actualizar una salida existente
router.put('/:id', adminOGestor, updatesalidas);

// Define la ruta DELETE /api/salidas/:id para eliminar una salida
router.delete('/:id', adminOGestor, deletesalidas);

// Define la ruta PUT /api/salidas/estado/:id para activar/inactivar una salida y ajustar stock
router.put('/estado/:id', adminOGestor, async (req, res) => {
    try {
        // Obtiene el ID de la salida desde los parámetros de la ruta
        const { id } = req.params;
        // Busca la salida en la base de datos
        const salidas = await salidasModel.findByPk(id);

        // Si no existe la salida responde con 404
        if (!salidas) {
            return res.status(404).json({ message: "salidas no encontradas" });
        }

        // Calcula el nuevo estado invirtiendo el actual
        const nuevoEstado = salidas.estado === 1 ? 0 : 1;

        if (nuevoEstado === 0) {
            // Anula la salida devolviendo el stock al lote original
            await salidasService.delete(id);
        } else {
            // Reactiva la salida descontando nuevamente el stock del lote
            await salidasService.activar(id);
        }

        // Emite eventos de actualización en tiempo real por Socket.io
        try {
            getIO().emit('salida_actualizada');
            getIO().emit('movimiento_actualizado');
        } catch (socketError) {
            console.error('Error al emitir eventos de socket:', socketError);
        }

        // Responde con el mensaje de éxito y el nuevo estado
        res.json({ 
            message: "Estado cambiado correctamente",
            estado: nuevoEstado 
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ message: error.message || "Error del servidor" });
    }
});

// Exporta el router para ser usado en la aplicación
export default router;