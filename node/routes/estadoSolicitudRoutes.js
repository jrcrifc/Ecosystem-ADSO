import express from "express";
import {
    getAllEstadoSolicitud,
    getEstadoSolicitud,
    createEstadoSolicitud,
    updateEstadoSolicitud,
    deleteEstadoSolicitud
} from "../controller/EstadosolicitudController.js";
import { soloAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/", soloAdmin, getAllEstadoSolicitud);
router.get("/:id", soloAdmin, getEstadoSolicitud);
router.post("/", soloAdmin, createEstadoSolicitud);
router.put("/:id", soloAdmin, updateEstadoSolicitud);
router.delete("/:id", soloAdmin, deleteEstadoSolicitud);

export default router;