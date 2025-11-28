import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import EquipoForm from "./EquipoForm";

export default function CrudEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState(null);

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const res = await apiAxios.get("api/equipo");
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  };

  const hideModal = () => {
    document.getElementById("closeModalEquipo").click();
    getAllEquipos();
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_equipo, sortable: true },
    { name: "Fecha Inventario", selector: (row) => row.fech_inventario },
    { name: "Grupo", selector: (row) => row.grupo_equipo },
    { name: "Nombre", selector: (row) => row.nom_equipo },
    { name: "Marca", selector: (row) => row.marca_equipo },
    { name: "Cantidad", selector: (row) => row.cantidad_equipo },
    { name: "Placa", selector: (row) => row.no_placa },
    { name: "Cuentadante", selector: (row) => row.nom_cuentadante },
    { name: "Observaciones", selector: (row) => row.observaciones },
    { name: "Foto", selector: (row) => row.foto_equipo },
    {
      name: "Acciones",
      selector: (row) => (
        <button
          className="btn btn-sm bg-info"
          data-bs-toggle="modal"
          data-bs-target="#modalEquipo"
          onClick={() => setSelectedEquipo(row)}
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      ),
    },
  ];

  const filteredEquipos = equipos.filter((r) =>
    r.nom_equipo?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Equipos</h2>

      <div className="row d-flex justify-content-between mb-4">
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="col-2">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(null)}
          >
            Nuevo
          </button>
        </div>
      </div>

      <DataTable
        title="Listado de Equipos"
        columns={columns}
        data={filteredEquipos}
        pagination
        highlightOnHover
        striped
      />

      {/* MODAL */}
      <div className="modal fade" id="modalEquipo" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedEquipo ? "Editar Equipo" : "Nuevo Equipo"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalEquipo"
              ></button>
            </div>
            <div className="modal-body">
              <EquipoForm hideModal={hideModal} selectedEquipo={selectedEquipo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
