import consumosreactivosService from "../service/consumosreactivosService.js";

export const getAllconsumosreactivos = async (req, res) => {
    try {
        const consumo = await consumosreactivosService.getAll();
        res.status(200).json(consumo); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getconsumosreactivos = async (req, res) => {
    try {
        const consumo = await consumosreactivosService.getById(req.params.id);
        res.status(200).json(consumo); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createconsumosreactivos = async (req, res) => {
    try {
        const consumo = await consumosreactivosService.create(req.body);
        res.status(201).json({ message: "Consumo del reactivo creado correctamente", consumo }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updateconsumosreactivos = async (req, res) => {
    try {
        await consumosreactivosService.update(req.params.id, req.body);
        res.status(200).json({ message: "Consumo del reactivo actualizado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deleteconsumosreactivos = async (req, res) => {
    try {
        await consumosreactivosService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
