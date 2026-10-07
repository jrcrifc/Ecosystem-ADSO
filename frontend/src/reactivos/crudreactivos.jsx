// Archivo CRUD de reactivos con tabla, filtros, exportacion PDF/Excel y modal

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa DataTable para mostrar los reactivos en una tabla interactiva
import DataTable from "react-data-table-component";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa el formulario de creacion/edicion de reactivos
import ReactivoForm from "./reactivosform.jsx";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";
// Importa utilidades de exportacion a PDF y Excel
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
// Importa configuraciones personalizadas de paginacion y estilos de tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Define el componente CRUD de reactivos
const CrudReactivos = () => {
  // Estado que almacena el listado de reactivos
  const [reactivos, setReactivos] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar la tabla
  const [filterText, setFilterText] = useState("");
  // Estado que almacena el reactivo seleccionado para editar
  const [selectedReactivo, setSelectedReactivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockLotes, setStockLotes] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [tabHistorial, setTabHistorial] = useState("ingresos");

  // ===== Definicion de columnas =====

  // Define las columnas de la tabla con sus propiedades
  const columns = [
    { name: "ID", selector: (row) => row.id_reactivo, sortable: true, width: "75px", center: true },
    { name: "Nombre", selector: (row) => row.nom_reactivo, sortable: true, wrap: true, minWidth: "180px" },
    { name: "Presentación", selector: (row) => row.presentacion_reactivo, sortable: true, wrap: true, minWidth: "140px" },
    { name: "Cantidad", selector: (row) => row.cantidad_presentacion, sortable: true, minWidth: "110px", center: true },
    { name: "Ubicación", selector: (row) => `${row.stand || "-"} / ${row.columna || "-"} / ${row.fila || "-"}`, sortable: false, minWidth: "130px" },
    { name: "Color Stand", selector: (row) => row.color_stand || "-", sortable: true, minWidth: "120px" },
    { name: "Clasificación", selector: (row) => row.clasificacion_reactivo || "-", sortable: true, wrap: true, minWidth: "160px" },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
      minWidth: "110px",
      // Renderizador personalizado para mostrar badge de estado
      cell: (row) => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, minWidth: "150px",
      // Renderizador de botones de accion por fila
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Boton para ver detalle de stock */}
          <button className="btn btn-sm" style={{ background: "#0077B6", color: "#fff", border: "none", padding: "5px 9px", borderRadius: "6px" }} onClick={() => handleVerStock(row)} title="Ver stock e historial">
            <i className="fa-solid fa-eye"></i>
          </button>
          {/* Boton para editar el reactivo */}
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none", padding: "5px 9px", borderRadius: "6px" }} onClick={() => { setSelectedReactivo(row); setShowModal(true); }} title="Editar reactivo">
            <i className="fa-solid fa-pencil"></i>
          </button>
          {/* Boton para activar o inactivar el reactivo */}
          <button
            className="btn btn-sm"
            style={{
              background: row.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: row.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none",
              padding: "5px 9px",
              borderRadius: "6px"
            }}
            onClick={() => cambiarEstado(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // Efecto que carga los reactivos al montar el componente
  useEffect(() => { cargarReactivos(); }, []);

  // ===== Obtener todos los reactivos =====

  // Funcion asincrona para obtener los reactivos desde la API
  const cargarReactivos = async () => {
    try {
      // Realiza la peticion GET al endpoint de reactivos
      const res = await apiAxios.get("/api/reactivos");
      // Actualiza el estado con los datos obtenidos
      setReactivos(res.data);
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudieron cargar los reactivos", "error");
    }
  };

  // ===== Alternar estado activo/inactivo de un reactivo =====

  // Funcion asincrona para alternar el estado activo/inactivo de un reactivo
  const cambiarEstado = async (reactivo) => {
    // Calcula el nuevo estado (invierte el actual)
    const nuevoEstado = reactivo.estado === 1 ? 0 : 1;
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El reactivo "${reactivo.nom_reactivo}" pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;

    try {
      // Envia peticion PUT para cambiar el estado del reactivo
      await apiAxios.put(`/api/reactivos/estado/${reactivo.id_reactivo}`);
      // Muestra mensaje de exito
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "Activado" : "Inactivado",
        timer: 1500,
        showConfirmButton: false,
      });
      // Recarga la lista de reactivos
      cargarReactivos();
    } catch (error) {
      // Muestra error en consola si falla la operacion
      console.error("Error al cambiar estado:", error);
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const handleVerStock = async (reactivo) => {
    setSelectedReactivo(reactivo);
    setLoadingModal(true);
    setShowStockModal(true);
    try {
      setTabHistorial("ingresos");
      const res = await apiAxios.get(`/api/movimientos/stock-lotes/${reactivo.id_reactivo}`);
      setStockLotes(res.data);
    } catch (error) {
      console.error("Error al cargar stock:", error);
      Swal.fire("Error", "No se pudo cargar el detalle de stock", "error");
    } finally {
      setLoadingModal(false);
    }
  };

  // ===== Importar reactivos desde archivo Excel =====
  const handleImportarExcel = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Reactivos desde Excel',
      html: `
        <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.5;">
          <p>Sube un archivo de Excel (<strong>.xlsx</strong> o <strong>.xls</strong>) con las columnas:</p>
          <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 13px;">
            <li><strong>nombre</strong> (nombre del reactivo - obligatorio)</li>
            <li><strong>presentacion</strong> (kilogramos, gramos, litros, sobres)</li>


            <li><strong>color_almacenamiento</strong> (opcional)</li>
            <li><strong>color_stand</strong> (opcional)</li>
            <li><strong>stand</strong>, <strong>columna</strong>, <strong>fila</strong> (ubicación - opcional)</li>
            <li><strong>clasificacion</strong> (opcional)</li>
          </ul>
        </div>
      `,
      input: 'file',
      inputAttributes: {
        'accept': '.xlsx, .xls',
        'aria-label': 'Subir archivo Excel'
      },
      showCancelButton: true,
      confirmButtonText: 'Subir archivo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      customClass: { input: 'form-control form-control-sm' }
    });

    if (!file) return;

    Swal.fire({
      title: 'Procesando archivo...',
      text: 'Espere un momento por favor',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.post("/api/reactivos/importar-excel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const { creados, omitidos, errores } = res.data.data;

      let htmlResult = `
        <div style="text-align: left; font-size: 14px;">
          <p style="color: #2e7d32; font-weight: 600;">✅ Creados exitosamente: ${creados} reactivos</p>
          <p style="color: #64748b;">ℹ️ Omitidos (ya registrados): ${omitidos} reactivos</p>
      `;

      if (errores && errores.length > 0) {
        htmlResult += `
          <hr style="margin: 10px 0; border-top: 1px solid #cbd5e1;"/>
          <p style="color: #c62828; font-weight: bold; margin-bottom: 5px;">⚠️ Advertencias/Errores (${errores.length}):</p>
          <div style="max-height: 150px; overflow-y: auto; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 10px; font-size: 11.5px; font-family: monospace; color: #9f1239; line-height: 1.4;">
            ${errores.map(e => `• ${e}`).join('<br/>')}
          </div>
        `;
      }
      htmlResult += `</div>`;

      Swal.fire({
        title: '¡Importación Finalizada!',
        html: htmlResult,
        icon: creados > 0 ? 'success' : 'info',
        confirmButtonColor: '#0077B6'
      });

      cargarReactivos();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al procesar el archivo Excel", "error");
    }
  };

  // Funcion para ocultar modales
  const hideModal = () => {
    setShowModal(false);
    setShowStockModal(false);
    setSelectedReactivo(null);
  };

  // Filtra los reactivos localmente segun el texto de busqueda
  const filtered = reactivos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    // Verifica si el ID o nombre coinciden con la busqueda
    return (
      String(item.id_reactivo || "").includes(search) ||
      String(item.nom_reactivo || "").toLowerCase().includes(search)
    );
  });

  // ===== Formatear datos para exportacion PDF/Excel =====

  // Funcion que transforma los datos al formato requerido para exportacion
  const formatDataForExport = (data) => {
    // Mapea cada fila a un objeto con las columnas para exportar
    return data.map(row => ({
      "ID": row.id_reactivo,
      "Nombre": row.nom_reactivo || "-",
      "Presentación": row.presentacion_reactivo || "-",
      "Color Almacenamiento": row.color_almacenamiento || "-",
      "Color Stand": row.color_stand || "-",
      "Stand": row.stand || "-",
      "Columna": row.columna || "-",
      "Fila": row.fila || "-",
      "Clasificación": row.clasificacion_reactivo || "-",
      "Estado": row.estado === 1 ? "Activo" : "Inactivo",
    }));
  };

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {/* Encabezado centrado con titulo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Reactivos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de reactivos, ubicaciones y clasificaciones.
        </p>
      </div>
      {/* Barra de herramientas con busqueda y botones de exportacion */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por ID o nombre..." value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          {/* Boton para exportar a PDF */}
          <button className="btn btn-outline-danger" onClick={() => {
            // Define las columnas para el PDF
            const cols = [
              { header: "ID", dataKey: "ID" },
              { header: "Nombre", dataKey: "Nombre" },
              { header: "Presentación", dataKey: "Presentación" },
              { header: "Color Almacenamiento", dataKey: "Color Almacenamiento" },
              { header: "Color Stand", dataKey: "Color Stand" },
              { header: "Stand", dataKey: "Stand" },
              { header: "Columna", dataKey: "Columna" },
              { header: "Fila", dataKey: "Fila" },
              { header: "Clasificación", dataKey: "Clasificación" },
              { header: "Estado", dataKey: "Estado" },
            ];
            // Llama a la funcion de exportacion a PDF
            exportToPDF(formatDataForExport(filtered), cols, "Inventario_Reactivos", "INVENTARIO DE REACTIVOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          {/* Boton para exportar a Excel */}
          <button className="btn btn-outline-success" onClick={() => exportToExcel(formatDataForExport(filtered), "Inventario_Reactivos")}>
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          {/* Boton para importar desde Excel */}
          <button className="btn btn-outline-secondary" onClick={handleImportarExcel} style={{ fontWeight: "600", borderRadius: "10px" }} title="Importar reactivos desde archivo Excel">
            <i className="fa-solid fa-file-import me-2"></i> Importar Excel
          </button>
          {/* Boton para abrir el modal de nuevo reactivo */}
          <button className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }} onClick={() => { setSelectedReactivo(null); setShowModal(true); }}>
            + Nuevo Reactivo
          </button>
        </div>
      </div>
      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable columns={columns} data={filtered} pagination paginationPerPage={10} paginationComponentOptions={paginationComponentOptions} customStyles={tableCustomStyles} highlightOnHover striped responsive defaultSortFieldId={1} defaultSortAsc={false} noDataComponent={
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
            <p>No hay reactivos registrados</p>
          </div>
        } />
      </div>
      {/* Modal de reactivo */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "600px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  {selectedReactivo ? "✏️ Editar Reactivo" : "➕ Nuevo Reactivo"}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  Gestiona la información del reactivo
                </p>
              </div>
              <button onClick={hideModal}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "0" }}>
              <ReactivoForm selectedReactivo={selectedReactivo} refreshData={cargarReactivos} hideModal={hideModal} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL STOCK Y HISTORIAL */}
      {showStockModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "1000px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  <i className="fa-solid fa-flask-vial me-2"></i> Detalle de Inventario: {selectedReactivo?.nom_reactivo}
                </h5>
              </div>
              <button onClick={hideModal}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>

            <div style={{ overflowY: "auto", padding: "24px" }}>
              {loadingModal ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Cargando información del lote...</p>
                </div>
              ) : stockLotes ? (
                <div className="row">
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
                                    backgroundColor: lote.dias_para_vencer === 0 ? "#f97316" :
                                                     lote.dias_para_vencer < 0 ? "#dc2626" :
                                                     lote.dias_para_vencer <= 7 ? "#eab308" :
                                                     "#16a34a",
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
          </div>
        </div>
      )}
    </div>
  );
};

// Exporta el componente para su uso en la aplicacion
export default CrudReactivos;
