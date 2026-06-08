// Importa Express para crear las rutas del servidor
import express from "express";
// Importa los controladores de estados de equipo
import {
    getAllEstadoequipo,
    getEstadoequipo,
    createEstadoequipo,
    updateEstadoequipo,
    deleteEstadoequipo
} from "../controller/Estado_equipoController.js";
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/estadoequipo para obtener todos los estados de equipo
router.get("/", adminOGestor, getAllEstadoequipo);

// Define la ruta GET /api/estadoequipo/:id para obtener un estado de equipo por ID
router.get("/:id", adminOGestor, getEstadoequipo);

// Define la ruta POST /api/estadoequipo para crear un nuevo estado de equipo
router.post("/", adminOGestor, createEstadoequipo);

// Define la ruta PUT /api/estadoequipo/:id para actualizar un estado de equipo existente
router.put("/:id", adminOGestor, updateEstadoequipo);

// Define la ruta DELETE /api/estadoequipo/:id para eliminar un estado de equipo
router.delete("/:id", adminOGestor, deleteEstadoequipo);

// Exporta el router para ser usado en la aplicación
export default router;