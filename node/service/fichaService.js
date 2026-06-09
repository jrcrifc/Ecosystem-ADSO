// Servicio para gestionar las fichas
import FichaModel from "../models/fichaModel.js";
import ProgramaModel from "../models/programaModel.js";
import XLSX from "xlsx";

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
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    let creados = 0, omitidos = 0, errores = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const filaNum = i + 2;
      let numero_ficha = "";
      let nombre_programa = "";
      let jornada = null;

      for (const key of Object.keys(row)) {
        const nk = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const val = String(row[key] ?? "").trim();
        if (nk === "numero_ficha" || nk === "ficha" || nk === "numero de ficha" || nk === "nro ficha") {
          numero_ficha = val;
        } else if (nk === "programa" || nk === "nombre_programa" || nk === "programa de formacion" || nk === "nombre del programa") {
          nombre_programa = val;
        } else if (nk === "jornada") {
          jornada = val;
        }
      }

      if (!numero_ficha) {
        errores.push(`Fila ${filaNum}: Falta el número de ficha`);
        continue;
      }

      try {
        const existe = await FichaModel.findOne({ where: { numero_ficha } });
        if (existe) { omitidos++; continue; }

        let id_programa = null;
        if (nombre_programa) {
          const [programa] = await ProgramaModel.findOrCreate({
            where: { nombre_programa },
            defaults: { estado: true }
          });
          id_programa = programa.id_programa;
        }

        await FichaModel.create({ numero_ficha, id_programa, jornada, estado: true });
        creados++;
      } catch (err) {
        errores.push(`Fila ${filaNum} (${numero_ficha}): ${err.message}`);
      }
    }
    return { creados, omitidos, errores };
  }
}

export default new FichaService();
