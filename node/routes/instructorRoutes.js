// Rutas para instructores
import express from "express";
import { getInstructores, createInstructor, updateInstructor, deleteInstructor } from "../controller/instructorController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { soloAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Cualquier usuario autenticado puede ver los instructores
router.get("/", authMiddleware, getInstructores);
// Solo admin puede gestionar instructores
router.post("/", authMiddleware, soloAdmin, createInstructor);
router.put("/:id", authMiddleware, soloAdmin, updateInstructor);
router.delete("/:id", authMiddleware, soloAdmin, deleteInstructor);

export default router;
