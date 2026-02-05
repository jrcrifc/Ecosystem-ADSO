import EquiposService from '../services/EquiposService.js';

export const getAllEquipos = async (req, res) => {
    try {
        const equipos = await EquiposService.getAll()
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEquipos = async (req, res) => {
    try {
        const equipos = await EquiposService.getById(req.params.id);
        res.status(200).json(equipos);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createEquipos = async (req, res) => {
    try {
        const equipos  = await EquiposService.create(req.body)
        res.status(201).json({mensage: 'Equipo Creado', equipos})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updateEquipos = async (req, res) => {
    try {
        await EquiposService.update(req.params.id, req.body)
        res.status(200).json({ mensage: 'Equipo Actualizado' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }   
}

export const deleteEquipos = async (req, res) => {
    try {
        await EquiposService.delete(req.params.id)
        res.status(200).json({ mensage: 'Equipo Eliminado' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
