// controller/solicitudController.js
import solicitudService from '../service/solicitudService.js';  // ← ya está correcto

// GET /solicitudes - Obtener todas
export const getAll = async (req, res) => {
  try {
    const solicitudes = await solicitudService.getAll();  // ← método del service
    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las solicitudes',
      error: error.message 
    });
  }
};

// GET /solicitudes/:id - Obtener una
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await solicitudService.getById(id);  // ← método del service

    res.json(solicitud);
  } catch (error) {
    res.status(404).json({ 
      success: false,
      message: error.message || 'Solicitud no encontrada' 
    });
  }
};

// POST /solicitudes - Crear
export const create = async (req, res) => {
  try {
    const nuevaSolicitud = await solicitudService.create(req.body);  // ← método del service

    res.status(201).json({ 
      success: true,
      message: 'Solicitud creada correctamente',
      data: nuevaSolicitud 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error al crear la solicitud',
      error: error.message 
    });
  }
};

// PUT /solicitudes/:id - Actualizar
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tu service no tiene update, así que lo implementamos aquí o agregamos al service
    // Opción rápida: usar directamente el modelo (temporal)
    const solicitud = await solicitudService.getById(id);  // reutilizamos getById

    const { id_solicitud, createdAt, updatedAt, ...datosActualizables } = req.body;
    await solicitud.update(datosActualizables);

    res.json({ 
      success: true,
      message: 'Solicitud actualizada correctamente',
      data: solicitud 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al actualizar la solicitud'
    });
  }
};

// DELETE /solicitudes/:id - Eliminar
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await solicitudService.delete(id);  // ← método del service

    res.json({ 
      success: true,
      message: 'Solicitud eliminada correctamente' 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      message: error.message || 'Solicitud no encontrada' 
    });
  }
};