import express from "express";
import { getProgramas, getFichas, createPrograma, createFicha } from "../controller/formacionController.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/programas", getProgramas);
router.get("/fichas", getFichas);
router.post("/programas", checkAuth, createPrograma);
router.post("/fichas", checkAuth, createFicha);

export default router;
