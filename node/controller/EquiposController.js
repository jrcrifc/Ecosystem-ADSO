import EquiposService from '../service/EquiposService.js';

export const getAllEquipos = async (req, res) => {
  try {
    const equipos = await EquiposService.getAll();
    res.status(200).json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ message: 'Error al cargar equipos' });
  }
};

export const getEquipos = async (req, res) => {
  try {
    const equipo = await EquiposService.getById(req.params.id);
    res.status(200).json(equipo);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(404).json({ message: error.message || 'Equipo no encontrado' });
  }
};

export const createEquipos = async (req, res) => {
  try {
    console.log('----- CREAR EQUIPO -----');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.file:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path
    } : 'NO LLEGÓ ARCHIVO');
    console.log('req.body:', req.body);

    const data = { ...req.body };

    // Foto SOLO si multer la procesó
    if (req.file && req.file.filename) {
      data.foto_equipo = req.file.filename;
      console.log('Foto asignada a BD:', req.file.filename);
    } else {
      data.foto_equipo = null;
      console.log('Sin foto → null en BD');
    }

    data.estado = data.estado ?? 1;

    console.log('Datos FINALES a guardar en BD:', data);

    const equipo = await EquiposService.create(data);
    console.log('Equipo creado:', equipo);

    res.status(201).json({ mensaje: 'Equipo creado', equipo });
  } catch (error) {
    console.error('ERROR EN CREATE:', error.stack || error);
    res.status(500).json({ message: error.message || 'Error al crear' });
  }
};

export const updateEquipos = async (req, res) => {
  try {
    console.log('----- ACTUALIZAR EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.file:', req.file ? req.file.originalname : 'sin foto nueva');
    console.log('req.body:', req.body);

    const data = { ...req.body };

    if (req.file && req.file.filename) {
      data.foto_equipo = req.file.filename;
      console.log('Nueva foto asignada:', req.file.filename);
    } else {
      delete data.foto_equipo;
      console.log('Manteniendo foto anterior');
    }

    console.log('Datos FINALES para update:', data);

    const updated = await EquiposService.update(req.params.id, data);

    if (!updated) return res.status(404).json({ message: 'Equipo no encontrado' });

    res.status(200).json({ mensaje: 'Actualizado OK', id: req.params.id });
  } catch (error) {
    console.error('ERROR EN UPDATE:', error.stack || error);
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

export const deleteEquipos = async (req, res) => {
  try {
    await EquiposService.delete(req.params.id);
    res.status(200).json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    console.error('Error eliminando:', error);
    res.status(500).json({ message: error.message });
  }
};