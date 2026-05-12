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
  const [tabHistorial, setTabHistorial] = useState("ingresos");

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_reactivo,
      sortable: true,
      width: "70px",
      center: true,
    },
    {
      name: "Reactivo",
      selector: (row) => row.nom_reactivo,
      sortable: true,
      width: "220px",
      wrap: true
    },
    {
      name: "Stock Disponible",
      sortable: true,
      width: "180px",
      cell: (row) => {
        const cant = parseFloat(row.cantidad_inventario || 0);
        const formatted = parseFloat(cant.toFixed(3)).toString();
        return (
          <span className="fw-bold" style={{ whiteSpace: "normal" }}>
            {formatted}{" "}
            <span className="text-primary small" style={{ fontSize: "10px" }}>{row.presentacion_reactivo}</span>
          </span>
        );
      },
    },
    {
      name: "Estado",
      sortable: true,
      width: "150px",
      center: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.estado_stock === "disponible" ? "bg-success" : "bg-danger"
          }`}
          style={{ fontSize: "0.75rem", padding: "5px 12px", borderRadius: "20px" }}
        >
          {row.estado_stock === "disponible" ? "✓ Disponible" : "✗ Agotado"}
        </span>
      ),
    },
    {
      name: "Vencidos",
      center: true,
      width: "150px",
      cell: (row) => {
        if (!row.lotes_vencidos || row.lotes_vencidos === 0) {
          return <span className="text-muted small">—</span>;
        }
        return (
          <div style={{ textAlign: "center" }}>
            <span className="badge bg-danger" style={{ fontSize: "0.75rem", padding: "5px 10px", borderRadius: "20px" }}>
              ⚠️ {row.lotes_vencidos} lote{row.lotes_vencidos > 1 ? 's' : ''}
            </span>
            <div className="text-danger small fw-bold" style={{ fontSize: "10px", marginTop: "2px" }}>
              {parseFloat(row.cantidad_vencida || 0).toString()} {row.presentacion_reactivo}
            </div>
          </div>
        );
      }
    },
    {
      name: "Acciones",
      center: true,
      width: "150px",
      cell: (row) => (
        <button
          className="btn btn-sm"
          style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "8px", fontSize: "12px" }}
          onClick={() => handleVerStock(row)}
          title="Ver stock y historial"
        >
          <i className="fa-solid fa-eye me-1"></i> Detalle
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
      Swal.fire("Error", "No se pudo cargar los reactivos", "error");
    }
  };

  const handleVerStock = async (reactivo) => {
    setSelectedReactivo(reactivo);
    setLoadingModal(true);

    try {
      setTabHistorial("ingresos"); // Resetear tab al abrir
      const res = await apiAxios.get(`/api/movimientos/stock-lotes/${reactivo.id_reactivo}`);
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

  const filtered = reactivos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_reactivo || "").includes(search) ||
      String(item.nom_reactivo || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          Control de Inventario (Reactivos)
        </h2>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID o nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
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
        />
      </div>

      {/* MODAL STOCK Y HISTORIAL */}
      <div className="modal fade" id="modalStock" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff" }}>
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-flask-vial me-2"></i>
                Detalle de Inventario: {selectedReactivo?.nom_reactivo}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>

            <div className="modal-body p-4">
              {loadingModal ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Cargando información del lote...</p>
                </div>
              ) : stockLotes ? (
                <div className="row">
                  {/* COLUMNA IZQUIERDA: LOTES Y VENCIMIENTOS */}
                  <div className="col-lg-7 border-end">
                    <h6 className="mb-3 fw-bold text-success">
                      <i className="fa-solid fa-boxes-stacked me-2"></i> Lotes Disponibles
                    </h6>
                    <div className="table-responsive mb-4" style={{ maxHeight: "300px" }}>
                      <table className="table table-hover table-sm align-middle">
                        <thead style={{ background: "#f1f5f9" }}>
                          <tr>
                            <th>Lote</th>
                            <th>Disponible</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockLotes.lotes_disponibles?.length > 0 ? (
                            stockLotes.lotes_disponibles.map((lote) => (
                              <tr key={lote.id_movimiento_reactivo}>
                                <td className="fw-semibold">{lote.lote}</td>
                                <td>{parseFloat(parseFloat(lote.cantidad_disponible || 0).toFixed(3)).toString()} <span className="text-muted small">{selectedReactivo?.presentacion_reactivo}</span></td>
                                <td>{lote.fecha_vencimiento ? new Date(lote.fecha_vencimiento).toLocaleDateString('es-CO') : "N/A"}</td>
                                <td>
                                  <span className="badge" style={{
                                    backgroundColor: lote.dias_para_vencer === 0 ? "#f97316" : // Naranja brillante
                                                     lote.dias_para_vencer < 0 ? "#dc2626" :   // Rojo
                                                     lote.dias_para_vencer <= 7 ? "#eab308" :  // Amarillo oscuro
                                                     "#16a34a",                                // Verde
                                    color: "#fff"
                                  }}>
                                    {lote.dias_para_vencer === 0 ? "Vence Hoy" : lote.dias_para_vencer < 0 ? "Vencido" : lote.dias_para_vencer <= 7 ? "Próximo" : "OK"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="4" className="text-center text-muted py-3">No hay lotes con stock disponible</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {stockLotes.resumen_vencidos?.cantidad_lotes_vencidos > 0 && (
                      <>
                        <h6 className="mb-3 fw-bold text-danger">
                          <i className="fa-solid fa-triangle-exclamation me-2"></i> Lotes Vencidos
                        </h6>
                        <div className="table-responsive mb-4" style={{ maxHeight: "200px" }}>
                          <table className="table table-sm table-danger table-striped">
                            <thead>
                              <tr>
                                <th>Lote</th>
                                <th>Cant.</th>
                                <th>Vencimiento</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stockLotes.resumen_vencidos.detalles.map((lote) => (
                                <tr key={lote.id_movimiento_reactivo}>
                                  <td>{lote.lote}</td>
                                  <td>{parseFloat(parseFloat(lote.cantidad_disponible || 0).toFixed(3)).toString()}</td>
                                  <td>{lote.fecha_vencimiento ? new Date(lote.fecha_vencimiento).toLocaleDateString('es-CO') : "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>

                  {/* COLUMNA DERECHA: HISTORIAL (ENTRADAS Y SALIDAS SEPARADAS) */}
                  <div className="col-lg-5">
                    <h6 className="mb-3 fw-bold text-primary d-flex justify-content-between align-items-center">
                      <span><i className="fa-solid fa-clock-rotate-left me-2"></i> Historial</span>
                    </h6>
                    <ul className="nav nav-tabs mb-3" style={{ fontSize: "14px" }}>
                      <li className="nav-item">
                        <button className={`nav-link ${tabHistorial === 'ingresos' ? 'active fw-bold text-success' : 'text-muted'}`} onClick={() => setTabHistorial('ingresos')} style={{ padding: "8px 12px" }}>
                          Ingresos
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className={`nav-link ${tabHistorial === 'salidas' ? 'active fw-bold text-danger' : 'text-muted'}`} onClick={() => setTabHistorial('salidas')} style={{ padding: "8px 12px" }}>
                          Salidas
                        </button>
                      </li>
                    </ul>
                    <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "10px" }}>
                      {stockLotes.historial?.filter(m => m.tipo === (tabHistorial === 'ingresos' ? 'entrada' : 'salida')).length > 0 ? (
                        <div className="timeline-container">
                          {stockLotes.historial
                            .filter(m => m.tipo === (tabHistorial === 'ingresos' ? 'entrada' : 'salida'))
                            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                            .map((mov, idx) => (
                            <div key={idx} className="d-flex mb-3 border-bottom pb-2">
                              <div className="me-3 text-center" style={{ minWidth: "50px" }}>
                                <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto`} 
                                     style={{ width: "32px", height: "32px", background: mov.tipo === 'entrada' ? "#dcfce7" : "#fee2e2", color: mov.tipo === 'entrada' ? "#166534" : "#991b1b" }}>
                                  <i className={`fa-solid ${mov.tipo === 'entrada' ? 'fa-arrow-down' : 'fa-arrow-up'} small`}></i>
                                </div>
                                <span className="small text-muted" style={{ fontSize: '10px' }}>
                                  {new Date(mov.fecha).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between">
                                  <span className={`fw-bold small ${mov.tipo === 'entrada' ? 'text-success' : 'text-danger'}`}>
                                    {mov.tipo === 'entrada' ? 'INGRESO' : 'SALIDA'}
                                  </span>
                                  <span className="fw-bold text-dark">
                                    {mov.tipo === 'entrada' ? '+' : '-'}{parseFloat(parseFloat(mov.cantidad || 0).toFixed(3)).toString()} <span className="small text-muted">{selectedReactivo?.presentacion_reactivo}</span>
                                  </span>
                                </div>
                                <div className="text-muted" style={{ fontSize: "11px" }}>
                                  <strong>Lote:</strong> {mov.lote}
                                  {mov.proveedor && <> | <strong>Prov:</strong> {mov.proveedor}</>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted small py-4">No hay historial de {tabHistorial} registrado</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal-footer bg-light" style={{ borderRadius: "0 0 16px 16px" }}>
              <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal" onClick={hideModal}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlReactivos;
