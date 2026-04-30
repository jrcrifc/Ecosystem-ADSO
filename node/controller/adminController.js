import UserModel from "../models/userModel.js";
import auditService from "../service/auditService.js";

// Ver todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll({
      attributes: { exclude: ["password", "token"] }
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Aprobar o rechazar usuario
export const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    if (!["aprobado", "rechazado"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const usuario = await UserModel.findByPk(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    usuario.estado = estado;
    await usuario.save();

    res.json({ message: `Usuario ${estado} correctamente`, usuario });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

// Obtener bitácora de auditoría
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await auditService.getAllLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener la bitácora" });
  }
};