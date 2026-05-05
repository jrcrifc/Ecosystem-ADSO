import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

const ControlReactivos = () => {
  const [reactivos, setReactivos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReactivo, setSelectedReactivo] = useState(null);
  const [stockLotes, setStockLotes] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_reactivo,
      sortable: true,
      width: "80px",
    },
    {
      name: "Reactivo",
      selector: (row) => row.nom_reactivo,
      sortable: true,
      width: "200px",
    },
    {
      name: "Cantidad",
      sortable: true,
      width: "140px",
      cell: (row) => (
        <span
          className={`fw-bold ${
            row.cantidad_inventario > 0 ? "text-dark" : "text-danger"
          }`}
          style={{
            fontSize: "1rem",
            padding: "4px 8px",
            borderRadius: "6px",
            backgroundColor: row.cantidad_inventario > 0 ? "transparent" : "#fff1f2",
          }}
        >
          {row.cantidad_inventario > 0 ? (
            `${row.cantidad_inventario} ${row.presentacion_reactivo}`
          ) : (
            <span className="badge bg-danger">Sin stock</span>
          )}
        </span>
      ),
    },
    {
      name: "Presentación",
      selector: (row) => row.presentacion_reactivo,
      sortable: true,
      width: "130px",
    },
    {
      name: "Estado",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`badge ${
            row.estado_stock === "disponible" ? "bg-success" : "bg-danger"
          }`}
          style={{ fontSize: "0.85rem" }}
        >
          {row.estado_stock === "disponible" ? "✓ Disponible" : "✗ Agotado"}
        </span>
      ),
    },
    {
      name: "Acciones",
      center: true,
      width: "150px",
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleVerStock(row)}
          title="Ver stock y lotes"
        >
          <i className="fa-solid fa-boxes-stacked"></i> Stock Actual
        </button>
      ),
    },
  ];

  useEffect(() => {
    cargarReactivos();
  }, []);

  const cargarReactivos = async () => {
    try {
      const res = await apiAxios.get("/api/reactivos/stock/disponibilidad");
      setReactivos(res.data);
    } catch (error) {
      console.error("Error al cargar reactivos:", error);
      Swal.fire(
        "Error",
        "No se pudo cargar los reactivos",
        "error"
      );
    }
  };

  const handleVerStock = async (reactivo) => {
    setSelectedReactivo(reactivo);
    setLoadingModal(true);

    try {
      const res = await apiAxios.get(
        `/api/movimientos/stock-lotes/${reactivo.id_reactivo}`
      );
      setStockLotes(res.data);

      const modal = document.getElementById("modalStock");
      if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    } catch (error) {
      console.error("Error al cargar stock:", error);
      Swal.fire("Error", "No se pudo cargar el detalle de stock", "error");
    } finally {
      setLoadingModal(false);
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalStock");
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = reactivos.filter((item) =>
    `${item.id_reactivo || ""}`.includes(filterText) ||
    `${item.nom_reactivo || ""}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div
      className="mt-4"
      style={{ padding: "0 16px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
        Control de Reactivos
      </h2>
    </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID o nombre del reactivo..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end">
          <span className="text-muted">
            Total de reactivos: <strong>{filtered.length}</strong>
          </span>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay reactivos registrados</p>
            </div>
          }
        />
      </div>

      {/* MODAL STOCK */}
      <div className="modal fade" id="modalStock" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">
                📦 Stock de {selectedReactivo?.nom_reactivo}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModal}
              ></button>
            </div>

            <div className="modal-body">
              {loadingModal ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : stockLotes ? (
                <div>
                  {/* TABLA LOTES DISPONIBLES */}
                  <h6 className="mb-3 text-success">
                    <i className="fa-solid fa-check-circle"></i> Lotes
                    Disponibles
                  </h6>
                  <div className="table-responsive mb-4">
                    <table className="table table-striped table-sm">
                      <thead className="table-success">
                        <tr>
                          <th>Lote</th>
                          <th>Cantidad</th>
                          <th>Fecha Vencimiento</th>
                          <th>Días para Vencer</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockLotes.lotes_disponibles &&
                        stockLotes.lotes_disponibles.length > 0 ? (
                          stockLotes.lotes_disponibles.map((lote) => (
                            <tr key={lote.id_movimiento_reactivo}>
                              <td>
                                <strong>{lote.lote}</strong>
                              </td>
                              <td>{lote.cantidad_disponible}</td>
                              <td>{lote.fecha_vencimiento}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    lote.dias_para_vencer <= 7
                                      ? "bg-warning"
                                      : "bg-success"
                                  }`}
                                >
                                  {lote.dias_para_vencer} días
                                </span>
                              </td>
                              <td>
                                {lote.dias_para_vencer <= 0 ? (
                                  <span className="badge bg-danger">
                                    Vencido
                                  </span>
                                ) : lote.dias_para_vencer <= 7 ? (
                                  <span className="badge bg-warning">
                                    Próximo a Vencer
                                  </span>
                                ) : (
                                  <span className="badge bg-success">
                                    OK
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No hay lotes disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* TABLA LOTES VENCIDOS */}
                  <h6 className="mb-3 text-danger">
                    <i className="fa-solid fa-times-circle"></i> Resumen de
                    Lotes Vencidos
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead className="table-danger">
                        <tr>
                          <th>Lote</th>
                          <th>Cantidad</th>
                          <th>Fecha Vencimiento</th>
                          <th>Días Vencido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockLotes.resumen_vencidos &&
                        stockLotes.resumen_vencidos.detalles &&
                        stockLotes.resumen_vencidos.detalles.length > 0 ? (
                          stockLotes.resumen_vencidos.detalles.map((lote) => (
                            <tr key={lote.id_movimiento_reactivo}>
                              <td>
                                <strong>{lote.lote}</strong>
                              </td>
                              <td>{lote.cantidad_disponible}</td>
                              <td>{lote.fecha_vencimiento}</td>
                              <td>
                                <span className="badge bg-danger">
                                  {Math.abs(
                                    Math.floor(
                                      (new Date() -
                                        new Date(lote.fecha_vencimiento)) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  )}{" "}
                                  días
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No hay lotes vencidos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {stockLotes.resumen_vencidos?.cantidad_lotes_vencidos >
                      0 && (
                      <div className="alert alert-warning mt-3" role="alert">
                        <strong>Advertencia:</strong> Hay{" "}
                        <strong>
                          {stockLotes.resumen_vencidos.cantidad_lotes_vencidos}
                        </strong>{" "}
                        lote(s) vencido(s) que deben ser retirados del
                        inventario.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={hideModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlReactivos;
