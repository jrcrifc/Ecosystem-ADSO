// Importa jsPDF para generar documentos PDF en el navegador
import jsPDF from "jspdf";
// Importa el plugin autoTable para crear tablas dentro del PDF
import autoTable from "jspdf-autotable";
// Importa la librería XLSX de SheetJS para generar archivos Excel
import * as XLSX from "xlsx";

// Exporta una función que genera un PDF con datos tabulares descargable
export const exportToPDF = (data, columns, fileName = "reporte", title = "Reporte del Laboratorio") => {
  // Crea un nuevo documento PDF en blanco
  const doc = new jsPDF();

  // Obtiene la clave de ordenamiento desde la primera columna
  const sortKey = columns[0]?.dataKey;
  // Clona el array de datos para evitar mutar el original
  let sortedData = [...data];
  // Si existe clave de ordenamiento, ordena los datos ascendentemente
  if (sortKey) {
    sortedData.sort((a, b) => {
      // Obtiene los valores a comparar de cada registro
      const valA = a[sortKey];
      const valB = b[sortKey];
      // Envía los valores nulos o indefinidos al final del array
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      // Compara numéricamente si ambos valores son números
      if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }
      // Compara como strings con orden numérico natural
      return String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  // Configura el título del PDF en azul Ecosystem
  doc.setFontSize(18);
  doc.setTextColor(2, 62, 138);
  doc.text(title, 14, 22);
  // Agrega la fecha de generación debajo del título
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

  // Genera la tabla en el PDF usando autoTable
  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.header)],
    body: sortedData.map(row => columns.map(c => row[c.dataKey] || "-")),
    theme: 'grid',
    headStyles: { fillColor: [2, 62, 138], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  // Descarga el archivo PDF generado
  doc.save(`${fileName}.pdf`);
};

// Exporta una función que genera un archivo Excel descargable con los datos
export const exportToExcel = (data, fileName = "reporte") => {
  // Clona los datos para no modificar el array original
  let sortedData = [...data];
  // Si hay datos, ordena por la primera propiedad del primer objeto
  if (sortedData.length > 0) {
    const sortKey = Object.keys(sortedData[0])[0];
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

  // Convierte el array de objetos en una hoja de Excel
  const worksheet = XLSX.utils.json_to_sheet(sortedData);

  // Calcula y aplica el ancho automático de columnas según el contenido
  if (sortedData && sortedData.length > 0) {
    const keys = Object.keys(sortedData[0]);
    const cols = keys.map(key => {
      let maxLength = key.length;
      for (const row of sortedData) {
        const val = row[key];
        if (val !== undefined && val !== null) {
          const strLen = String(val).length;
          if (strLen > maxLength) {
            maxLength = strLen;
          }
        }
      }
      return { wch: maxLength + 3 };
    });
    worksheet['!cols'] = cols;
  }

  // Crea un libro de Excel y agrega la hoja de datos
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  // Descarga el archivo Excel generado
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
