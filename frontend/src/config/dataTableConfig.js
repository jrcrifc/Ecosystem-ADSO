// Exporta las opciones de paginación en español para el DataTable
export const paginationComponentOptions = {
  // Texto del selector de filas por página
  rowsPerPageText: 'Filas por página:',
  // Texto separador entre el rango y el total
  rangeSeparatorText: 'de',
  // Habilita la opción de seleccionar todas las filas
  selectAllRowsItem: true,
  // Texto de la opción para mostrar todas las filas
  selectAllRowsItemText: 'Todos',
};

// Exporta los estilos personalizados de la tabla DataTable
export const tableCustomStyles = {
  // Estilos de la fila de cabecera con fondo azul claro
  headRow: {
    style: {
      backgroundColor: '#f0f7ff',
      borderBottom: '2px solid #dbeafe',
      fontWeight: '700',
      fontSize: '12px',
      color: '#023E8A',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  // Estilos de las celdas individuales de la cabecera
  headCells: {
    style: {
      padding: '12px 16px',
      justifyContent: 'start',
    },
  },
  // Estilos de las filas de datos con hover sutil
  rows: {
    style: {
      fontSize: '13px',
      color: '#334155',
      minHeight: '48px',
      borderBottom: '1px solid #f1f5f9',
      '&:hover': {
        backgroundColor: '#f8fafc',
      },
    },
  },
  // Estilos de las celdas de datos individuales
  cells: {
    style: {
      padding: '10px 16px',
    },
  },
  // Estilos del componente de paginación
  pagination: {
    style: {
      borderTop: '1px solid #e2e8f0',
      fontSize: '12px',
      color: '#64748b',
    },
  },
};
