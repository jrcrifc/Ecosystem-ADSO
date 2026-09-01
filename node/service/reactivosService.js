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
    
    // Importa reactivos de forma masiva desde un archivo de Excel
    async importarExcel(buffer, userEmailLog) {
        const XLSX = (await import('xlsx')).default;
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        let creados = 0;
        let omitidos = 0;
        let errores = [];

        const presentacionesValidas = ["kilogramos", "gramos", "litros", "sobres"];
        const clasificacionesValidas = [
            'Peligro de contacto', 'Peligro de reactividad', 
            'Peligro de inflamabilidad', 'Riesgo minimo', 'Peligro para salud'
        ];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const filaNum = i + 2;

            let nom_reactivo = "";
            let nom_reactivo_ingles = "";
            let formula_reactivo = "";
            let presentacion_reactivo = "litros";
            let color_almacenamiento = "Riesgo minimo";
            let color_stand = "Morado";
            let stand = "";
            let columna = "";
            let fila = "";
            let clasificacion_reactivo = "Riesgo minimo";

            for (const key of Object.keys(row)) {
                const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const val = String(row[key] ?? "").trim();

                if (normalizedKey === "nombre" || normalizedKey === "nom_reactivo" || normalizedKey === "reactivo" || normalizedKey === "nombre reactivo" || normalizedKey === "nombre del reactivo") {
                    nom_reactivo = val;
                } else if (normalizedKey === "ingles" || normalizedKey === "nom_reactivo_ingles" || normalizedKey === "nombre en ingles" || normalizedKey.includes("ingles")) {
                    nom_reactivo_ingles = val;
                } else if (normalizedKey === "formula" || normalizedKey === "formula_reactivo" || normalizedKey === "formula quimica" || normalizedKey.includes("formula")) {
                    formula_reactivo = val;
                } else if (normalizedKey === "presentacion" || normalizedKey === "presentacion_reactivo" || normalizedKey === "unidad" || normalizedKey.includes("presentacion")) {
                    const presLow = val.toLowerCase();
                    if (presentacionesValidas.includes(presLow)) {
                        presentacion_reactivo = presLow;
                    } else if (presLow.includes("kilo") || presLow === "kg") {
                        presentacion_reactivo = "kilogramos";
                    } else if (presLow.includes("gram") || presLow === "g" || presLow === "gr") {
                        presentacion_reactivo = "gramos";
                    } else if (presLow.includes("litr") || presLow === "l" || presLow === "lt" || presLow === "ml") {
                        presentacion_reactivo = "litros";
                    } else if (presLow.includes("sobr")) {
                        presentacion_reactivo = "sobres";
                    }
                } else if (normalizedKey === "color_almacenamiento" || normalizedKey === "color almacenamiento" || normalizedKey.includes("almacenamiento")) {
                    color_almacenamiento = val;
                } else if (normalizedKey === "color_stand" || normalizedKey === "color stand" || normalizedKey === "color estante") {
                    color_stand = val;
                } else if (normalizedKey === "stand" || normalizedKey === "estante") {
                    stand = val;
                } else if (normalizedKey === "columna" || normalizedKey === "col") {
                    columna = val;
                } else if (normalizedKey === "fila") {
                    fila = val;
                } else if (normalizedKey === "clasificacion" || normalizedKey === "clasificacion_reactivo" || normalizedKey.includes("clasificac")) {
                    clasificacion_reactivo = val;
                }
            }

            // Validar si la fila está vacía
            const isRowEmpty = Object.values(row).every(v => v === null || v === undefined || String(v).trim() === "");
            if (isRowEmpty) continue;

            if (!nom_reactivo) {
                errores.push(`Fila ${filaNum}: El nombre del reactivo es obligatorio`);
                continue;
            }

            // Validar si ya existe un reactivo con este nombre exacto
            const existe = await reactivosModel.findOne({ where: { nom_reactivo } });
            if (existe) {
                omitidos++;
                continue;
            }

            try {
                await reactivosModel.create({
                    nom_reactivo,
                    nom_reactivo_ingles: nom_reactivo_ingles || null,
                    formula_reactivo: formula_reactivo || null,
                    presentacion_reactivo,
                    color_almacenamiento: color_almacenamiento || "Riesgo minimo",
                    color_stand: color_stand || "Morado",
                    stand: stand || null,
                    columna: columna || null,
                    fila: fila || null,
                    clasificacion_reactivo: clasificacion_reactivo || "Riesgo minimo",
                    estado: 1
                });
                creados++;
            } catch (err) {
                errores.push(`Fila ${filaNum} (${nom_reactivo}): ${err.message}`);
            }
        }

        return { creados, omitidos, errores };
    }
}

// Exporta una instancia única del servicio para usar como singleton
export default new reactivosService()

