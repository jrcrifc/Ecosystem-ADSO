import devolucionService from "../service/devolucionService.js";

export const getAlldevolucion = async (req, res) => {
    try {
        const devolucion = await devolucionService.getAll();
        res.status(200).json(devolucion); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getdevolucion = async (req, res) => {
    try {
        const devolucion = await devolucionServiceService.getById(req.params.id);
        res.status(200).json(devolucion); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createdevolucion = async (req, res) => {
    try {
        const devolucion = await devolucionServiceService.create(req.body);
        res.status(201).json({ message: "devolucion creada", devolucion }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatedevolucion = async (req, res) => {
    try {
        await devolucionService.update(req.params.id, req.body);
        res.status(200).json({ message: "devolucion actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletedevolucion = async (req, res) => {
    try {
        await devolucionService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
