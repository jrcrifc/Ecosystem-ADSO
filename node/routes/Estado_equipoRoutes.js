import express from "express";
import {
    getAllEstadoequipo,
    getEstadoequipo,
    createEstadoequipo,
    updateEstadoequipo,
    deleteEstadoequipo
} from "../controller/Estado_equipoController.js";

const router = express.Router();

router.get("/", getAllEstadoequipo);
router.get("/:id", getEstadoequipo);
router.post("/", createEstadoequipo);
router.put("/:id", updateEstadoequipo);
router.delete("/:id", deleteEstadoequipo);

export default router;