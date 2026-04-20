import salidasService from "../service/salidasService.js";

export const getAllsalidas = async (req, res) => {
    try {
        const salidas = await salidasService.getAll();
        res.status(200).json(salidas); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getsalidas = async (req, res) => {
    try {
        const salidas = await salidasService.getById(req.params.id);
        res.status(200).json(salidas); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createsalidas = async (req, res) => {
    try {
        const salidas = await salidasService.create(req.body);
        res.status(201).json({ message: "salida del reactivo ha sido creada correctamente", salidas }); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const updatesalidas = async (req, res) => {
    try {
        await salidasService.update(req.params.id, req.body);
        res.status(200).json({ message: "salida del reactivo ha sido actualizada correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletesalidas = async (req, res) => {
    try {
        await salidasService.delete(req.params.id);
        res.status(200).json({ message: "salida del reactivo ha sido eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const getLoteProximo = async (req, res) => {
    try {
        const { id_reactivo } = req.params;
        const loteProximo = await salidasService.getNextLoteToExpire(id_reactivo);
        res.status(200).json(loteProximo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createSmartSalida = async (req, res) => {
    try {
        const resultado = await salidasService.createSmartSalida(req.body);
        res.status(201).json({ 
            message: "Salida(s) del reactivo creadas correctamente", 
            data: resultado 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
