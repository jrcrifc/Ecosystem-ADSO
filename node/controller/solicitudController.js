import solicitudService from "../service/solicitudService.js";

export const getAllsolicitud = async (req, res) => {
    try {
        const solicitud = await solicitudService.getAll();
        res.status(200).json(solicitud); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getsolicitud = async (req, res) => {
    try {
        const solicitud = await solicitudService.getById(req.params.id);
        res.status(200).json(solicitud); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createsolicitud = async (req, res) => {
    try {
        const solicitud = await solicitudService.create(req.body);
        res.status(201).json({ message: "solicitud creada correctamente", solicitud }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatesolicitud = async (req, res) => {
    try {
        await solicitudService.update(req.params.id, req.body);
        res.status(200).json({ message: "solicitud actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletesolicitud = async (req, res) => {
    try {
        await solicitudService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
