import express from "express";
import {
    getAllEstadoequipo,
    getEstadoequipo,
    createEstadoequipo,
    updateEstadoequipo,
    deleteEstadoequipo
} from "../controller/Estado_equipoController.js";
import { adminOGestor } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/", adminOGestor, getAllEstadoequipo);
router.get("/:id", adminOGestor, getEstadoequipo);
router.post("/", adminOGestor, createEstadoequipo);
router.put("/:id", adminOGestor, updateEstadoequipo);
router.delete("/:id", adminOGestor, deleteEstadoequipo);

export default router;