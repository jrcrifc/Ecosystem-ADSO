// Importa Express para crear las rutas del servidor
import express from "express";
// Importa el middleware de autenticación JWT
import authMiddleware from "../middleware/authMiddleware.js";
// Importa el controlador de estadísticas del dashboard
import { getDashboardStats } from "../controller/dashboardController.js";

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/dashboard/stats para obtener las estadísticas del dashboard
router.get("/stats", authMiddleware, getDashboardStats);

// Exporta el router para ser usado en la aplicación
export default router;

