import reactivosService from "../service/reactivosService.js";

export const getAllreactivos = async (req, res) => {
    try {
        const reactivos = await reactivosService.getAll();
        res.status(200).json(reactivos); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getreactivos = async (req, res) => {
    try {
        const reactivos = await reactivosService.getById(req.params.id);
        res.status(200).json(reactivos); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createreactivos = async (req, res) => {
    try {
        const reactivos = await reactivosService.create(req.body);
        res.status(201).json({ message: "reactivo creado correctamente", reactivos }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatereactivos = async (req, res) => {
    try {
        await reactivosService.update(req.params.id, req.body);
        res.status(200).json({ message: "reactivo actualizado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletereactivos = async (req, res) => {
    try {
        await reactivosService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
