import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ConsumosReactivosForm from "./ConsumosReactivosForm.jsx";

const Crudconsumoreactivo = () => {
  const [consumoreactivo, setconsumoreactivo] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedconsumo, setSelectedconsumo] = useState(null);

  const customStyles = {
    table: {
      style: {
        margin: "0 auto",
        width: "fit-content",
      },
    },
  };

  const columnsTable = [
    { name: "ID Consumo", selector: (row) => row.id_consumo_reactivos, sortable: true, width: "130px"},
    { name: "ID Reactivo", selector: (row) => row.id_reactivo, sortable: true, width: "130px"},
    { name: "ID Lote", selector: (row) => row.id_lote, sortable: true, width: "130px"},
    { name: "Cantidad", selector: (row) => row.cantidad, sortable: true, width: "130px"},
    { name: "ID Responsable", selector: (row) => row.id_responsable, sortable: true, width: "150px"},

    {
      name: "Estado",
      width: "130px",
      cell: (row) => (
        <div className="text-center w-100">
          <span
            className={`px-3 py-1 rounded-pill text-white fw-semibold ${
              row.estado === 1 ? "bg-success" : "bg-danger"
            }`}
            style={{ fontSize: "0.75rem" }}
          >
            {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
          </span>
        </div>
      ),
    },

    {
      name: "Acciones",
      width: "160px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setSelectedconsumo(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className={`btn btn-sm ${
              row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"
            }`}
            onClick={() => toggleEstado(row.id_consumo_reactivos, row.estado)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllconsumoreactivo();
  }, []);

  const getAllconsumoreactivo = async () => {
    try {
      const response = await apiAxios.get("/api/consumoreactivo");
      console.log("REGISTROS CARGADOS DESDE EL BACKEND:", response.data);
      setconsumoreactivo(response.data);
    } catch (error) {
      console.error("ERROR AL CARGAR CONSUMOS:", error.response || error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "¿Cambiar estado?",  // ← CORREGIDO: QUITÉ EL "8" QUE ESTABA PEGADO
      text: `¿${nuevoEstado === 1 ? "Activar" : "Inactivar"} este consumo?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/consumoreactivo/estado/${id}`);

      setconsumoreactivo((prev) =>
        prev.map((item) =>
          item.id_consumo_reactivos === id ? { ...item, estado: nuevoEstado } : item
        )
      );

      console.log(`ESTADO CAMBIADO → ID: ${id} | Nuevo estado: ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`);

      Swal.fire({
        icon: "success",
        title: "¡Perfecto!",
        text: `Consumo ${nuevoEstado === 1 ? "activado" : "inactivado"}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("ERROR AL CAMBIAR ESTADO:", error.response || error);
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filteredData = consumoreactivo.filter((item) =>
    item.id_consumo_reactivos.toString().includes(filterText)
  );

  const handleAfterSave = () => {
    console.log("CONSUMO GUARDADO/ACTUALIZADO → Recargando datos...");
    getAllconsumoreactivo();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 text-primary fw-bold display-5">
        Control de Consumos de Reactivos
      </h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID consumo..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success btn-lg"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setSelectedconsumo(null)}
          >
            + Nuevo Consumo
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div style={{ width: "fit-content", minWidth: "950px" }}>
          <DataTable
            columns={columnsTable}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            responsive
            noDataComponent="No hay consumos registrados"
            paginationPerPage={10}
            customStyles={customStyles}
          />
        </div>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedconsumo ? "Editar" : "Nuevo"} Consumo de Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <ConsumosReactivosForm
                selectedconsumo={selectedconsumo}
                refreshData={handleAfterSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crudconsumoreactivo;