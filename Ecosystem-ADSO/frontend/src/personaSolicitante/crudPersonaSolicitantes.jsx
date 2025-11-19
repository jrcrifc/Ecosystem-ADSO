import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import PersonaSolicitantesForm from "./PersonaSolicitantesForm.jsx";


const CrudPersonaSolicitante = () => {
  const [personaSolicitante, setPersonaSolicitante] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(null);
  //  Definición de columnas de la tabla
  const columnsTable = [
    { name: "documento", selector: (row) => row.Documento, sortable: true },
    { name: "nombre", selector: (row) => row.Nombres, sortable: true },
     { name: "apellido", selector: (row) => row.Apellido, sortable: true },
     { name: "numero_telefono", selector: (row) => row.Telefono },
    { name: "correo_responsable", selector: (row) => row.Correo },
   

    {name: "Acciones", selector: row => (
      <button className="btn btn-sm bg-info" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setSelectedPersona(row)}>
        <i className="fa-solid fa-pencil"></i></button>
     ),
   },
  ];

  useEffect(() => {
    getAllPersonaSolicitante();
  }, []);

  const getAllPersonaSolicitante = async () => {
    try {
      const response = await apiAxios.get("api/personaSolicitante");
      setPersonaSolicitante(response.data);
    } catch (error) {
      console.error("Error al obtener los solicitantes:", error);
    }
  };

 
  const newListPersonaSolicitante = personaSolicitante.filter((persona) => {
    const textToSearch = filterText.toLowerCase();
    const nombres = persona.Nombres ? persona.Nombres.toLowerCase() : "";

    return nombres.includes(textToSearch);
  });
      const hideModal = () => {
        document.getElementById('closeModal').click()
      }

  return (
    <>

      <div className="container mt-5">
        <h1 className="text-center mb-4">
          Bienvenidos a mi Página Web de Ecosystem
        </h1>
        <div className="row d-flex justify-content-between" >
          <div className="col-4">
            <input type="text"placeholder="Buscar por nombre..."className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}

            />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal" onClick={() => setSelectedPersona(null)}
>                Nuevo
            </button>
          </div>
        </div>

        <DataTable
          title="Personas Solicitantes"
          columns={columnsTable}
          data={newListPersonaSolicitante}
          keyField="id_persona_solicitante"
          pagination
          highlightOnHover
          striped
          responsive
        />


        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Tabla de Personas a solicitantes</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <PersonaSolicitantesForm hideModal={hideModal} selectedPersona={selectedPersona} />
               </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudPersonaSolicitante;
