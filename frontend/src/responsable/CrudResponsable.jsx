import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const CrudResponsable = () => {
  // Estado para los datos de responsables
  const [responsables, setResponsables] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Definición de columnas de la tabla
  const columnsTable = [
    { name: "Documento", selector: (row) => row.Documento, sortable: true },
    { name: "Nombre Completo", selector: (row) => row.Nombres, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Correo Responsable", selector: (row) => row.correoresponsable, sortable: true },
    { name: "Dirección", selector: (row) => row.Direccion, sortable: true },
  ];

  // 🔹 Obtener datos al montar el componente
  useEffect(() => {
    getAllResponsables();  // Renombrado a "responsables"
  }, []);

  // 🔹 Petición GET para obtener los responsables
  const getAllResponsables = async () => {
    setLoading(true); // Establecer estado de carga
    try {
      const response = await apiAxios.get("api/responsables");  // Cambié "personaSolicitante" por "responsables"
      setResponsables(response.data);  // Actualizamos la variable de estado con los datos de los responsables
      console.log("Datos de responsables recibidos:", response.data);
    } catch (error) {
      console.error("Error al obtener los responsables:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // 🔹 Filtrar por nombre
  const filteredResponsables = responsables.filter((responsable) => {
    const textToSearch = filterText.toLowerCase();
    const nombres = responsable.Nombres ? responsable.Nombres.toLowerCase() : "";
    return nombres.includes(textToSearch);
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenidos a mi Página Web de Ecosystem</h1>

      {/* Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="form-control"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Mostrar tabla si los datos están disponibles y no hay error */}
      {loading ? (
        <p>Cargando...</p> // Mensaje de carga mientras esperamos los datos
      ) : (
        <DataTable
          title="Responsables"Ñ
          columns={columnsTable}
          data={filteredResponsables}
          keyField="id_responsable"  // Asegúrate de que este campo exista en tus datos
          pagination
          highlightOnHover
          striped
          responsive
        />Ñ
      )}
    </div>
  );
};
Ñ
