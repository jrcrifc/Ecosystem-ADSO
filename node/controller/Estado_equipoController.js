// ============================================================
// ⚙️ CONTROLADOR DE ESTADOS DE EQUIPOS (Estado_equipoController)
// Expone las acciones CRUD de la tabla maestra de estados de equipos.
// ============================================================

// Importa todas las funciones del servicio de estados de equipos
import * as estadoequipoService from '../service/Estado_equipoService.js';

// Controlador para obtener la lista completa de estados válidos de equipos
export const getAllEstadoequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para obtener todos los estados
    const estadoequipo = await estadoequipoService.getAll();
    // Responde con estado 200 y la lista de estados
    res.status(200).json(estadoequipo);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener estadoequipo:', error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error al cargar estadoequipo' });
  }
};

// Controlador para obtener un estado de equipo por su ID
export const getEstadoequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para buscar el estado por su ID
    const equipo = await estadoequipoService.getById(req.params.id);

    // Verifica si el estado existe
    if (!equipo) {
      // Responde con error 404 si no se encuentra
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Responde con estado 200 y los datos del estado
    res.status(200).json(equipo);
  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al obtener estadoequipo:', error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: 'Error interno' });
  }
};

// Controlador para registrar un nuevo estado disponible para equipos
export const createEstadoequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la creación
    console.log('----- CREAR ESTADO DEL EQUIPO -----');
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };
    // Llama al servicio para crear el estado con los datos proporcionados
    const nuevoEquipo = await estadoequipoService.create(data);

    // Imprime confirmación de creación
    console.log('Creado:', nuevoEquipo);

    // Responde con estado 201 y los datos del estado creado
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

// Controlador para modificar un estado de equipo por su ID
export const updateEstadoequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Imprime información de depuración sobre la actualización
    console.log('----- ACTUALIZAR ESTADO DEL EQUIPO -----');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);

    // Copia los datos del cuerpo de la petición
    const data = { ...req.body };
    // Llama al servicio para actualizar el estado con los nuevos datos
    const actualizado = await estadoequipoService.update(req.params.id, data);

    // Responde con estado 200 y los datos actualizados
    res.status(200).json({
      mensaje: 'Estado del equipo actualizado correctamente',
      data: actualizado
    });

  } catch (error) {
    // Registra el error en consola para depuración
    console.error('ERROR AL ACTUALIZAR:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

// Controlador para eliminar un estado de equipo de la base de datos
export const deleteEstadoequipo = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Llama al servicio para eliminar el estado por su ID
    await estadoequipoService.remove(req.params.id);

    // Responde con estado 200 y mensaje de éxito
    res.status(200).json({
      mensaje: 'Estado del equipo eliminado correctamente'
    });

  } catch (error) {
    // Registra el error en consola para depuración
    console.error('Error al eliminar:', error);
    // Responde con estado 500 y el mensaje de error
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};