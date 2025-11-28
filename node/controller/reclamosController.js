import ResponsableService from "../services/ResponsableService.js";

export const getAllResponsables = async (req, res) => {
  try {
    const responsables = await ResponsableService.getAll();
    res.json(responsables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResponsables = async (req, res) => {
  try {
    const responsable = await ResponsableService.getById(req.params.id);
    res.json(responsable);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createResponsables = async (req, res) => {
  try {
    const nuevo = await ResponsableService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResponsables = async (req, res) => {
  try {
    await ResponsableService.update(req.params.id, req.body);
    res.json({ message: "Responsable actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResponsables = async (req, res) => {
  try {
    await ResponsableService.delete(req.params.id);
    res.json({ message: "Responsable eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
