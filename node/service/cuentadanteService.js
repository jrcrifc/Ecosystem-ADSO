// ============================================================
// 👤 SERVICIO DE CUENTADANTES (cuentadanteService)
// Este servicio administra los cuentadantes (personas responsables
// a cargo de equipos) dentro del laboratorio. Permite el registro,
// consulta, actualización y cambio de estado de los cuentadantes.
// ============================================================

// Importa el modelo de cuentadante para acceder a la tabla de cuentadantes en la base de datos
import cuentadante from '../models/cuentadanteModel.js';

// Define la clase de servicio para cuentadantes con métodos CRUD y cambio de estado
class cuentadanteService {

  // Obtiene todos los cuentadantes registrados en la base de datos
  async getAllcuentadante() {
    return await cuentadante.findAll();
  }

  // Obtiene un cuentadante por su ID
  async getcuentadante(id) {
    // Busca el cuentadante por su clave primaria
    const data = await cuentadante.findByPk(id);
    // Si no existe, lanza un error
    if (!data) throw new Error("Registro no encontrado");
    // Retorna el cuentadante encontrado
    return data;
  }

  // Crea un nuevo cuentadante con los datos proporcionados
  async createcuentadante(data) {
    return await cuentadante.create(data);
  }

  // Actualiza los datos de un cuentadante existente
  async updatecuentadante(id, data) {
    // Ejecuta la actualización en la base de datos filtrando por ID
    const result = await cuentadante.update(
      data,
      { where: { id_cuentadante: id } }
    );
    // Si no se actualizó ningún registro, lanza un error
    if (result[0] === 0) throw new Error("Registro no encontrado o sin cambios");
    // Retorna true indicando que la actualización fue exitosa
    return true;
  }

  // Alterna el estado de un cuentadante entre 'activo' e 'inactivo'
  async toggleEstadoCuentadante(id) {
    // Busca el cuentadante por su ID
    const registro = await cuentadante.findByPk(id);
    // Si no existe, lanza un error
    if (!registro) throw new Error("Registro no encontrado");
    // Determina el nuevo estado invirtiendo el actual
    const nuevoEstado = registro.estado === 'activo' ? 'inactivo' : 'activo';
    // Actualiza el estado en la base de datos
    await cuentadante.update(
      { estado: nuevoEstado },
      { where: { id_cuentadante: id } }
    );
    // Retorna el nuevo estado asignado
    return nuevoEstado;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new cuentadanteService();
