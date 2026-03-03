import estadoEquipoModel from '../models/estadoEquipoModel.js'

export const getAllEstadosEquipo = async (req, res) => {
    try {
        const estados = await estadoEquipoModel.findAll()
        res.json(estados)
    } catch (error) {
        console.error('Error en getAllEstadosEquipo:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const getEstadoEquipo = async (req, res) => {
    try {
        const { id } = req.params
        const estado = await estadoEquipoModel.findByPk(id)
        if (!estado) return res.status(404).json({ msg: 'Estado no encontrado' })
        res.json(estado)
    } catch (error) {
        console.error('Error en getEstadoEquipo:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const createEstadoEquipo = async (req, res) => {
    try {
        const { estado, estados } = req.body
        if (!estado) return res.status(400).json({ msg: 'El campo estado es requerido' })
        
        const nuevoEstado = await estadoEquipoModel.create({ estado, estados: estados || 1 })
        res.status(201).json(nuevoEstado)
    } catch (error) {
        console.error('Error en createEstadoEquipo:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const updateEstadoEquipo = async (req, res) => {
    try {
        const { id } = req.params
        const { estado, estados } = req.body
        
        const estadoExistente = await estadoEquipoModel.findByPk(id)
        if (!estadoExistente) return res.status(404).json({ msg: 'Estado no encontrado' })
        
        await estadoExistente.update({ estado, estados })
        res.json(estadoExistente)
    } catch (error) {
        console.error('Error en updateEstadoEquipo:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const deleteEstadoEquipo = async (req, res) => {
    try {
        const { id } = req.params
        const estado = await estadoEquipoModel.findByPk(id)
        if (!estado) return res.status(404).json({ msg: 'Estado no encontrado' })
        
        await estado.destroy()
        res.json({ msg: 'Estado eliminado correctamente' })
    } catch (error) {
        console.error('Error en deleteEstadoEquipo:', error)
        res.status(500).json({ msg: error.message })
    }
}
