import persnaSolicitanteService from '../services/personaSolicitanteService.js';

export const getAllPersonaSolicitante = async (req, res) => {
    try {
        const personas = await persnaSolicitanteService.getAll()
        res.status(200).json(personas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPersonaSolicitante = async (req, res) => {
    try {
        const persona = await persnaSolicitanteService.getById(req.params.id)
        res.status(200).json(persona);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
export const createPersonaSolicitante = async (req, res) => {
    try {
        const persona  = await persnaSolicitanteService.create(req.body)
        res.status(201).json({mensage: 'Persona Solicitante Creada', persona})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }   
}

export const updatePersonaSolicitante = async (req, res) => {
    try {
        await persnaSolicitanteService.update(req.params.id, req.body)
        res.status(200).json({ mensage: 'Persona Solicitante Actualizada' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }   
}
export const deletePersonaSolicitante = async (req, res) => {
    try {
        await persnaSolicitanteService.delete(req.params.id)
        res.status(200).json({ mensage: 'Persona Solicitante Eliminada' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}