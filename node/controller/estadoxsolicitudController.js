import estadoxsolicitudService from "../service/estadoxsolicitudService.js";

export const getAllEstadoxsolicitud = async (req, res) => {
  try {
    const estados = await estadoxsolicitudService.getAll();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEstadoxsolicitud = async (req, res) => {
  try {
    const estado = await estadoxsolicitudService.getById(req.params.id);
    res.status(200).json(estado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createEstadoxsolicitud = async (req, res) => {
  try {
    const estado = await estadoxsolicitudService.create(req.body);
    res.status(201).json({ message: "Registro creado", estado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEstadoxsolicitud = async (req, res) => {
  try {
    await estadoxsolicitudService.update(req.params.id, req.body);
    res.status(200).json({ message: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEstadoxsolicitud = async (req, res) => {
  try {
    await estadoxsolicitudService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
