import estadosolicitudService from "../service/estadosolicitudService.js";

export const getAllestadosolicitud = async (req, res) => {
    try {
        const estadosolicitud = await estadosolicitudService.getAll();
        res.status(200).json(estadosolicitud); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getestadosolicitud = async (req, res) => {
    try {
        const estadosolicitud = await estadosolicitudService.getById(req.params.id);
        res.status(200).json(estadosolicitud); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createestadosolicitud = async (req, res) => {
    try {
        const estadosolicitud = await estadosolicitudService.create(req.body);
        res.status(201).json({ message: "el estado de la solicitud ha sido creada correctamente", estadosolicitud }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updateestadosolicitud = async (req, res) => {
    try {
        await estadosolicitudService.update(req.params.id, req.body);
        res.status(200).json({ message: "el estado de la solicitud ha sido actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deleteestadosolicitud = async (req, res) => {
    try {
        await estadosolicitudService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
