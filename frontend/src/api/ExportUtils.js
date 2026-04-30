import jsPDF from "jspdf";
import "jspdf-autotable";
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
  
  // Agregar logo o cabecera
  doc.setFontSize(18);
  doc.setTextColor(2, 62, 138); // Azul Ecosystem
  doc.text(title, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

  // Generar tabla
  doc.autoTable({
    startY: 35,
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => row[c.dataKey] || "-")),
    theme: 'grid',
    headStyles: { fillStyle: 'f', fillColor: [2, 62, 138] }, // Estilo azul
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
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
