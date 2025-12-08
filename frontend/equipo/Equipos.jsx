import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import equipoService from "../../node/Service/equipoService";

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");

  // Cargar datos desde backend
  const cargarEquipos = async () => {
    try {
      const data = await equipoService.getEquipos(); 
      setEquipos(data); // debe ser un array ✔
    } catch (error) {
      console.error("Error al cargar equipos", error);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  // Filtrar por nombre del equipo, marca, cuenta o documento
  const filteredData = equipos.filter((item) =>
    item.nom_equipo?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.marca_equipo?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.nom_cuentadante?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.id_equipo?.toString().includes(filterText)
  );

  // Columnas de la tabla
  const columns = [
    { name: "ID", selector: (row) => row.id_equipo, sortable: true },
    { name: "Nombre Equipo", selector: (row) => row.nom_equipo, sortable: true },
    { name: "Marca", selector: (row) => row.marca_equipo, sortable: true },
    { name: "Cantidad", selector: (row) => row.cantidad_equipo, sortable: true },
    { name: "Cuentadante", selector: (row) => row.nom_cuentadante },
    { name: "Placa", selector: (row) => row.no_placa },
  ];

  return (
    <div className="container mt-4">
      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar equipo..."
        className="form-control mb-3"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <h4>Equipos</h4>

      {/* TABLA */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
      />
    </div>
  );
}
