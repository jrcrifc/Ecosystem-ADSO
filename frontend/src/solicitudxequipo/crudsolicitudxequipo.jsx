import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function CrudSolicitudxEquipo() {
  const [registros, setRegistros] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ id_solicitud: "", id_equipo: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [regs, sols, eqs] = await Promise.all([
        apiAxios.get("/api/solicitudxequipo", { headers }),
        apiAxios.get("/api/solicitud", { headers }),
        apiAxios.get("/api/estadoxequipo/ultimos/estados", { headers }),
      ]);
      setRegistros(regs.data);
      setSolicitudes(sols.data);
      setEquipos(eqs.data); // ← todos los equipos sin filtrar
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const abrirModal = (registro = null) => {
    if (registro) {
      setEditando(registro.id_solicitudxequipo);
      setForm({ id_solicitud: registro.id_solicitud, id_equipo: registro.id_equipo });
    } else {
      setEditando(null);
      setForm({ id_solicitud: "", id_equipo: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setForm({ id_solicitud: "", id_equipo: "" });
  };

  const guardar = async () => {
    if (!form.id_solicitud || !form.id_equipo) {
      Swal.fire("Atención", "Selecciona una solicitud y un equipo", "warning");
      return;
    }
    const equipoSeleccionado = equipos.find(e => e.id_equipo == form.id_equipo);
    if (equipoSeleccionado?.ultimoEstado !== 'disponible') {
      Swal.fire("No permitido", "Solo puedes asignar equipos disponibles", "warning");
      return;
    }
    try {
      if (editando) {
        await apiAxios.put(`/api/solicitudxequipo/${editando}`, form, { headers });
        Swal.fire("¡Actualizado!", "Registro actualizado", "success");
      } else {
        await apiAxios.post("/api/solicitudxequipo", form, { headers });
        Swal.fire("¡Creado!", "Equipo agregado a la solicitud", "success");
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'disponible':    return 'bg-success';
      case 'mantenimiento': return 'bg-warning text-dark';
      case 'no disponible': return 'bg-danger';
      default:              return 'bg-secondary';
    }
  };

  const columns = [
    { name: "ID", selector: r => r.id_solicitudxequipo, sortable: true },
    { name: "Solicitante", selector: r => r.solicitud?.usuario?.nombres_apellidos || "-", sortable: true },
    { name: "Fecha Inicio", selector: r => r.solicitud?.fecha_inicio?.slice(0, 10) || "-", sortable: true },
    { name: "Fecha Fin", selector: r => r.solicitud?.fecha_fin?.slice(0, 10) || "-", sortable: true },
    { name: "Equipo", selector: r => r.equipo?.nom_equipo || "-", sortable: true },
    { name: "Marca", selector: r => r.equipo?.marca_equipo || "-", sortable: true },
    { name: "No. Placa", selector: r => r.equipo?.no_placa || "-", sortable: true },
    {
      name: "Estado Equipo",
      center: true,
      cell: r => {
        const eq = equipos.find(e => e.id_equipo === r.id_equipo);
        const estado = eq?.ultimoEstado || "-";
        return (
          <span className={`badge ${getBadgeEstado(estado)}`} style={{ fontSize: "0.75rem" }}>
            {estado}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      center: true,
      cell: r => (
        <button className="btn btn-sm btn-warning" onClick={() => abrirModal(r)} title="Editar">
          <i className="fas fa-edit"></i>
        </button>
      )
    }
  ];

  const filtered = registros.filter(r =>
    [r.solicitud?.usuario?.nombres_apellidos, r.equipo?.nom_equipo, r.equipo?.no_placa]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

  const equipoSeleccionado = equipos.find(e => e.id_equipo == form.id_equipo);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Solicitudes por Equipo</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input type="text" className="form-control"
            placeholder="Buscar por solicitante, equipo o placa..."
            value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-primary" onClick={cargarDatos}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <i className="fas fa-plus me-2"></i>Nuevo Registro
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
  noDataComponent="No hay registros"
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
                  {editando ? "Editar Registro" : "Agregar Equipo a Solicitud"}
                </h5>
                <button className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Solicitud</label>
                  <select className="form-select" value={form.id_solicitud}
                    onChange={e => setForm({ ...form, id_solicitud: e.target.value })}>
                    <option value="">-- Selecciona una solicitud --</option>
                    {solicitudes.map(s => (
                      <option key={s.id_solicitud} value={s.id_solicitud}>
                        #{s.id_solicitud} — {s.usuario?.nombres_apellidos || "Sin usuario"} ({s.fecha_inicio?.slice(0, 10)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Equipo</label>
                  <select className="form-select" value={form.id_equipo}
                    onChange={e => setForm({ ...form, id_equipo: e.target.value })}>
                    <option value="">-- Selecciona un equipo --</option>
                    {equipos.map(e => (
                      <option
                        key={e.id_equipo}
                        value={e.id_equipo}
                        disabled={e.ultimoEstado !== 'disponible'}
                        style={e.ultimoEstado !== 'disponible' ? { color: '#aaa' } : {}}
                      >
                        {e.nom_equipo} — {e.marca_equipo || "Sin marca"} ({e.no_placa || "Sin placa"})
                        {e.ultimoEstado === 'mantenimiento' ? ' ⚠️ En mantenimiento' : ''}
                        {e.ultimoEstado === 'no disponible' ? ' 🚫 No disponible' : ''}
                      </option>
                    ))}
                  </select>

                  {form.id_equipo && equipoSeleccionado?.ultimoEstado !== 'disponible' && (
                    <div className={`alert mt-2 py-1 small ${equipoSeleccionado?.ultimoEstado === 'mantenimiento' ? 'alert-warning' : 'alert-danger'}`}>
                      {equipoSeleccionado?.ultimoEstado === 'mantenimiento'
                        ? '⚠️ Este equipo está en mantenimiento'
                        : '🚫 Este equipo no está disponible'}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardar}>
                  <i className="fas fa-save me-2"></i>{editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}