// ============================================================
// ⚙️ CONTROLADOR DE CONFIGURACIONES GLOBALES (configController)
// Expone endpoints HTTP para consultar y modificar configuraciones
// dinámicas del sistema (SMTP, flags de depuración, etc.).
// ============================================================

// Importa el modelo de configuración para consultar la tabla de configuraciones globales
import ConfigModel from "../models/configModel.js";

// Controlador para obtener la lista completa de claves y valores de configuración
export const getConfigs = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Obtiene todos los registros de configuración
    const configs = await ConfigModel.findAll();
    // Responde con la lista de configuraciones en formato JSON
    res.json(configs);
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para modificar una configuración específica por su clave única
export const updateConfig = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Extrae la clave y el valor del cuerpo de la petición
    const { clave, valor } = req.body;
    // Busca la configuración por su clave única
    const config = await ConfigModel.findOne({ where: { clave } });
    // Si no existe la configuración, responde con error 404
    if (!config) return res.status(404).json({ message: "Configuración no encontrada" });

    // Actualiza el valor de la configuración
    await config.update({ valor });
    // Responde con mensaje de éxito
    res.json({ message: "Configuración actualizada correctamente" });
  } catch (error) {
    // Si ocurre un error, responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};
