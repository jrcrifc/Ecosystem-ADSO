import estadoEquipoModel from "../models/estadoEquipoModel.js";

class EstadoEquipoController {
  
  // Obtener todos
  async getAll(req, res) {
    try {
      const data = await estadoEquipoModel.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await estadoEquipoModel.findByPk(id);

      if (!data) return res.status(404).json({ error: "No encontrado" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear
  async create(req, res) {
    try {
      const data = await estadoEquipoModel.create(req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar
  async update(req, res) {
    try {
      const { id } = req.params;

      const record = await estadoEquipoModel.findByPk(id);
      if (!record) return res.status(404).json({ error: "No encontrado" });

      await record.update(req.body);

      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar
  async delete(req, res) {
    try {
      const { id } = req.params;

      const record = await estadoEquipoModel.findByPk(id);
      if (!record) return res.status(404).json({ error: "No encontrado" });

      await record.destroy();
      res.json({ message: "Eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new EstadoEquipoController();
