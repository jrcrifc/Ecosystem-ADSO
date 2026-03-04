import express from "express";
import db from "../database/db.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// ======================================
// 🔥 CAMBIAR ESTADO
// PUT /api/reactivos/estado/:id
// ======================================
router.put("/estado/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await db.query(
      "UPDATE reactivos SET estado = ? WHERE id_reactivo = ?",
      [estado, id]
    );

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ message: "Error al cambiar estado" });
  }
});

// ======================================
// 🔥 OBTENER TODOS LOS REACTIVOS
// GET /api/reactivos
// ======================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [reactivos] = await db.query(
      "SELECT * FROM reactivos ORDER BY id_reactivo DESC"
    );
    res.json(reactivos);
  } catch (error) {
    console.error("Error al obtener reactivos:", error);
    res.status(500).json({ message: "Error al obtener reactivos" });
  }
});

// ======================================
// 🔥 OBTENER REACTIVO POR ID
// GET /api/reactivos/:id
// ======================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [reactivo] = await db.query(
      "SELECT * FROM reactivos WHERE id_reactivo = ?",
      [id]
    );

    if (reactivo.length === 0) {
      return res.status(404).json({ message: "Reactivo no encontrado" });
    }

    res.json(reactivo[0]);
  } catch (error) {
    console.error("Error al obtener reactivo:", error);
    res.status(500).json({ message: "Error al obtener reactivo" });
  }
});

// ======================================
// 🔥 CREAR REACTIVO
// POST /api/reactivos
// ======================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      presentacion_reactivo,
      cantidad_presentacion,
      nom_reactivo,
      nom_reactivo_ingles,
      formula_reactivo,
      color_almacenamiento,
      color_stand,
      stand,
      columna,
      fila,
      clasificacion_reactivo,
      existencia_reactivo,
      estado,
    } = req.body;

    await db.query(
      `INSERT INTO reactivos 
      (presentacion_reactivo, cantidad_presentacion, nom_reactivo, nom_reactivo_ingles,
       formula_reactivo, color_almacenamiento, color_stand, stand, columna, fila,
       clasificacion_reactivo, existencia_reactivo, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        presentacion_reactivo,
        cantidad_presentacion,
        nom_reactivo,
        nom_reactivo_ingles,
        formula_reactivo,
        color_almacenamiento,
        color_stand,
        stand,
        columna,
        fila,
        clasificacion_reactivo,
        existencia_reactivo,
        estado,
      ]
    );

    res.status(201).json({ message: "Reactivo creado correctamente" });
  } catch (error) {
    console.error("Error al crear reactivo:", error);
    res.status(500).json({ message: "Error al crear reactivo" });
  }
});

// ======================================
// 🔥 ACTUALIZAR REACTIVO
// PUT /api/reactivos/:id
// ======================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      presentacion_reactivo,
      cantidad_presentacion,
      nom_reactivo,
      nom_reactivo_ingles,
      formula_reactivo,
      color_almacenamiento,
      color_stand,
      stand,
      columna,
      fila,
      clasificacion_reactivo,
      existencia_reactivo,
      estado,
    } = req.body;

    await db.query(
      `UPDATE reactivos SET
       presentacion_reactivo = ?,
       cantidad_presentacion = ?,
       nom_reactivo = ?,
       nom_reactivo_ingles = ?,
       formula_reactivo = ?,
       color_almacenamiento = ?,
       color_stand = ?,
       stand = ?,
       columna = ?,
       fila = ?,
       clasificacion_reactivo = ?,
       existencia_reactivo = ?,
       estado = ?
       WHERE id_reactivo = ?`,
      [
        presentacion_reactivo,
        cantidad_presentacion,
        nom_reactivo,
        nom_reactivo_ingles,
        formula_reactivo,
        color_almacenamiento,
        color_stand,
        stand,
        columna,
        fila,
        clasificacion_reactivo,
        existencia_reactivo,
        estado,
        id,
      ]
    );

    res.json({ message: "Reactivo actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar reactivo:", error);
    res.status(500).json({ message: "Error al actualizar reactivo" });
  }
});

// ======================================
// 🔥 ELIMINAR REACTIVO
// DELETE /api/reactivos/:id
// ======================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM reactivos WHERE id_reactivo = ?",
      [id]
    );

    res.json({ message: "Reactivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar reactivo:", error);
    res.status(500).json({ message: "Error al eliminar reactivo" });
  }
});

export default router;