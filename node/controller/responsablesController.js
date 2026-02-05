import responsableModel from "../models/responsableModel.js";

// GET ALL
export const getAllResponsables = async (req, res) => {
  try {
    const responsables = await responsableModel.findAll();
    res.status(200).json(responsables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getResponsables = async (req, res) => {
  try {
    const responsable = await responsableModel.findByPk(req.params.id);

    if (!responsable)
      return res.status(404).json({ message: "Responsable no encontrado" });

    res.status(200).json(responsable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const createResponsables = async (req, res) => {
  try {
    const responsable = await responsableModel.create(req.body);
    res
      .status(201)
      .json({ message: "Responsable creado", responsable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
export const updateResponsables = async (req, res) => {
  try {
    const responsable = await responsableModel.findByPk(req.params.id);

    if (!responsable)
      return res.status(404).json({ message: "Responsable no encontrado" });

    await responsable.update(req.body);

    res.status(200).json({
      message: "Responsable actualizado correctamente",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteResponsables = async (req, res) => {
  try {
    const responsable = await responsableModel.findByPk(req.params.id);

    if (!responsable)
      return res.status(404).json({ message: "Responsable no encontrado" });

    await responsable.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
