import reactivosService from "../service/reactivosService.js";
import { registrarLog } from "../service/logService.js";

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
        
        await registrarLog(req.user?.email || 'SISTEMA', 'CREAR', 'REACTIVOS', `Creado reactivo: ${req.body.nom_reactivo}`);
        
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

        await registrarLog(req.user?.email || 'SISTEMA', 'EDITAR', 'REACTIVOS', `Editado reactivo ID: ${req.params.id}`);

        res.status(200).json({ message: "reactivo actualizado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};

export const deletereactivos = async (req, res) => {
    try {
        await reactivosService.delete(req.params.id);

        await registrarLog(req.user?.email || 'SISTEMA', 'ELIMINAR', 'REACTIVOS', `Eliminado reactivo ID: ${req.params.id}`);

       res.status(200).json({ message: "reactivo eliminado correctamente" }); // 200 OK
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
};
