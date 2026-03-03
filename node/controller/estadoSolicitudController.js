import estadoSolicitudModel from '../models/estadoSolicitudModel.js'

export const getAllEstadosSolicitud = async (req, res) => {
    try {
        const estados = await estadoSolicitudModel.findAll({ attributes: ['id_estado_solicitud','estado'] })
        res.json(estados)
    } catch (error) {
        console.error('Error en getAllEstadosSolicitud:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const getEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params
        const estado = await estadoSolicitudModel.findByPk(id, { attributes: ['id_estado_solicitud','estado'] })
        if (!estado) return res.status(404).json({ msg: 'Estado no encontrado' })
        res.json(estado)
    } catch (error) {
        console.error('Error en getEstadoSolicitud:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const createEstadoSolicitud = async (req, res) => {
    try {
        const { estado, estados } = req.body
        if (!estado) return res.status(400).json({ msg: 'El campo estado es requerido' })
        
        const nuevoEstado = await estadoSolicitudModel.create({ estado, estados: estados || 1 })
        res.status(201).json(nuevoEstado)
    } catch (error) {
        console.error('Error en createEstadoSolicitud:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const updateEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params
        const { estado, estados } = req.body
        
        const estadoExistente = await estadoSolicitudModel.findByPk(id)
        if (!estadoExistente) return res.status(404).json({ msg: 'Estado no encontrado' })
        
        await estadoExistente.update({ estado, estados })
        res.json(estadoExistente)
    } catch (error) {
        console.error('Error en updateEstadoSolicitud:', error)
        res.status(500).json({ msg: error.message })
    }
}

export const deleteEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params
        const estado = await estadoSolicitudModel.findByPk(id, { attributes: ['id_estado_solicitud','estado'] })
        if (!estado) return res.status(404).json({ msg: 'Estado no encontrado' })
        
        await estado.destroy()
        res.json({ msg: 'Estado eliminado correctamente' })
    } catch (error) {
        console.error('Error en deleteEstadoSolicitud:', error)
        res.status(500).json({ msg: error.message })
    }
}
