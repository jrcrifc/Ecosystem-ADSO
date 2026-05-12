import cuentadanteService from "../service/cuentadanteService.js";

// cuentadanteController.js
export const getAllcuentadante = async (req, res) => {
    try {
        const registro = await cuentadanteService.getAllcuentadante(); // ← fix
        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getcuentadante = async (req, res) => {
    try {
        const registro = await cuentadanteService.getcuentadante(req.params.id); // ← fix
        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createcuentadante = async (req, res) => {
    try {
        await cuentadanteService.createcuentadante(req.body); // ← fix
        res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatecuentadante = async (req, res) => {
    try {
        await cuentadanteService.updatecuentadante(req.params.id, req.body); // ← fix
        res.json({ message: "Registro actualizado correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const toggleEstadoCuentadante = async (req, res) => {
    try {
        const nuevoEstado = await cuentadanteService.toggleEstadoCuentadante(req.params.id);
        res.json({ message: `Cuentadante ${nuevoEstado === 'activo' ? 'activado' : 'inactivado'} correctamente`, estado: nuevoEstado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};