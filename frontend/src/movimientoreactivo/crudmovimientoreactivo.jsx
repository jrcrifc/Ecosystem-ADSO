import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import IngresoReactivoForm from "./movimientoreactivoform.jsx"; // nombre más claro

const CrudmovimientoReactivo = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  const columns = [
    { name: "ID",          selector: row => row.id_movimiento_reactivo, sortable: true, width: "90px" },
    { name: "Reactivo",    selector: row => row.id_reactivo,           sortable: true, width: "110px" },
    { name: "Cant. Inicial", selector: row => row.cantidad_inicial,  sortable: true, width: "130px" },
    { name: "Lote",        selector: row => row.lote,                 sortable: true, width: "140px" },
    { name: "Proveedor",   selector: row => row.id_proveedor,         sortable: true, width: "110px" },
    { name: "Cant. Salida", selector: row => row.cantidad_salida,    sortable: true, width: "130px" },
    { name: "Fecha Ingreso", selector: row => row.fecha_ingreso?.slice(0,10), sortable: true, width: "140px" },
    { name: "Estado",      selector: row => row.estado_inventario,    sortable: true, width: "130px",
      cell: row => (
        <span className={`badge ${row.estado_inventario === "en stock" ? "bg-success" : "bg-danger"}`}>
          {row.estado_inventario}
        </span>
      )
    },
    {
      name: "Acciones",
      center: true,
      width: "120px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Si más adelante quieres agregar activar/inactivar con otro campo, aquí iría */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const res = await apiAxios.get("/api/movimientoreactivo"); // ← ruta más coherente
      setMovimientos(res.data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      Swal.fire("Error", "No se pudo cargar los movimientos de los reactivos", "error");
    }
  };

  const filtered = movimientos.filter(item =>
    `${item.id_movimiento_reactivo || ""}`.includes(filterText) ||
    `${item.id_reactivo || ""}`.includes(filterText) ||
    `${item.lote || ""}`.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Movimientos de reactivos
      </h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, reactivo o lote..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(null)}
          >
            + Nuevo Ingreso
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay movimientos registrados"
        paginationPerPage={10}
      />

      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedMovimiento ? "Editar" : "Nuevo"} Ingreso de Reactivo
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <IngresoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={cargarMovimientos}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudmovimientoReactivo;