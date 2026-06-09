// Rutas para programas de formación
import express from "express";
import multer from "multer";
import { getProgramas, createPrograma, updatePrograma, deletePrograma, importarProgramasExcel } from "../controller/programaController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { soloAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Configura multer en memoria para recibir archivos Excel
const upload = multer({ storage: multer.memoryStorage() });

// Cualquier usuario autenticado puede ver los programas (útil para el registro)
router.get("/", getProgramas);
// Solo admin puede crear, editar o eliminar programas
router.post("/", authMiddleware, soloAdmin, createPrograma);
router.put("/:id", authMiddleware, soloAdmin, updatePrograma);
router.delete("/:id", authMiddleware, soloAdmin, deletePrograma);
// Importar programas desde Excel
router.post("/importar-excel", authMiddleware, soloAdmin, upload.single("file"), importarProgramasExcel);

export default router;
