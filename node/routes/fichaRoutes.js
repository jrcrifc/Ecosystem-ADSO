// Rutas para fichas
import express from "express";
import multer from "multer";
import { getFichas, createFicha, updateFicha, deleteFicha, importarFichasExcel } from "../controller/fichaController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { soloAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Configura multer en memoria para recibir archivos Excel
const upload = multer({ storage: multer.memoryStorage() });

// Cualquier usuario puede ver las fichas (útil para el registro)
router.get("/", getFichas);
// Solo admin puede crear, editar o eliminar fichas
router.post("/", authMiddleware, soloAdmin, createFicha);
router.put("/:id", authMiddleware, soloAdmin, updateFicha);
router.delete("/:id", authMiddleware, soloAdmin, deleteFicha);
// Importar fichas desde Excel
router.post("/importar-excel", authMiddleware, soloAdmin, upload.single("file"), importarFichasExcel);

export default router;
