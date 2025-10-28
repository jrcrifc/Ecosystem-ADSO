import solicitud_prestamoService from "../service/solicitud_prestamoService.js";

export const getAllSolicitudPrestamo = async (req, res) => {
    try {
        const solicitud = await solicitud_prestamoService.getAll();
        res.status(200).json(solicitud); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getSolicitudPrestamo = async (req, res) => {
    try {
        const solicitud = await solicitud_prestamoService.getById(req.params.id);
        res.status(200).json(solicitud); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createSolicitudPrestamo = async (req, res) => {
    try {
        const solicitud = await solicitud_prestamoService.create(req.body);
        res.status(201).json({ message: "Solicitud creada", solicitud }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updateSolicitudPrestamo = async (req, res) => {
    try {
        await solicitud_prestamoService.update(req.params.id, req.body);
        res.status(200).json({ message: "Solicitud actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deleteSolicitudPrestamo = async (req, res) => {
    try {
        await solicitud_prestamoService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
