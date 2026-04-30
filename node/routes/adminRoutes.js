import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUsuarios, cambiarEstado, getAuditLogs } from "../controller/adminController.js";

const router = express.Router();

// Middleware: solo Administrador
const soloAdmin = (req, res, next) => {
  if (req.user.rol !== "Administrador") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};

router.get("/usuarios", authMiddleware, soloAdmin, getUsuarios);
router.patch("/usuarios/:id/estado", authMiddleware, soloAdmin, cambiarEstado);
router.get("/audit-logs", authMiddleware, soloAdmin, getAuditLogs);

export default router;