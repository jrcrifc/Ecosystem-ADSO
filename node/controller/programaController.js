// Controlador para gestionar las peticiones de programas de formación
import ProgramaService from "../service/programaService.js";

// Obtiene todos los programas
export const getProgramas = async (req, res) => {
  try {
    const programas = await ProgramaService.getAll();
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crea un nuevo programa
export const createPrograma = async (req, res) => {
  try {
    const programa = await ProgramaService.create(req.body);
    res.status(201).json(programa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualiza un programa existente
export const updatePrograma = async (req, res) => {
  try {
    const programa = await ProgramaService.update(req.params.id, req.body);
    res.json(programa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Elimina un programa (borrado lógico)
export const deletePrograma = async (req, res) => {
  try {
    await ProgramaService.delete(req.params.id);
    res.json({ message: "Programa eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Importa programas desde un archivo Excel
export const importarProgramasExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún archivo Excel" });
    }
    const result = await ProgramaService.importarExcel(req.file.buffer);
    res.json({ message: "Proceso de importación finalizado", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
