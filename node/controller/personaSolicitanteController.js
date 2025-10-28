import personaSolicitanteService from "../service/personaSolicitanteService.js";

export const getAllPersonaSolicitante = async (req, res) => {
    try {
        const persona = await personaSolicitanteService.getAll();
        res.status(200).json(persona); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getPersonaSolicitante = async (req, res) => {
    try {
        const persona = await personaSolicitanteService.getById(req.params.id);
        res.status(200).json(persona); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createPersonaSolicitante = async (req, res) => {
    try {
        const persona = await personaSolicitanteService.create(req.body);
        res.status(201).json({ message: "Persona solicitante creada", persona }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatePersonaSolicitante = async (req, res) => {
    try {
        await personaSolicitanteService.update(req.params.id, req.body);
        res.status(200).json({ message: "Persona solicitante actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletePersonaSolicitante = async (req, res) => {
    try {
        await personaSolicitanteService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
