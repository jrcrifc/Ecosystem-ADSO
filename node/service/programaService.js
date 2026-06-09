// Servicio para gestionar los programas de formación
import ProgramaModel from "../models/programaModel.js";
import XLSX from "xlsx";

class ProgramaService {
  // Obtiene todos los programas activos
  async getAll() {
    return await ProgramaModel.findAll({ where: { estado: true } });
  }

  // Crea un nuevo programa
  async create(data) {
    const { nombre_programa } = data;
    if (!nombre_programa) throw new Error("El nombre del programa es obligatorio");
    const existe = await ProgramaModel.findOne({ where: { nombre_programa } });
    if (existe) throw new Error("Ya existe un programa con ese nombre");
    return await ProgramaModel.create(data);
  }

  // Actualiza un programa
  async update(id, data) {
    const programa = await ProgramaModel.findByPk(id);
    if (!programa) throw new Error("Programa no encontrado");
    if (data.nombre_programa && data.nombre_programa !== programa.nombre_programa) {
      const existe = await ProgramaModel.findOne({ where: { nombre_programa: data.nombre_programa } });
      if (existe) throw new Error("Ya existe un programa con ese nombre");
    }
    await programa.update(data);
    return programa;
  }

  // Elimina un programa (borrado lógico)
  async delete(id) {
    const programa = await ProgramaModel.findByPk(id);
    if (!programa) throw new Error("Programa no encontrado");
    await programa.update({ estado: false });
    return true;
  }

  // Importa programas desde un archivo Excel
  async importarExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    let creados = 0, omitidos = 0, errores = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2;
      let nombre_programa = "";

      for (const key of Object.keys(row)) {
        const nk = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();
        if (nk === "nombre_programa" || nk === "programa" || nk === "nombre del programa" || nk === "programa de formacion" || nk === "nombre") {
          nombre_programa = val;
        }
      }

      if (!nombre_programa) {
        errores.push(`Fila ${filaNum}: Falta el nombre del programa`);
        continue;
      }

      try {
        const existe = await ProgramaModel.findOne({ where: { nombre_programa } });
        if (existe) { omitidos++; continue; }
        await ProgramaModel.create({ nombre_programa, estado: true });
        creados++;
      } catch (err) {
        errores.push(`Fila ${filaNum} (${nombre_programa}): ${err.message}`);
      }
    }
    return { creados, omitidos, errores };
  }
}

export default new ProgramaService();
