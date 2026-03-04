import express from "express";
import {
    getAllEstadoSolicitud,
    getEstadoSolicitud,
    createEstadoSolicitud,
    updateEstadoSolicitud,
    deleteEstadoSolicitud
} from "../controller/estadoSolicitudController.js";

const router = express.Router();

router.get("/", getAllEstadoSolicitud);
router.get("/:id", getEstadoSolicitud);
router.post("/", createEstadoSolicitud);
router.put("/:id", updateEstadoSolicitud);
router.delete("/:id", deleteEstadoSolicitud);

export default router;