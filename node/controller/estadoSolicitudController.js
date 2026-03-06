import estadoSolicitudService from "../service/EstadosolicitudService.js";

// 🔹 Obtener todos
export const getAllEstadoSolicitud = async (req, res) => {
    try {
        const registros = await estadoSolicitudService.findAll();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 Obtener uno
export const getEstadoSolicitud = async (req, res) => {
    try {
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 Crear
export const createEstadoSolicitud = async (req, res) => {
    try {
        await estadoSolicitudService.create(req.body);
        res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Actualizar
export const updateEstadoSolicitud = async (req, res) => {
    try {
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        await registro.update(req.body);
        res.json({ message: "Registro actualizado correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Eliminar
export const deleteEstadoSolicitud = async (req, res) => {
    try {
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        await registro.destroy();
        res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};