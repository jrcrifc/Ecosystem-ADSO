import solicitudxequipoService from "../service/solicitudxequipoService.js";

export const getAllsolicitudxequipo = async (req, res) => {
    try {
        const solicitudxequipo = await solicitudxequipoService.getAll();
        res.status(200).json(solicitudxequipo); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getsolicitudxequipo = async (req, res) => {
    try {
        const solicitudxequipo = await solicitudxequipoService.getById(req.params.id);
        res.status(200).json(solicitudxequipo); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createsolicitudxequipo = async (req, res) => {
    try {
        const solicitudxequipo = await solicitudxequipoService.create(req.body);
        res.status(201).json({ message: "La solicitud x equipo creada correctamente", solicitudxequipo }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatesolicitudxequipo = async (req, res) => {
    try {
        await solicitudxequipoService.update(req.params.id, req.body);
        res.status(200).json({ message: "La solicitud x equipo actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletesolicitudxequipo = async (req, res) => {
    try {
        await solicitudxequipoService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
