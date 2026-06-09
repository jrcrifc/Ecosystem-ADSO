// Controlador para gestionar los instructores
import InstructorService from "../service/instructorService.js";

// Obtiene todos los instructores
export const getInstructores = async (req, res) => {
  try {
    const instructores = await InstructorService.getAll();
    res.json(instructores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInstructor = async (req, res) => {
  try {
    const instructor = await InstructorService.create(req.body);
    res.status(201).json(instructor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const instructor = await InstructorService.update(req.params.id, req.body);
    res.json(instructor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    await InstructorService.delete(req.params.id);
    res.json({ message: "Instructor eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
