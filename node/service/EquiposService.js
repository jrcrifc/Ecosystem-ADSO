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
// Importa el modelo de instructores para vincular cuentadantes
import InstructorModel from '../models/instructorModel.js';
// Importa ExcelJS y módulos de archivos para procesamiento con fotos
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la clase de servicio para equipos con lógica de disponibilidad en tiempo real
class EquiposService {
    // Obtiene todos los equipos con información completa y estado calculado dinámicamente (último registrado primero)
    async getAll() {
        // Consulta todos los equipos incluyendo cuentadante (instructor), historial de estados y solicitudes activas
        const equipos = await EquiposModel.findAll({
            include: [
                {
                    // Incluye los datos del cuentadante (instructor) asignado al equipo
                    model: InstructorModel,
                    as: 'instructor',
                    attributes: ['id_instructor', 'documento', 'nombres_apellidos', 'email']
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
            ],
            order: [['id_equipo', 'DESC']]
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

            if (estadoReal === 'revision' || estadoReal === 'mantenimiento') {
                estaOcupado = true;
            } else if (estadoReal === 'disponible') {
                // Busca solicitudes activas cuyo último estado sea bloqueante
                const solicitudActiva = (eq.solicitudes || []).find(s => {
                    const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
                    const ultimoEstado = estadosSol[0]?.estadoSolicitud?.estado;
                    return ['generado', 'aceptado', 'prestado'].includes(ultimoEstado);
                });
                if (solicitudActiva) {
                    estaOcupado = true;
                    const ultimoEstadoSol = (solicitudActiva.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud)[0]?.estadoSolicitud?.estado;
                    estadoReal = ['generado', 'aceptado'].includes(ultimoEstadoSol) ? 'solicitado' : 'prestado';
                }
            } else if (estadoReal === 'solicitado' || estadoReal === 'prestado') {
                estaOcupado = true;
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
        if (Data.id_usuario !== undefined && Data.id_instructor === undefined) {
            Data.id_instructor = Data.id_usuario || null
            delete Data.id_usuario
        }
        return await EquiposModel.create(Data)
    }

    // Actualiza los datos de un equipo existente
    async update(id_equipo, Data) {
        if (Data.id_usuario !== undefined && Data.id_instructor === undefined) {
            Data.id_instructor = Data.id_usuario || null
            delete Data.id_usuario
        }
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

    // Importa equipos de forma masiva desde un archivo de Excel con soporte para fotos y cuentadantes
    async importarExcel(buffer, userEmailLog) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        let creados = 0;
        let omitidos = 0;
        let errores = [];

        // Asegurar que la carpeta de subida de fotos de equipos existe
        const uploadsDir = path.resolve(__dirname, '../public/uploads/equipos');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Mapear fotos embebidas por fila (worksheet.getImages())
        // Si una fila tiene varios objetos de imagen (ej. un punto/icono pequeño de 200 bytes y la foto real de 700KB como en la fila 68),
        // seleccionamos siempre la imagen de mayor tamaño en bytes para garantizar que se guarde la fotografía real del equipo.
        const rowImageMap = new Map();
        const rowImageSizeMap = new Map();
        try {
            const images = worksheet.getImages() || [];
            for (const img of images) {
                const rowNum = Math.floor(img.range?.tl?.nativeRow ?? img.range?.tl?.row ?? -1) + 1;
                if (rowNum > 1) {
                    const media = workbook.getImage(img.imageId);
                    const imgSize = media?.buffer?.length || 0;
                    const prevSize = rowImageSizeMap.get(rowNum) || 0;
                    if (imgSize > prevSize) {
                        rowImageMap.set(rowNum, img.imageId);
                        rowImageSizeMap.set(rowNum, imgSize);
                    }
                }
            }
        } catch (imgErr) {
            console.warn('Advertencia leyendo imágenes del Excel:', imgErr.message);
        }

        // Obtener instructores para mapear cuentadante por documento o por nombre
        const instructores = await InstructorModel.findAll({
            attributes: ['id_instructor', 'nombres_apellidos', 'documento']
        });

        const normalizarTexto = (str) => {
            return String(str || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };

        const instList = instructores.map(i => ({
            id_instructor: i.id_instructor,
            documento: String(i.documento || '').replace(/\D/g, ''),
            nombreNorm: normalizarTexto(i.nombres_apellidos),
            tokens: normalizarTexto(i.nombres_apellidos).split(' ').filter(t => t.length >= 3)
        }));

        const buscarIdInstructor = (cuentadante) => {
            if (!cuentadante) return null;
            const valStr = String(cuentadante).trim();
            if (!valStr || valStr === 'N/A' || valStr.toUpperCase() === 'NO SE PUDO VERIFICAR') return null;

            // 1. Por documento si contiene 5 o más dígitos
            const digits = valStr.replace(/\D/g, '');
            if (digits.length >= 5) {
                const byDoc = instList.find(i => i.documento === digits);
                if (byDoc) return byDoc.id_instructor;
            }

            // 2. Coincidencia exacta de nombre normalizado
            const cNorm = normalizarTexto(valStr);
            if (!cNorm) return null;
            const exact = instList.find(i => i.nombreNorm === cNorm);
            if (exact) return exact.id_instructor;

            // 3. Coincidencia difusa de palabras/tokens (mínimo 2 tokens y >= 50% de afinidad)
            const cTokens = cNorm.split(' ').filter(t => t.length >= 3);
            if (cTokens.length === 0) return null;

            let bestMatch = null;
            let bestScore = 0;

            for (const inst of instList) {
                let matches = 0;
                for (const t of cTokens) {
                    if (inst.tokens.includes(t)) matches++;
                }
                const score = matches / Math.max(cTokens.length, inst.tokens.length);
                if (score > bestScore && matches >= 2) {
                    bestScore = score;
                    bestMatch = inst;
                }
            }

            if (bestMatch && bestScore >= 0.5) {
                return bestMatch.id_instructor;
            }
            return null;
        };

        // Identificar columnas por cabecera
        const headerRow = worksheet.getRow(1);
        const colMap = {};
        headerRow.eachCell((cell, colNumber) => {
            const headerText = normalizarTexto(cell.value);
            if (headerText.includes('equipo') || headerText.includes('nombre')) colMap.nom_equipo = colNumber;
            else if (headerText.includes('placa') || headerText.includes('serial')) colMap.no_placa = colNumber;
            else if (headerText.includes('ubicac')) colMap.ubicacion = colNumber;
            else if (headerText.includes('cuentadante') || headerText.includes('instructor') || headerText.includes('cedula') || headerText.includes('documento')) colMap.cuentadante = colNumber;
            else if (headerText.includes('estado')) colMap.estado = colNumber;
            else if (headerText.includes('funcion')) colMap.funcion = colNumber;
            else if (headerText.includes('observac')) colMap.observaciones = colNumber;
        });

        // Fallbacks por posición habitual
        if (!colMap.nom_equipo) colMap.nom_equipo = 1;
        if (!colMap.no_placa) colMap.no_placa = 2;
        if (!colMap.ubicacion) colMap.ubicacion = 3;
        if (!colMap.cuentadante) colMap.cuentadante = 4;
        if (!colMap.estado) colMap.estado = 5;
        if (!colMap.funcion) colMap.funcion = 6;
        if (!colMap.observaciones) colMap.observaciones = 7;

        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            // Obtener nombre del equipo
            const nom_equipo = String(row.getCell(colMap.nom_equipo).value || '').trim();

            // Si toda la fila está vacía o no hay nombre de equipo, omitir fila
            if (!nom_equipo || nom_equipo === 'null' || nom_equipo === 'undefined') {
                continue;
            }

            // Placa
            let no_placa_raw = row.getCell(colMap.no_placa).value;
            let no_placa = null;
            if (no_placa_raw !== null && no_placa_raw !== undefined) {
                const placaStr = String(no_placa_raw).trim();
                if (placaStr !== '' && placaStr.toUpperCase() !== 'N/A') {
                    no_placa = placaStr;
                }
            }

            // Si trae placa, validar que no exista ya en la BD
            if (no_placa) {
                const existePlaca = await EquiposModel.findOne({ where: { no_placa } });
                if (existePlaca) {
                    omitidos++;
                    continue;
                }
            }

            // Cuentadante
            const cuentadanteRaw = row.getCell(colMap.cuentadante).value;
            const id_instructor = buscarIdInstructor(cuentadanteRaw);

            // Estado en el Excel (si dice "por verificar" o "sin verificar", dejar inactivo estado = 0)
            const estadoRaw = colMap.estado ? row.getCell(colMap.estado).value : null;
            const estadoTextoNorm = normalizarTexto(estadoRaw);
            const esSinVerificarOPorVerificar =
                estadoTextoNorm.includes('por verificar') ||
                estadoTextoNorm.includes('sin verificar');
            const estadoEquipo = esSinVerificarOPorVerificar ? 0 : 1;

            // Observaciones compuestas con ubicación y función
            const obsPartes = [];
            const obsRaw = row.getCell(colMap.observaciones).value;
            if (obsRaw && String(obsRaw).trim() !== '' && String(obsRaw).trim().toUpperCase() !== 'N/A') {
                obsPartes.push(String(obsRaw).trim());
            }
            const ubicacionRaw = row.getCell(colMap.ubicacion).value;
            if (ubicacionRaw && String(ubicacionRaw).trim() !== '' && String(ubicacionRaw).trim().toUpperCase() !== 'N/A') {
                obsPartes.push(`Ubicación: ${String(ubicacionRaw).trim()}`);
            }
            const funcionRaw = row.getCell(colMap.funcion).value;
            if (funcionRaw && String(funcionRaw).trim() !== '' && String(funcionRaw).trim().toUpperCase() !== 'N/A') {
                obsPartes.push(`Función: ${String(funcionRaw).trim()}`);
            }
            const observaciones = obsPartes.length > 0 ? obsPartes.join(' | ') : null;

            // Foto del equipo si está embebida en la fila
            let foto_equipo = null;
            if (rowImageMap.has(rowNumber)) {
                try {
                    const imgId = rowImageMap.get(rowNumber);
                    const media = workbook.getImage(imgId);
                    if (media && media.buffer) {
                        const ext = media.extension || 'png';
                        const filename = `equipo_${Date.now()}_fila${rowNumber}.${ext}`;
                        const fullPath = path.join(uploadsDir, filename);
                        fs.writeFileSync(fullPath, media.buffer);
                        foto_equipo = `/uploads/equipos/${filename}`;
                    }
                } catch (eImg) {
                    console.warn(`Error al extraer imagen de la fila ${rowNumber}:`, eImg.message);
                }
            }

            try {
                const nuevoEquipo = await EquiposModel.create({
                    grupo_equipo: 'Equipo de Laboratorio',
                    nom_equipo,
                    no_placa: no_placa || null,
                    observaciones: observaciones || null,
                    id_instructor: id_instructor || null,
                    foto_equipo: foto_equipo || null,
                    estado: estadoEquipo
                });

                // Registrar estado inicial disponible (id_estado_equipo = 1) en estadoxequipo
                await Estadoxequipo.create({
                    id_equipo: nuevoEquipo.id_equipo,
                    id_estado_equipo: 1
                });

                creados++;
            } catch (err) {
                errores.push(`Fila ${rowNumber} (${nom_equipo}): ${err.message}`);
            }
        }

        return { creados, omitidos, errores };
    }
}

// Exporta una instancia única del servicio para usar como singleton
export default new EquiposService();
