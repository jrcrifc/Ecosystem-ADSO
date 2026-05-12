import ConfigModel from "../models/configModel.js";

export const getConfigs = async (req, res) => {
  try {
    const configs = await ConfigModel.findAll();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { clave, valor } = req.body;
    const config = await ConfigModel.findOne({ where: { clave } });
    if (!config) return res.status(404).json({ message: "Configuración no encontrada" });

    await config.update({ valor });
    res.json({ message: "Configuración actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
