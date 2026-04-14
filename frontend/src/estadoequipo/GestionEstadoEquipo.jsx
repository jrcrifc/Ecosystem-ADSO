import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function GestionEstadoEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const mapaEstados = { disponible: 1, "no disponible": 2, mantenimiento: 3 };

  const estadosSiguientes = {
    disponible:      ["no disponible", "mantenimiento"],
    "no disponible": ["disponible", "mantenimiento"],
    mantenimiento:   ["disponible", "no disponible"],
  };

  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':    return 'bg-success';
      case 'no disponible': return 'bg-danger';
      case 'mantenimiento': return 'bg-warning';
      default:              return 'bg-secondary';
    }
  };

  useEffect(() => { cargarEquipos(); }, []);

  const cargarEquipos = async () => {
    try {
      const res = await apiAxios.get("/api/estadoxequipo/ultimos/estados", { headers });
      setEquipos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };

  const cambiarEstado = async (id_equipo, nuevoEstado) => {
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El equipo pasará a "${nuevoEstado.toUpperCase()}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.post("/api/estadoxequipo/cambiarEstado",
        { id_equipo, id_estado_equipo: mapaEstados[nuevoEstado] },
        { headers }
      );
      Swal.fire({ icon: "success", title: "¡Estado actualizado!", timer: 1800, showConfirmButton: false });
      cargarEquipos();
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const columns = [
    { name: "ID", selector: r => r.id_equipo, sortable: true },
    { name: "Equipo", selector: r => r.nom_equipo || "-", sortable: true },
    { name: "Marca", selector: r => r.marca_equipo || "-", sortable: true },
    { name: "No. Placa", selector: r => r.no_placa || "-", sortable: true },
    {
      name: "Estado Actual",
      center: true,
      cell: r => (
        <span className={`badge ${getBadgeColor(r.ultimoEstado)}`} style={{ fontSize: "0.75rem" }}>
          {r.ultimoEstado || "disponible"}
        </span>
      )
    },
    {
      name: "Cambiar Estado",
      center: true,
      cell: r => {
        const estadoActual = r.ultimoEstado || "disponible";
        const siguientes = estadosSiguientes[estadoActual] || [];
        return (
          <div className="d-flex gap-1 flex-wrap justify-content-center align-items-center" style={{ width: "100%" }}>
            {siguientes.map(estado => (
              <button
                key={estado}
                className={`btn btn-sm ${getBadgeColor(estado)} text-white`}
                onClick={() => cambiarEstado(r.id_equipo, estado)}
                style={{ fontSize: "0.7rem" }}
              >
                {estado}
              </button>
            ))}
          </div>
        );
      }
    }
  ];

  const filtered = equipos.filter(r =>
    [r.nom_equipo, r.no_placa, r.ultimoEstado]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

 return (
  <div className="container mt-4 text-center">
    <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Estado de Equipos</h2>
    <div className="row mb-4 align-items-center">
      <div className="col-md-6 text-start">
        <input type="text" className="form-control"
          placeholder="Buscar por nombre, placa o estado..."
          value={filterText} onChange={e => setFilterText(e.target.value)} />
      </div>
      <div className="col-md-6 text-end">
        <button className="btn btn-outline-primary" onClick={cargarEquipos}>
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
      noDataComponent="No hay equipos registrados"
      customStyles={{
        headCells: { style: { justifyContent: "center", fontWeight: "bold" } },
        cells: { style: { justifyContent: "center" } }
      }}
    />
  </div>
);
}