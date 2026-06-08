// Importa Express para crear las rutas del servidor
import express from "express";
// Importa los controladores de estados de solicitud
import {
    getAllEstadoSolicitud,
    getEstadoSolicitud,
    createEstadoSolicitud,
    updateEstadoSolicitud,
    deleteEstadoSolicitud
} from "../controller/EstadosolicitudController.js";
// Importa el middleware que restringe el acceso solo a administradores
import { soloAdmin } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/estadosolicitud para obtener todos los estados de solicitud
router.get("/", soloAdmin, getAllEstadoSolicitud);

// Define la ruta GET /api/estadosolicitud/:id para obtener un estado de solicitud por ID
router.get("/:id", soloAdmin, getEstadoSolicitud);

// Define la ruta POST /api/estadosolicitud para crear un nuevo estado de solicitud
router.post("/", soloAdmin, createEstadoSolicitud);

// Define la ruta PUT /api/estadosolicitud/:id para actualizar un estado de solicitud existente
router.put("/:id", soloAdmin, updateEstadoSolicitud);

// Define la ruta DELETE /api/estadosolicitud/:id para eliminar un estado de solicitud
router.delete("/:id", soloAdmin, deleteEstadoSolicitud);

// Exporta el router para ser usado en la aplicación
export default router;