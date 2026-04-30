import reactivosService from "../service/reactivosService.js";
import auditService from "../service/auditService.js";

export const getAllreactivos = async (req, res) => {
    try {
        const reactivos = await reactivosService.getAll();
        res.status(200).json(reactivos); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
};

export const getreactivos = async (req, res) => {
    try {
        const reactivos = await reactivosService.getById(req.params.id);
        res.status(200).json(reactivos); // 200 OK
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 Not Found
    }
};

export const createreactivos = async (req, res) => {
    try {
        console.log("📥 Body recibido:", JSON.stringify(req.body, null, 2)); // ← aquí
        const reactivos = await reactivosService.create(req.body);
        
        await auditService.log({
            id_usuario: req.user.id_usuario,
            accion: 'CREAR',
            modulo: 'REACTIVOS',
            detalle: `Se creó el reactivo: ${req.body.nom_reactivo}`,
            ip: req.ip
        });

        res.status(201).json({ message: "reactivo creado correctamente", reactivos });
    } catch (error) {
        console.error("❌ Error completo:", JSON.stringify(error, null, 2));
        console.error("❌ Mensaje:", error.message);
        res.status(400).json({ message: error.message });
    }
};

export const updatereactivos = async (req, res) => {
    try {
        await reactivosService.update(req.params.id, req.body);

        await auditService.log({
            id_usuario: req.user.id_usuario,
            accion: 'ACTUALIZAR',
            modulo: 'REACTIVOS',
            detalle: `Se actualizó el reactivo con ID: ${req.params.id}`,
            ip: req.ip
        });

        res.status(200).json({ message: "reactivo actualizado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletereactivos = async (req, res) => {
    try {
        await reactivosService.delete(req.params.id);

        await auditService.log({
            id_usuario: req.user.id_usuario,
            accion: 'ELIMINAR',
            modulo: 'REACTIVOS',
            detalle: `Se eliminó el reactivo con ID: ${req.params.id}`,
            ip: req.ip
        });

       res.status(200).json({ message: "reactivo eliminado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
