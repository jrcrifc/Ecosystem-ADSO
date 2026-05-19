import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Exporta datos a PDF
 * @param {Array} data - Lista de objetos a exportar
 * @param {Array} columns - Columnas (formato [{header: 'Nombre', dataKey: 'nom'}])
 * @param {String} fileName - Nombre del archivo
 * @param {String} title - Título dentro del PDF
 */
export const exportToPDF = (data, columns, fileName = "reporte", title = "Reporte del Laboratorio") => {
  const doc = new jsPDF();
  
  // Clonar y ordenar la data de forma ascendente usando la primera columna como clave (ej. ID)
  const sortKey = columns[0]?.dataKey;
  let sortedData = [...data];
  if (sortKey) {
    sortedData.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }
      return String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
    });
  }
  
  // Agregar logo o cabecera
  doc.setFontSize(18);
  doc.setTextColor(2, 62, 138); // Azul Ecosystem
  doc.text(title, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

  // Generar tabla
  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.header)],
    body: sortedData.map(row => columns.map(c => row[c.dataKey] || "-")),
    theme: 'grid',
    headStyles: { fillColor: [2, 62, 138], textColor: [255, 255, 255] }, // Estilo azul
    styles: { fontSize: 8 },
  });

  doc.save(`${fileName}.pdf`);
};

/**
 * Exporta datos a Excel
 * @param {Array} data - Lista de objetos
 * @param {String} fileName - Nombre del archivo
 */
export const exportToExcel = (data, fileName = "reporte") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Ajuste automático de los anchos de columna para evitar textos remontados/solapados
  if (data && data.length > 0) {
    const keys = Object.keys(data[0]);
    const cols = keys.map(key => {
      let maxLength = key.length; // Comenzar con el tamaño del encabezado
      for (const row of data) {
        const val = row[key];
        if (val !== undefined && val !== null) {
          const strLen = String(val).length;
          if (strLen > maxLength) {
            maxLength = strLen;
          }
        }
      }
      // Agregar un pequeño margen de seguridad de +3 caracteres
      return { wch: maxLength + 3 };
    });
    worksheet['!cols'] = cols;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
