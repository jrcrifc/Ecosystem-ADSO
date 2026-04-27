import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

export default function CrudEstadoEquipo() {
  const [estados, setEstados] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [estadoForm, setEstadoForm] = useState("");

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const opciones = ["disponible", "no disponible", "mantenimiento"];

  useEffect(() => { cargarEstados(); }, []);

  const cargarEstados = async () => {
    try {
      const res = await apiAxios.get("/api/estadoequipo", { headers });
      setEstados(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

  const abrirModal = (estado = null) => {
    if (estado) {
      setEditando(estado);
      setEstadoForm(estado.estado);
    } else {
      setEditando(null);
      setEstadoForm("");
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setEstadoForm("");
  };

  const guardar = async () => {
    if (!estadoForm) {
      Swal.fire("Atención", "Selecciona un estado", "warning");
      return;
    }
    try {
      if (editando) {
        await apiAxios.put(`/api/estadoequipo/${editando.id_estado_equipo}`, { estado: estadoForm }, { headers });
        Swal.fire("¡Actualizado!", "Estado actualizado correctamente", "success");
      } else {
        await apiAxios.post("/api/estadoequipo", { estado: estadoForm }, { headers });
        Swal.fire("¡Creado!", "Estado creado correctamente", "success");
      }
      cerrarModal();
      cargarEstados();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar estado?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/estadoequipo/${id}`, { headers });
      Swal.fire("Eliminado", "Estado eliminado", "success");
      cargarEstados();
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "disponible":    return "bg-success";
      case "no disponible": return "bg-danger";
      case "mantenimiento": return "bg-warning text-dark";
      default:              return "bg-secondary";
    }
  };

  const columns = [
    {
      name: "ID",
      selector: r => r.id_estado_equipo,
      sortable: true,
    },
    {
      name: "Estado",
      sortable: true,
      center: true,
      cell: r => (
        <span className={`badge ${getBadgeColor(r.estado)}`} style={{ fontSize: "0.8rem" }}>
          {r.estado}
        </span>
      )
    },
    {
      name: "Acciones",
      center: true,
      cell: r => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-warning" onClick={() => abrirModal(r)} title="Editar">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => eliminar(r.id_estado_equipo)} title="Eliminar">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const filtered = estados.filter(r =>
    r.estado?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
  <div className="container mt-4">
    <h2 className="text-center mb-4 fw-bold text-primary">Estados de Equipo</h2>
   

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input type="text" className="form-control"
            placeholder="Buscar estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-primary" onClick={cargarEstados}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <i className="fas fa-plus me-2"></i>Nuevo Estado
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
  noDataComponent="No hay estados registrados"
  customStyles={{
    headCells: { style: { justifyContent: "center", fontWeight: "bold" } },
    cells: { style: { justifyContent: "center" } }
  }}
/>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editando ? "Editar Estado" : "Nuevo Estado"}
                </h5>
                <button className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold">Estado del equipo</label>
                <select className="form-select" value={estadoForm}
                  onChange={e => setEstadoForm(e.target.value)}>
                  <option value="">-- Selecciona un estado --</option>
                  {opciones.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardar}>
                  <i className="fas fa-save me-2"></i>
                  {editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}