// ============================================================
// 🧪 SERVICIO DE REACTIVOS QUÍMICOS (reactivosService)
// Este servicio administra el catálogo de reactivos químicos del
// laboratorio. Calcula dinámicamente la existencia actual de cada
// reactivo sumando los movimientos de entrada y salida asociados.
// ============================================================

// Importa el modelo de reactivos para acceder a la tabla de reactivos
import reactivosModel from "../models/reactivosModel.js";
// Importa el modelo de movimientos de reactivos para el cálculo de stock
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";

// Define la clase de servicio para reactivos con cálculo de stock en tiempo real
class reactivosService {
    // Obtiene todos los reactivos con su stock calculado en tiempo real
    async getAll() {
        // Consulta todos los reactivos incluyendo sus movimientos activos
        const reactivos = await reactivosModel.findAll({
            include: [{
                // Incluye los movimientos del reactivo para calcular el stock
                model: movimientoreactivoModel,
                as: 'movimientos',
                where: { estado: 1 },
                required: false,
                attributes: ['cantidad_inicial', 'cantidad_salida']
            }],
            order: [['id_reactivo', 'DESC']]
        });
        // Calcula el stock neto consolidado de cada reactivo
        return reactivos.map(r => {
            const item = r.toJSON();
            // Suma todas las cantidades de entrada del reactivo
            const totalInicial = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_inicial || 0), 0);
            // Suma todas las cantidades de salida del reactivo
            const totalSalida = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_salida || 0), 0);
            // Calcula la cantidad disponible como entradas menos salidas
            item.cantidad_presentacion = parseFloat((totalInicial - totalSalida).toFixed(3));
            // Retorna el reactivo con el stock calculado
            return item;
        });
    }

    // Obtiene un reactivo por su ID con el stock disponible calculado
    async getById(id_reactivo) {
        // Busca el reactivo por su clave primaria incluyendo movimientos
        const reactivo = await reactivosModel.findByPk(id_reactivo, {
            include: [{
                // Incluye los movimientos activos para calcular el stock
                model: movimientoreactivoModel,
                as: 'movimientos',
                where: { estado: 1 },
                required: false,
                attributes: ['cantidad_inicial', 'cantidad_salida']
            }]
        });
        // Si no existe, lanza un error
        if (!reactivo) throw new Error('reactivo no encontrado');
        const item = reactivo.toJSON();
        // Suma todas las cantidades de entrada del reactivo
        const totalInicial = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_inicial || 0), 0);
        // Suma todas las cantidades de salida del reactivo
        const totalSalida = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_salida || 0), 0);
        // Calcula la cantidad disponible como entradas menos salidas
        item.cantidad_presentacion = parseFloat((totalInicial - totalSalida).toFixed(3));
        // Retorna el reactivo con el stock calculado
        return item;
    }

    // Crea un nuevo reactivo en el catálogo
    async create(data) {
        // Muestra en consola los datos a guardar para depuración
    console.log("📥 Datos a guardar:", JSON.stringify(data, null, 2));
    try {
        // Crea el reactivo en la base de datos
        return await reactivosModel.create(data);
    } catch (error) {
        // Muestra en consola los errores de Sequelize completos
        console.error("❌ Error Sequelize completo:", error.errors);
        // Relanza el error para que lo maneje el controlador
        throw error;
    }
}

    // Actualiza los datos de un reactivo existente
    async update(id,data){
        // Ejecuta la actualización filtrando por ID de reactivo
        const result = await reactivosModel.update(data, { where: { id_reactivo: id }})
        // Obtiene el número de filas afectadas
        const updated = result[0]
        // Si no se actualizó ningún registro, lanza un error
        if (updated === 0) throw new Error('')
        // Retorna true indicando que la actualización fue exitosa
            return true
    }

    // Elimina físicamente un reactivo del catálogo
    async delete(id) {
        // Ejecuta la eliminación filtrando por ID de reactivo
        const deleted = await reactivosModel.destroy({where: {id_reactivo : id }})
        // Si no se eliminó ningún registro, lanza un error
        if(!deleted) throw new Error('')
        // Retorna true indicando que la eliminación fue exitosa
            return true
    }
    
}

// Exporta una instancia única del servicio para usar como singleton
export default new reactivosService()
