// Controlador para gestionar las fichas
import FichaService from "../service/fichaService.js";

// Obtiene todas las fichas
export const getFichas = async (req, res) => {
  try {
    const fichas = await FichaService.getAll();
    res.json(fichas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crea una nueva ficha
export const createFicha = async (req, res) => {
  try {
    const ficha = await FichaService.create(req.body);
    res.status(201).json(ficha);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualiza una ficha existente
export const updateFicha = async (req, res) => {
  try {
    const ficha = await FichaService.update(req.params.id, req.body);
    res.json(ficha);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Elimina una ficha (borrado lógico)
export const deleteFicha = async (req, res) => {
  try {
    await FichaService.delete(req.params.id);
    res.json({ message: "Ficha eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Importa fichas desde un archivo Excel
export const importarFichasExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún archivo Excel" });
    }
    const result = await FichaService.importarExcel(req.file.buffer);
    res.json({ message: "Proceso de importación finalizado", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
