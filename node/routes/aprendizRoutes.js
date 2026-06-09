// Rutas para aprendices
import express from "express";
import { getAprendices, createAprendiz, updateAprendiz, deleteAprendiz } from "../controller/aprendizController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { soloAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Cualquier usuario autenticado puede ver los aprendices
router.get("/", authMiddleware, getAprendices);
// Solo admin puede gestionar (crear, editar, eliminar) aprendices manualmente
router.post("/", authMiddleware, soloAdmin, createAprendiz);
router.put("/:id", authMiddleware, soloAdmin, updateAprendiz);
router.delete("/:id", authMiddleware, soloAdmin, deleteAprendiz);

export default router;
