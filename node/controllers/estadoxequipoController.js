import estadoService from "../services/estadoxequipoService.js";

class EstadoXEquipoController {
  async getAll(req, res) {
    try {
      const data = await estadoService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await estadoService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const { id_equipo, id_estado_equipo } = req.body;
      if (id_equipo == null || id_estado_equipo == null) {
        return res.status(400).json({ error: "Campos obligatorios" });
      }
      const data = await estadoService.create({ id_equipo, id_estado_equipo });
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const data = await estadoService.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const data = await estadoService.delete(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

export default new EstadoXEquipoController();
