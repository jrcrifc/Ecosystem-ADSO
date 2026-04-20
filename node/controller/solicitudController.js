import solicitudService from '../service/solicitudService.js';

export const getAll = async (req, res) => {
<<<<<<< HEAD
  try {
    const { id, rol } = req.user;
    const solicitudes = (rol === 'Aprendiz' || rol === 'Instructor' || rol === 'Pasante')
      ? await solicitudService.getByUsuario(id)
      : await solicitudService.getAll();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las solicitudes', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const solicitud = await solicitudService.getById(req.params.id);
    res.json(solicitud);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ PUNTO 4 — id_usuario del token + equipos del body
export const create = async (req, res) => {
  try {
    const { id } = req.user;
    const nuevaSolicitud = await solicitudService.create({
      ...req.body,
      id_usuario: id
    });
    res.status(201).json({ success: true, message: 'Solicitud creada correctamente', data: nuevaSolicitud });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al crear la solicitud', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const solicitud = await solicitudService.getById(req.params.id);
    const { id_solicitud, createdAt, updatedAt, ...datosActualizables } = req.body;
    await solicitud.update(datosActualizables);
    res.json({ success: true, message: 'Solicitud actualizada correctamente', data: solicitud });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await solicitudService.delete(req.params.id);
    res.json({ success: true, message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
=======
    try {
        const solicitudes = await solicitudService.getAll();
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const solicitud = await solicitudService.getById(req.params.id);
        res.json(solicitud);
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        // ← saca el id del usuario del token JWT
        const userId = req.user.id;
        const nuevaSolicitud = await solicitudService.create(req.body, userId);
        res.status(201).json({ success: true, message: 'Solicitud creada correctamente', data: nuevaSolicitud });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        await solicitudService.update(req.params.id, req.body);
        res.json({ success: true, message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ← nuevo endpoint solo para admin
export const cambiarEstado = async (req, res) => {
    try {
        const { id_estado_solicitud } = req.body;
        await solicitudService.cambiarEstado(req.params.id, id_estado_solicitud);
        res.json({ success: true, message: 'Estado cambiado correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await solicitudService.delete(req.params.id);
        res.json({ success: true, message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
>>>>>>> origin/main
};