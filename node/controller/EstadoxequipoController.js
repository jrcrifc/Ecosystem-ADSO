// ============================================================
// 🔬 CONTROLADOR DE HISTORIAL DE ESTADOS DE EQUIPOS (EstadoxequipoController)
// Expone las acciones para consultar y registrar el historial temporal
// de cambios de estado de cada equipo del laboratorio.
// ============================================================

// Importa el servicio de historial de estados de equipos
import estadoxequipoService from '../service/estadoxequipoService.js';

// Controlador para listar todo el historial de cambios de estados de equipos
export const getAllEstadoxequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todos los registros del historial
    const estadoxequipo = await estadoxequipoService.getAll();
    // Responde con estado 200 y la lista de registros
    res.status(200).json(estadoxequipo);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener estadoxequipo:', error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error al cargar estadoxequipo' });
  }
};

// Controlador para obtener un registro del historial de estado por su ID
export const getEstadoxequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para buscar el registro por su ID
    const equipo = await estadoxequipoService.getById(req.params.id);
    // Verifica si el registro existe
    if (!equipo) {
      // Responde con error 404 si no se encuentra
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    // Responde con estado 200 y los datos del registro
    res.status(200).json(equipo);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener estadoxequipo:', error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error interno' });
  }
};

// Controlador para registrar una nueva transición de estado para un equipo
export const createEstadoxequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la creación
    console.log('----- CREAR COMPUESTA ESTADO DEL EQUIPO -----');
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };
    // Asigna estado por defecto 1 si no viene en los datos
    data.estado = data.estado ?? 1;

    // Imprime los datos a guardar
    console.log('Datos a guardar:', data);
    // Llama al servicio para crear el registro de transición
    const nuevoEquipo = await estadoxequipoService.create(data);
    // Imprime confirmación de creación
    console.log('Creado:', nuevoEquipo);

    // Responde con estado 201 y los datos del registro creado
    res.status(201).json({ 
      mensaje: 'Estado del equipo creado correctamente', 
      data: nuevoEquipo 
    });
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('ERROR AL CREAR:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al crear estado del equipo' });
  }
};

// Controlador para actualizar un registro del historial de cambios de estado
export const updateEstadoxequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la actualización
    console.log('----- ACTUALIZAR COMPUESTA ESTADO DEL EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };
    // Imprime los datos para actualizar
    console.log('Datos para actualizar:', data);

    // Llama al servicio para actualizar el registro con los nuevos datos
    const actualizado = await estadoxequipoService.update(req.params.id, data);

    // Verifica si el registro fue encontrado y actualizado
    if (!actualizado) {
      // Responde con error 404 si no se encuentra
      return res.status(404).json({ message: 'Estado del equipo no encontrado' });
    }

    // Responde con estado 200 y confirmación de actualización
    res.status(200).json({ 
      mensaje: 'Estado del equipo actualizado correctamente', 
      id: req.params.id 
    });
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('ERROR AL ACTUALIZAR:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

// Controlador para eliminar un registro de transición de estado
export const deleteEstadoxequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para eliminar el registro por su ID
    const eliminado = await estadoxequipoService.delete(req.params.id);
    
    // Verifica si el registro fue encontrado y eliminado
    if (!eliminado) {
      // Responde con error 404 si no se encuentra
      return res.status(404).json({ message: 'Estado del equipo no encontrado' });
    }

    // Responde con estado 200 y mensaje de éxito
    res.status(200).json({ mensaje: 'Estado del equipo eliminado correctamente' });
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al eliminar:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};