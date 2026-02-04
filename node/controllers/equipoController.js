import Equipo from '../models/Equipo.js';

// ================== GET ==================
export const getEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================== POST ==================
export const createEquipo = async (req, res) => {
  try {
    console.log(" Datos recibidos:", req.body);

    const nuevoEquipo = await Equipo.create(req.body);

    console.log(" Equipo guardado:", nuevoEquipo);
    res.status(201).json(nuevoEquipo);

  } catch (error) {
    console.error(" Error al guardar equipo:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ================== PUT ==================
export const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    await equipo.update(req.body);
    res.json(equipo);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================== DELETE ==================
export const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    await equipo.destroy();
    res.json({ message: 'Equipo eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
