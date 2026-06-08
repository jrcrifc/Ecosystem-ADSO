// ============================================================
// 🔬 CONTROLADOR DE EQUIPOS (EquiposController)
// Maneja las peticiones HTTP relacionadas con la gestión física
// de equipos (registro, edición, carga de fotos vía Cloudinary y borrado).
// ============================================================

// Importa el servicio de equipos para la lógica de negocio
import EquiposService from '../service/EquiposService.js';

// Controlador para obtener todos los equipos activos en la base de datos
export const getAllEquipos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todos los equipos
    const equipos = await EquiposService.getAll();
    // Responde con estado 200 y la lista de equipos
    res.status(200).json(equipos);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener equipos:', error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error al cargar equipos' });
  }
};

// Controlador para obtener un equipo de laboratorio por su ID
export const getEquipos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para buscar el equipo por su ID
    const equipo = await EquiposService.getById(req.params.id);
    // Responde con estado 200 y los datos del equipo
    res.status(200).json(equipo);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener equipo:', error);
    // Responde con estado 404 y el mensaje de error
    res.status(404).json({ message: error.message || 'Equipo no encontrado' });
  }
};

// Controlador para registrar un nuevo equipo en el inventario
export const createEquipos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la creación del equipo
    console.log('----- CREAR EQUIPO -----');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.file:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path
    } : 'NO LLEGÓ ARCHIVO');
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };

    // Verifica si se subió un archivo de imagen (URL de Cloudinary)
    if (req.file && req.file.path) {
      // Asigna la URL de la foto al campo foto_equipo
      data.foto_equipo = req.file.path;
      console.log('Foto asignada a BD (Cloudinary):', req.file.path);
    } else {
      // Si no hay foto, asigna null
      data.foto_equipo = null;
      console.log('Sin foto → null en BD');
    }

    // Asigna estado por defecto 1 si no viene en los datos
    data.estado = data.estado ?? 1;

    // Imprime los datos finales que se guardarán
    console.log('Datos FINALES a guardar en BD:', data);
    // Llama al servicio para crear el equipo con los datos procesados
    const equipo = await EquiposService.create(data);

    // Imprime confirmación de creación
    console.log('Equipo creado:', equipo);
    // Responde con estado 201 y los datos del equipo creado
    res.status(201).json({ mensaje: 'Equipo creado', equipo });
  } catch (error) {
    // Registra el error completo en consola para depuración
    console.error('ERROR EN CREATE:', error.stack || error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al crear' });
  }
};

// Controlador para modificar la información de un equipo existente
export const updateEquipos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la actualización
    console.log('----- ACTUALIZAR EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.file:', req.file ? req.file.originalname : 'sin foto nueva');
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };

    // Verifica si se subió una foto nueva en esta actualización
    if (req.file && req.file.path) {
      // Asigna la nueva URL de la foto
      data.foto_equipo = req.file.path;
      console.log('Nueva foto asignada (Cloudinary):', req.file.path);
    } else {
      // Si no hay foto nueva, elimina la propiedad para mantener la foto anterior
      delete data.foto_equipo;
      console.log('Manteniendo foto anterior');
    }

    // Imprime los datos finales para la actualización
    console.log('Datos FINALES para update:', data);
    // Llama al servicio para actualizar el equipo con los nuevos datos
    const updated = await EquiposService.update(req.params.id, data);

    // Si no se encontró el equipo, responde con error 404
    if (!updated) return res.status(404).json({ message: 'Equipo no encontrado' });

    // Responde con estado 200 y confirmación de actualización
    res.status(200).json({ mensaje: 'Actualizado OK', id: req.params.id });
  } catch (error) {
    // Registra el error completo en consola para depuración
    console.error('ERROR EN UPDATE:', error.stack || error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

// Controlador para eliminar o desactivar lógicamente un equipo del sistema
export const deleteEquipos = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para eliminar el equipo por su ID
    await EquiposService.delete(req.params.id);
    // Responde con estado 200 y mensaje de éxito
    res.status(200).json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error eliminando:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message });
  }
};