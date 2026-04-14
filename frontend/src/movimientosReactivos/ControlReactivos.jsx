import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

export default function ControlReactivos() {
  const [reactivos, setReactivos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarControl(); }, []);

  const cargarControl = async () => {
    try {
      const res = await apiAxios.get("/api/movimientos", { headers });
      
      // Agrupar por reactivo y calcular stock
      const stockPorReactivo = {};
      res.data.forEach(m => {
        const id = m.id_reactivo;
        if (!stockPorReactivo[id]) {
          stockPorReactivo[id] = {
            id_reactivo: id,
            nom_reactivo: m.reactivo?.nom_reactivo || "-",
            stock: 0
          };
        }
        stockPorReactivo[id].stock += parseFloat(m.cantidad_inicial || 0);
        stockPorReactivo[id].stock -= parseFloat(m.cantidad_salida || 0);
      });

      setReactivos(Object.values(stockPorReactivo));
    } catch {
      Swal.fire("Error", "No se pudo cargar el control de reactivos", "error");
    }
  };

  const columns = [
    { name: "Reactivo", selector: r => r.nom_reactivo, sortable: true },
    {
      name: "Stock Actual",
      center: true,
      cell: r => (
        <span className={`badge ${r.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
          {r.stock.toFixed(3)}
        </span>
      )
    },
    // ✅ AGREGA ESTA COLUMNA
    {
      name: "Estado",
      center: true,
      cell: r => (
        <span className={`badge ${r.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
          {r.stock > 0 ? 'en stock' : 'agotado'}
        </span>
      )
    }
  ];

  const filtered = reactivos.filter(r =>
    r.nom_reactivo?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-3 fw-bold text-primary">Control de Reactivos</h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-8">
          <input type="text" className="form-control"
            placeholder="Buscar por nombre de reactivo..."
            value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-outline-primary" onClick={cargarControl}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        paginationPerPage={10}
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay reactivos registrados"
        customStyles={{
          headCells: { style: { justifyContent: "center", fontWeight: "bold" } },
          cells: { style: { justifyContent: "center" } }
        }}
      />
    </div>
  );
}