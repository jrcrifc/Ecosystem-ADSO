// Controlador para gestionar los aprendices
import AprendizService from "../service/aprendizService.js";

// Obtiene todos los aprendices
export const getAprendices = async (req, res) => {
  try {
    const aprendices = await AprendizService.getAll();
    res.json(aprendices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAprendiz = async (req, res) => {
  try {
    const aprendiz = await AprendizService.create(req.body);
    res.status(201).json(aprendiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAprendiz = async (req, res) => {
  try {
    const aprendiz = await AprendizService.update(req.params.id, req.body);
    res.json(aprendiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAprendiz = async (req, res) => {
  try {
    await AprendizService.delete(req.params.id);
    res.json({ message: "Aprendiz eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
