// ============================================================
// 🏢 SERVICIO DE PROVEEDORES (proveedoresService)
// Este servicio administra el catálogo de proveedores de insumos
// y reactivos del laboratorio. Permite el registro, consulta,
// actualización, eliminación y cambio de estado de los proveedores.
// ============================================================

// Importa el modelo de proveedores para acceder a la tabla de proveedores
import proveedoreModel from '../models/proveedoresModel.js';

// Define la clase de servicio para proveedores con métodos CRUD y cambio de estado
class proveedoresService {
  // Obtiene todos los proveedores registrados en la base de datos
  async getAll() {
    return await proveedoreModel.findAll()
  }

  // Obtiene un proveedor por su ID
  async getById(id_proveedor) {
    // Busca el proveedor por su clave primaria
    const proveedor = await proveedoreModel.findByPk(id_proveedor)
    // Si no existe, lanza un error
    if (!proveedor) throw new Error('Proveedor no encontrado')
    // Retorna el proveedor encontrado
    return proveedor
  }

  // Crea un nuevo proveedor con los datos proporcionados
  async create(Data) {
    return await proveedoreModel.create(Data)
  }

  // Actualiza los datos de un proveedor existente
  async update(id_proveedor, Data) {
    // Ejecuta la actualización en la base de datos filtrando por ID
    const result = await proveedoreModel.update(Data, { where: { id_proveedor } })
    // Obtiene el número de filas afectadas
    const updated = result[0]
    // Si no se actualizó ningún registro, lanza un error
    if (updated === 0) throw new Error('Proveedor no encontrado')
    // Retorna true indicando que la actualización fue exitosa
    return true
  }

  // Cambia el estado (activo/inactivo) de un proveedor
  async cambiarEstado(id_proveedor, estado) {
    // Actualiza el estado en la base de datos filtrando por ID
    const result = await proveedoreModel.update({ estado }, { where: { id_proveedor } })
    // Si no se actualizó ningún registro, lanza un error
    if (result[0] === 0) throw new Error('Proveedor no encontrado')
    // Retorna true indicando que el cambio fue exitoso
    return true
  }

  // Elimina físicamente un proveedor
  async delete(id_proveedor) {
    // Ejecuta la eliminación filtrando por ID
    const deleted = await proveedoreModel.destroy({ where: { id_proveedor } })
    // Si no se eliminó ningún registro, lanza un error
    if (!deleted) throw new Error('Proveedor no encontrado')
    // Retorna true indicando que la eliminación fue exitosa
    return true
  }   
}

// Exporta una instancia única del servicio para usar como singleton
export default new proveedoresService();
