import responsableService from "../service/responsablesService.js";

export const getAllResponsables = async (req, res) => {
  try {
    const responsables = await responsableService.getAll();
    res.status(200).json(responsables); // 200 OK
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 Internal Server Error
  }
};

export const getResponsables = async (req, res) => {
  try {
    const responsable = await responsableService.getById(req.params.id);
    res.status(200).json(responsable); // 200 OK
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 Not Found
  }
};

export const createResponsables = async (req, res) => {
  try {
    const responsable = await responsableService.create(req.body);
    res.status(201).json({ message: "Responsable creado", responsable }); // 201 Created
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};

export const updateResponsables = async (req, res) => {
  try {
    await responsableService.update(req.params.id, req.body);
    res.status(200).json({ message: "Responsable actualizado correctamente" }); // 200 OK
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};

export const deleteResponsables = async (req, res) => {
  try {
    await responsableService.delete(req.params.id);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 Bad Request
  }
};