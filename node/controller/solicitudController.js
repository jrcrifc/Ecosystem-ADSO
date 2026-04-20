import solicitudService from '../service/solicitudService.js';

export const getAll = async (req, res) => {
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
};