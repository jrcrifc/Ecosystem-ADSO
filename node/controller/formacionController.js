import ProgramaModel from "../models/programaModel.js";
import FichaModel from "../models/fichaModel.js";

export const getProgramas = async (req, res) => {
  try {
    const programas = await ProgramaModel.findAll();
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFichas = async (req, res) => {
  try {
    const fichas = await FichaModel.findAll({
      include: [{ model: ProgramaModel, as: 'programa' }]
    });
    res.json(fichas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrograma = async (req, res) => {
  try {
    const programa = await ProgramaModel.create(req.body);
    res.status(201).json(programa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createFicha = async (req, res) => {
  try {
    const ficha = await FichaModel.create(req.body);
    res.status(201).json(ficha);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
