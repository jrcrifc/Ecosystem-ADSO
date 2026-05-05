// ✅ Configuración global de DataTable en español
// Importar en cualquier componente que use DataTable

export const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página:',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
};

export const tableCustomStyles = {
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
  headCells: {
    style: {
      padding: '12px 16px',
      justifyContent: 'start', // ✅ Alineado a la izquierda para coincidir con los datos
    },
  },
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
  cells: {
    style: {
      padding: '10px 16px',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #e2e8f0',
      fontSize: '12px',
      color: '#64748b',
    },
  },
};
