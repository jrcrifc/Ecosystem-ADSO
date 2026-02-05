import responbableService from '../services/responsableService.js';

export const getAllResponsables = async (req, res) => {
    try {
        const responsables = await responbableService.getAll()
        res.status(200).json(responsables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

export const getResponsable = async (req, res) => {
    try {
        const responsable = await responbableService.getById(req.params.id);
        res.status(200).json(responsable);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
export const createResponsable = async (req, res) => {
    try {
        const responsable  = await responbableService.create(req.body)
        res.status(201).json({mensage: 'Responsable Creado', responsable})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updateResponsable = async (req, res) => {
    try {
        await responbableService.update(req.params.id, req.body)
        res.status(200).json({ mensage: 'Responsable Actualizado' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteResponsable = async (req, res) => {
    try {
        await responbableService.delete(req.params.id)  
        res.status(200).json({ mensage: 'Responsable Eliminado' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

    