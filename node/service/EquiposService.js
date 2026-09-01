// ============================================================
// 🔧 SERVICIO DE EQUIPOS (EquiposService)
// Este servicio administra el inventario de equipos del laboratorio.
// Incluye la lógica de disponibilidad en tiempo real que determina
// si un equipo está libre, solicitado o prestado con base en el
// historial de estados y las solicitudes activas vigentes.
// ============================================================

// Importa el modelo de Equipos para acceder a la tabla de equipos en la base de datos
import EquiposModel from '../models/EquiposModel.js';
// Importa el modelo de usuarios para la relación con el cuentadante (instructor) del equipo
import userModel from '../models/userModel.js';
// Importa el modelo de historial de estados de equipo
import Estadoxequipo from '../models/estadoxequipoModel.js';
// Importa el modelo de catálogo de estados de equipo
import estadoEquipoModel from '../models/Estado_equipoModel.js';
// Importa el modelo de solicitudes para verificar disponibilidad
import SolicitudModel from '../models/solicitudModel.js';
// Importa el modelo de historial de estados de solicitud
import EstadoxsolicitudModel from '../models/estadoxsolicitudModel.js';
// Importa el modelo de catálogo de estados de solicitud
import EstadoSolicitudModel from '../models/Estado_solicitudModel.js';

// Define la clase de servicio para equipos con lógica de disponibilidad en tiempo real
class EquiposService {
    // Obtiene todos los equipos con información completa y estado calculado dinámicamente
    async getAll() {
        // Consulta todos los equipos incluyendo cuentadante (instructor), historial de estados y solicitudes activas
        const equipos = await EquiposModel.findAll({
            include: [
                {
                    // Incluye los datos del cuentadante (instructor) asignado al equipo
                    model: userModel,
                    as: 'instructor',
                    attributes: ['id_usuario', 'documento', 'nombres_apellidos', 'email']
                },
                {
                    // Incluye el historial de estados físicos del equipo
                    model: Estadoxequipo,
                    as: 'estadosEquipo',
                    include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }],
                    attributes: ['id_estadoxequipo', 'createdAt']
                },
                {
                    // Incluye las solicitudes activas que involucran al equipo
                    model: SolicitudModel,
                    as: 'solicitudes',
                    where: { estado: 1 },
                    required: false,
                    include: [{
                        model: EstadoxsolicitudModel,
                        as: 'estados',
                        include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
                    }],
                    through: { attributes: [] }
                }
            ]
        });
        // Procesa cada equipo para determinar su estado real compuesto
        return equipos.map(e => {
            const eq = e.toJSON();
            // Ordena los estados físicos del equipo del más reciente al más antiguo
            const ordenados = (eq.estadosEquipo || []).sort(
                (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
            );
            // Obtiene el último estado físico registrado o asume disponible
            let estadoReal = ordenados[0]?.estadoEquipo?.estado || 'disponible';
            // Inicializa la bandera de ocupado como falsa
            let estaOcupado = false;
            // Solo evalúa solicitudes activas si el equipo está físicamente disponible
            if (estadoReal === 'disponible') {
                const ahora = new Date();
                // Busca solicitudes activas cuyo último estado sea bloqueante y no estén vencidas
                const solicitudActiva = (eq.solicitudes || []).find(s => {
                    // Ordena los estados de la solicitud del más reciente al más antiguo
                    const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
                    // Obtiene el último estado de la solicitud
                    const ultimoEstado = estadosSol[0]?.estadoSolicitud?.estado;
                    // Solo bloquea si el último estado es generado, aceptado o prestado
                    const tieneEstadoBloqueante = ['generado', 'aceptado', 'prestado'].includes(ultimoEstado);
                    // Verifica si el tiempo de la solicitud no ha expirado
                    const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
                    // Retorna true si el estado es bloqueante y no ha expirado
                    return tieneEstadoBloqueante && !tiempoExpirado;
                });
                // Si encontró una solicitud activa bloqueante
                if (solicitudActiva) {
                    // Marca el equipo como ocupado
                    estaOcupado = true;
                    // Obtiene el estado de la solicitud activa para etiquetar como solicitado o prestado
                    const ultimoEstadoSol = (solicitudActiva.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud)[0]?.estadoSolicitud?.estado;
                    // Asigna el estado real según el tipo de solicitud activa
                    estadoReal = ['generado', 'aceptado'].includes(ultimoEstadoSol) ? 'solicitado' : 'prestado';
                }
            }
            // Retorna el equipo con los campos calculados de estado real y ocupado
            return { ...eq, estadoReal, estaOcupado };
        });
    }

    // Obtiene un equipo por su ID
    async getById(id_equipo) {
        // Busca el equipo por su clave primaria
        const equipo = await EquiposModel.findByPk(id_equipo)
        // Si no existe, lanza un error
        if (!equipo) throw new Error('Equipo no encontrado')
        // Retorna el equipo encontrado
        return equipo
    }

    // Crea un nuevo equipo en el inventario
    async create(Data) {
        return await EquiposModel.create(Data)
    }

    // Actualiza los datos de un equipo existente
    async update(id_equipo, Data) {
        // Ejecuta la actualización filtrando por ID de equipo
        const result = await EquiposModel.update(Data, { where: { id_equipo } })
        // Obtiene el número de filas afectadas
        const updated = result[0]
        // Si no se actualizó ningún registro, lanza un error
        if (updated === 0) throw new Error('Equipo no encontrado')
        // Retorna true indicando que la actualización fue exitosa
        return true
    }

    // Elimina físicamente un equipo del inventario
    async delete(id_equipo) {
        // Ejecuta la eliminación filtrando por ID de equipo
        const deleted = await EquiposModel.destroy({ where: { id_equipo } })
        // Si no se eliminó ningún registro, lanza un error
        if (!deleted) throw new Error('Equipo no encontrado')
        // Retorna true indicando que la eliminación fue exitosa
        return true
    }
    // Importa equipos de forma masiva desde un archivo de Excel
    async importarExcel(buffer, userEmailLog) {
        const XLSX = (await import('xlsx')).default;
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        let creados = 0;
        let omitidos = 0;
        let errores = [];

        // Obtener todos los instructores/usuarios para mapear por documento
        const usuarios = await userModel.findAll({ attributes: ['id_usuario', 'documento', 'nombres_apellidos'] });
        const usuariosMap = new Map();
        usuarios.forEach(u => {
            if (u.documento) usuariosMap.set(String(u.documento).trim(), u.id_usuario);
        });

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const filaNum = i + 2;

            let nom_equipo = "";
            let marca_equipo = "";
            let no_placa = "";
            let observaciones = "";
            let doc_instructor = "";

            for (const key of Object.keys(row)) {
                const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const val = String(row[key] ?? "").trim();

                if (normalizedKey === "nombre" || normalizedKey === "nom_equipo" || normalizedKey === "equipo" || normalizedKey === "nombre del equipo" || normalizedKey.includes("nombre")) {
                    nom_equipo = val;
                } else if (normalizedKey === "marca" || normalizedKey === "marca_equipo" || normalizedKey.includes("marca")) {
                    marca_equipo = val;
                } else if (normalizedKey === "placa" || normalizedKey === "no_placa" || normalizedKey === "serial" || normalizedKey.includes("placa") || normalizedKey.includes("serial")) {
                    no_placa = val;
                } else if (normalizedKey === "observaciones" || normalizedKey === "observacion" || normalizedKey.includes("observac")) {
                    observaciones = val;
                } else if (normalizedKey === "documento" || normalizedKey === "cuentadante" || normalizedKey === "instructor" || normalizedKey.includes("cuentadante") || normalizedKey.includes("instructor") || normalizedKey.includes("cedula")) {
                    doc_instructor = val.replace(/\D/g, '');
                }
            }

            // Validar que no sea fila vacía
            const isRowEmpty = Object.values(row).every(v => v === null || v === undefined || String(v).trim() === "");
            if (isRowEmpty) continue;

            if (!nom_equipo) {
                errores.push(`Fila ${filaNum}: El nombre del equipo es obligatorio`);
                continue;
            }

            // Si trae placa, validar que no exista ya en la BD
            if (no_placa) {
                const existePlaca = await EquiposModel.findOne({ where: { no_placa } });
                if (existePlaca) {
                    omitidos++;
                    continue;
                }
            }

            // Buscar id_usuario del instructor si se suministró documento
            let id_usuario = null;
            if (doc_instructor && usuariosMap.has(doc_instructor)) {
                id_usuario = usuariosMap.get(doc_instructor);
            }

            try {
                const nuevoEquipo = await EquiposModel.create({
                    grupo_equipo: 'Equipo de Laboratorio',
                    nom_equipo,
                    marca_equipo: marca_equipo || null,
                    no_placa: no_placa || null,
                    observaciones: observaciones || null,
                    id_usuario,
                    estado: 1
                });

                // Registrar estado inicial disponible (id_estado_equipo = 1) en estadoxequipo
                await Estadoxequipo.create({
                    id_equipo: nuevoEquipo.id_equipo,
                    id_estado_equipo: 1
                });

                creados++;
            } catch (err) {
                errores.push(`Fila ${filaNum} (${nom_equipo}): ${err.message}`);
            }
        }

        return { creados, omitidos, errores };
    }
}

// Exporta una instancia única del servicio para usar como singleton
export default new EquiposService();

