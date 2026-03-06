import estadoxequipoService from '../service/EstadoxequipoService.js';

export const getAllEstadoxequipo = async (req, res) => {
  try {
    const estadoxequipo = await estadoxequipoService.getAll();
    res.status(200).json(estadoxequipo);
  } catch (error) {
    console.error('Error al obtener estadoxequipo:', error);
    res.status(500).json({ message: 'Error al cargar estadoxequipo' });
  }
};

export const getEstadoxequipo = async (req, res) => {
  try {
    const equipo = await estadoxequipoService.getById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    res.status(200).json(equipo);
  } catch (error) {
    console.error('Error al obtener estadoxequipo:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

export const createEstadoxequipo = async (req, res) => {
  try {
    console.log('----- CREAR COMPUESTA ESTADO DEL EQUIPO -----');
    console.log('req.body:', req.body);

    const data = { ...req.body };

    // Valor por defecto si no viene estado
    data.estado = data.estado ?? 1;

    console.log('Datos a guardar:', data);

    const nuevoEquipo = await estadoxequipoService.create(data);
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

export const updateEstadoxequipo = async (req, res) => {
  try {
    console.log('----- ACTUALIZAR COMPUESTA ESTADO DEL EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);

    const data = { ...req.body };


    console.log('Datos para actualizar:', data);

    const actualizado = await estadoxequipoService.update(req.params.id, data);

    if (!actualizado) {
      return res.status(404).json({ message: 'Estado del equipo no encontrado' });
    }

    res.status(200).json({ 
      mensaje: 'Estado del equipo actualizado correctamente', 
      id: req.params.id 
    });
  } catch (error) {
    console.error('ERROR AL ACTUALIZAR:', error);
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

export const deleteEstadoxequipo = async (req, res) => {
  try {
    const eliminado = await estadoxequipoService.delete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ message: 'Estado del equipo no encontrado' });
    }

    res.status(200).json({ mensaje: 'Estado del equipo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};