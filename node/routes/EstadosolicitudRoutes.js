import express from "express";
import {
    getAllEstadoSolicitud,
    getEstadoSolicitud,
    createEstadoSolicitud,
    updateEstadoSolicitud,
    deleteEstadoSolicitud
} from "../controller/estadoSolicitudController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllEstadoSolicitud);
router.get("/:id", authMiddleware, getEstadoSolicitud);
router.post("/", authMiddleware, createEstadoSolicitud);
router.put("/:id", authMiddleware, updateEstadoSolicitud);
router.delete("/:id", authMiddleware, deleteEstadoSolicitud);

export default router;