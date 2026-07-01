// Servicio para gestionar las fichas
import FichaModel from "../models/fichaModel.js";
import ProgramaModel from "../models/programaModel.js";
import XLSX from "xlsx";

function parseExcelDate(val) {
  if (val === null || val === undefined) return null;

  // If it's already a Date object
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return val.toISOString().split('T')[0];
  }

  // If it's a number (Excel serial date)
  if (typeof val === 'number' || (typeof val === 'string' && val.trim() !== "" && !isNaN(val))) {
    const num = Number(val);
    const date = new Date(Math.round((num - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  const str = String(val).trim();
  if (!str) return null;

  // Try to match YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Try to match DD/MM/YYYY or MM/DD/YYYY
  const parts = str.split(/[-/]/);
  if (parts.length === 3) {
    let year = parts[2];
    let month = parts[0];
    let day = parts[1];
    
    if (year.length === 2) {
      year = "20" + year;
    }
    
    // If year is in parts[0] (YYYY/MM/DD)
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else if (parseInt(parts[0]) > 12) {
      // It is DD/MM/YYYY
      day = parts[0];
      month = parts[1];
    }
    
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
    
    const formatted = `${year}-${month}-${day}`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      return formatted;
    }
  }

  // Fallback to JS Date parser
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return null;
}

class FichaService {
  // Obtiene todas las fichas activas junto con su programa
  async getAll() {
    return await FichaModel.findAll({
      where: { estado: true },
      include: [{
        model: ProgramaModel,
        as: 'programa',
        attributes: ['id_programa', 'nombre_programa']
      }]
    });
  }

  // Crea una nueva ficha
  async create(data) {
    const { numero_ficha } = data;
    if (!numero_ficha) throw new Error("El número de ficha es obligatorio");
    const existe = await FichaModel.findOne({ where: { numero_ficha } });
    if (existe) throw new Error("Ya existe una ficha con ese número");
    return await FichaModel.create(data);
  }

  // Actualiza una ficha
  async update(id, data) {
    const ficha = await FichaModel.findByPk(id);
    if (!ficha) throw new Error("Ficha no encontrada");
    if (data.numero_ficha && data.numero_ficha !== ficha.numero_ficha) {
      const existe = await FichaModel.findOne({ where: { numero_ficha: data.numero_ficha } });
      if (existe) throw new Error("Ya existe una ficha con ese número");
    }
    await ficha.update(data);
    return ficha;
  }

  // Elimina una ficha (borrado lógico)
  async delete(id) {
    const ficha = await FichaModel.findByPk(id);
    if (!ficha) throw new Error("Ficha no encontrada");
    await ficha.update({ estado: false });
    return true;
  }

  // Importa fichas desde un archivo Excel
  async importarExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    let creados = 0, actualizados = 0, errores = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2;
      let numero_ficha = "";
      let nombre_programa = "";
      let fecha_inicio = null;
      let fecha_fin = null;

      for (const key of Object.keys(row)) {
        const nk = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = row[key];
        if (nk === "numero_ficha" || nk === "ficha" || nk === "numero de ficha" || nk === "nro ficha") {
          numero_ficha = String(val ?? "").trim();
        } else if (nk === "programa" || nk === "nombre_programa" || nk === "programa de formacion" || nk === "nombre del programa") {
          nombre_programa = String(val ?? "").trim();
        } else if (nk === "fecha_inicio" || nk === "fecha de inicio" || nk === "fecha inicio" || nk === "inicio" || nk.includes("inicio lectiva") || nk.includes("fecha inicio")) {
          fecha_inicio = parseExcelDate(val);
        } else if (nk === "fecha_fin" || nk === "fecha de fin" || nk === "fecha fin" || nk === "fin" || nk.includes("fin lectiva") || nk.includes("fecha fin")) {
          fecha_fin = parseExcelDate(val);
        }
      }

      if (!numero_ficha) {
        errores.push(`Fila ${filaNum}: Falta el número de ficha`);
        continue;
      }

      // Extraer solo la parte entera (sin decimales)
      if (numero_ficha.includes('.')) {
        numero_ficha = numero_ficha.split('.')[0];
      }

      // Validar que sea un número entero válido
      if (!/^\d+$/.test(numero_ficha)) {
        errores.push(`Fila ${filaNum}: "${numero_ficha}" no es un número de ficha válido`);
        continue;
      }

      try {
        let id_programa = null;
        if (nombre_programa) {
          const [programa] = await ProgramaModel.findOrCreate({
            where: { nombre_programa },
            defaults: { estado: true }
          });
          id_programa = programa.id_programa;
        }

        const existe = await FichaModel.findOne({ where: { numero_ficha } });
        if (existe) { 
          await existe.update({
            id_programa: id_programa || existe.id_programa,
            fecha_inicio: fecha_inicio || existe.fecha_inicio,
            fecha_fin: fecha_fin || existe.fecha_fin,
            estado: true
          });
          actualizados++; 
          continue; 
        }

        await FichaModel.create({
          numero_ficha,
          id_programa,
          estado: true,
          fecha_inicio,
          fecha_fin
        });
        creados++;
      } catch (err) {
        errores.push(`Fila ${filaNum} (${numero_ficha}): ${err.message}`);
      }
    }
    return { creados, omitidos: 0, actualizados, errores };
  }
}

export default new FichaService();
