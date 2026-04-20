import movimientoreactivoService from "../service/movimientoreactivosService.js";

export const getAllmovimientoreactivo = async (req, res) => {
    try {
        const movimientoreactivo = await movimientoreactivoService.getAll();
        res.status(200).json(movimientoreactivo); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getmovimientoreactivo = async (req, res) => {
    try {
        const movimientoreactivo = await movimientoreactivoService.getById(req.params.id);
        res.status(200).json(movimientoreactivo); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createmovimientoreactivo = async (req, res) => {
    try {
        const movimientoreactivo = await movimientoreactivoService.create(req.body);
        res.status(201).json({ message: "el movimiento del reactivo ha sido creada correctamente", movimientoreactivo }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatemovimientoreactivo = async (req, res) => {
    try {
        await movimientoreactivoService.update(req.params.id, req.body);
        res.status(200).json({ message: "el movimiento del reactivo ha sido actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletemovimientoreactivo = async (req, res) => {
    try {
        await movimientoreactivoService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
