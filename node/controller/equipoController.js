import EquipoService from "../services/EquipoService.js";

export const getAllEquipos = async (req, res) => {
  try {
    const equipos = await EquipoService.getAll();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEquipo = async (req, res) => {
  try {
    const equipo = await EquipoService.getById(req.params.id);
    res.json(equipo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createEquipo = async (req, res) => {
  try {
    const nuevo = await EquipoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEquipo = async (req, res) => {
  try {
    await EquipoService.update(req.params.id, req.body);
    res.json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEquipo = async (req, res) => {
  try {
    await EquipoService.delete(req.params.id);
    res.json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
