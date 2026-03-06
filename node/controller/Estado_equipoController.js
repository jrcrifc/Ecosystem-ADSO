import * as estadoequipoService from '../service/Estado_equipoService.js';

export const getAllEstadoequipo = async (req, res) => {
  try {
    const estadoequipo = await estadoequipoService.getAll();
    res.status(200).json(estadoequipo);
  } catch (error) {
    console.error('Error al obtener estadoequipo:', error);
    res.status(500).json({ message: 'Error al cargar estadoequipo' });
  }
};

export const getEstadoequipo = async (req, res) => {
  try {
    const equipo = await estadoequipoService.getById(req.params.id);

    if (!equipo) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    res.status(200).json(equipo);
  } catch (error) {
    console.error('Error al obtener estadoequipo:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

export const createEstadoequipo = async (req, res) => {
  try {
    console.log('----- CREAR ESTADO DEL EQUIPO -----');
    console.log('req.body:', req.body);

    const data = { ...req.body };

    const nuevoEquipo = await estadoequipoService.create(data);

    console.log('Creado:', nuevoEquipo);

    res.status(201).json({
      mensaje: 'Estado del equipo creado correctamente',
      data: nuevoEquipo
    });

  } catch (error) {
    console.error('ERROR AL CREAR:', error);
    res.status(500).json({ message: error.message || 'Error al crear estado del equipo' });
  }
};

export const updateEstadoequipo = async (req, res) => {
  try {
    console.log('----- ACTUALIZAR ESTADO DEL EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);

    const data = { ...req.body };

    const actualizado = await estadoequipoService.update(req.params.id, data);

    res.status(200).json({
      mensaje: 'Estado del equipo actualizado correctamente',
      data: actualizado
    });

  } catch (error) {
    console.error('ERROR AL ACTUALIZAR:', error);
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

export const deleteEstadoequipo = async (req, res) => {
  try {
    await estadoequipoService.remove(req.params.id);

    res.status(200).json({
      mensaje: 'Estado del equipo eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};