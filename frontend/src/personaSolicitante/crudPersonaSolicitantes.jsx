import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const CrudPersonaSolicitante = () => {
  const [personaSolicitante, setPersonaSolicitante] = useState([]);
  const [filterText, setFilterText] = useState("");

  // 🔹 Definición de columnas de la tabla
  const columnsTable = [
    { name: "Documento", selector: (row) => row.Documento, sortable: true },
    { name: "Nombre Completo", selector: (row) => row.Nombres, sortable: true },
    { name: "Correo", selector: (row) => row.Correo },
    { name: "Teléfono", selector: (row) => row.Telefono },
    { name: "Dirección", selector: (row) => row.Direccion },
  ];

  // 🔹 Obtener datos al montar el componente
  useEffect(() => {
    getAllPersonaSolicitante();
  }, []);

  // 🔹 Petición GET corregida (sin repetir "/api")
  const getAllPersonaSolicitante = async () => {
    try {
      const response = await apiAxios.get("api/personaSolicitante");
      setPersonaSolicitante(response.data);
      console.log("Datos recibidos:", response.data);
    } catch (error) {
      console.error("Error al obtener los solicitantes:", error);
    }
  };

  // 🔹 Filtrar por nombre
  const newListPersonaSolicitante = personaSolicitante.filter((persona) => {
    const textToSearch = filterText.toLowerCase();
    const nombres = persona.Nombres ? persona.Nombres.toLowerCase() : "";
    return nombres.includes(textToSearch);
  });

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">
          Bienvenidos a mi Página Web de Ecosystem
        </h1>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
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
      </div>
    </>
  );
};

export default CrudPersonaSolicitante;
