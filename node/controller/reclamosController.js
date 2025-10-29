import reclamosService from "../service/reclamosService.js";

export const getAllReclamos = async (req, res) => {
  try {
    const reclamos = await reclamosService.getAll();
    res.status(200).json(reclamos); // 200 OK
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 Internal Server Error
  }
};

export const getReclamos = async (req, res) => {
  try {
    const reclamo = await reclamosService.getById(req.params.id);
    res.status(200).json(reclamo); // 200 OK
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 Not Found
  }
};

export const createReclamos = async (req, res) => {
  try {
    const reclamo = await reclamosService.create(req.body);
    res.status(201).json({ message: "Reclamo creado", reclamo }); // 201 Created
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};

export const updateReclamos = async (req, res) => {
  try {
    await reclamosService.update(req.params.id, req.body);
    res.status(200).json({ message: "Reclamo actualizado correctamente" }); // 200 OK
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};

export const deleteReclamos = async (req, res) => {
  try {
    await reclamosService.delete(req.params.id);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};
