import inventarioreactivoService from "../service/inventarioreactivosService.js";

export const getAllinventarioreactivo = async (req, res) => {
    try {
        const inventarioreactivo = await inventarioreactivoService.getAll();
        res.status(200).json(inventarioreactivo); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getinventarioreactivo = async (req, res) => {
    try {
        const inventarioreactivo = await inventarioreactivoService.getById(req.params.id);
        res.status(200).json(inventarioreactivo); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createinventarioreactivo = async (req, res) => {
    try {
        const inventarioreactivo = await inventarioreactivoService.create(req.body);
        res.status(201).json({ message: "el inventario del reactivo ha sido creada correctamente", inventarioreactivo }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updateinventarioreactivo = async (req, res) => {
    try {
        await inventarioreactivoService.update(req.params.id, req.body);
        res.status(200).json({ message: "el inventario del reactivo ha sido actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deleteinventarioreactivo = async (req, res) => {
    try {
        await inventarioreactivoService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
