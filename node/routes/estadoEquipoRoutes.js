import express from "express";
import {
  getAllEstadoEquipo,
  getEstadoEquipoById,
  createEstadoEquipo,
  updateEstadoEquipo,
  deleteEstadoEquipo,
} from "../controller/estadoEquipoController.js";

const router = express.Router();

// GET todos
router.get("/", getAllEstadoEquipo);

// GET por ID
router.get("/:id", getEstadoEquipoById);

// POST crear
router.post("/", createEstadoEquipo);

// PUT actualizar
router.put("/:id", updateEstadoEquipo);

// DELETE eliminar
router.delete("/:id", deleteEstadoEquipo);

export default router;
