import SolicitudAccesoService from "../service/solicitudAccesoService.js";

export const enviarFormulario = async (req, res) => {
  try {
    const { id_usuario, ficha, grupo, motivo } = req.body;
    if (!id_usuario || !ficha || !grupo || !motivo)
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    const result = await SolicitudAccesoService.enviarFormulario({ id_usuario, ficha, grupo, motivo });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMiSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudAccesoService.getMiSolicitud(req.params.id_usuario);
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodasPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudAccesoService.getTodasPendientes();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodas = async (req, res) => {
  try {
    const solicitudes = await SolicitudAccesoService.getTodas();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const aprobarSolicitud = async (req, res) => {
  try {
    const result = await SolicitudAccesoService.aprobar(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const result = await SolicitudAccesoService.rechazar(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};