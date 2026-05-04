import NotificacionService from "../service/notificacionService.js";

export const getMisNotificaciones = async (req, res) => {
  try {
    const id_usuario = req.params.id;
    const notificaciones = await NotificacionService.getMisNotificaciones(id_usuario);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const marcarLeida = async (req, res) => {
  try {
    await NotificacionService.marcarLeida(req.params.id);
    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const marcarTodasLeidas = async (req, res) => {
  try {
    await NotificacionService.marcarTodasLeidas(req.params.id_usuario);
    res.json({ message: 'Todas marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};