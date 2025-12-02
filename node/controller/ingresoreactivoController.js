import ingresoreactivoService from "../service/ingresoreactivoService.js";

export const getAllingresoreactivo = async (req, res) => {
    try {
        const ingresos = await ingresoreactivoService.getAll();
        res.status(200).json(ingresos); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getingresoreactivo = async (req, res) => {
    try {
        const ingresos = await ingresoreactivoService.getById(req.params.id);
        res.status(200).json(ingresos); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createingresoreactivo = async (req, res) => {
    try {
        const ingresos = await ingresoreactivoService.create(req.body);
        res.status(201).json({ message: "Ingreso del reactivo creado correctamente", ingresos }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updateingresoreactivo = async (req, res) => {
    try {
        await ingresoreactivoService.update(req.params.id, req.body);
        res.status(200).json({ message: "Ingreso del reactivo actualizado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deleteingresoreactivo = async (req, res) => {
    try {
        await ingresoreactivoService.delete(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
