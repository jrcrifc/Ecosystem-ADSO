import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ResponsableForm from "./responsableFrom.jsx";

const CrudResponsables = () => {
    
    const [responsables, setResponsables] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [selectedResponsable, setSelectedResponsable] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        cargarResponsables();
    }, []);

    const cargarResponsables = async () => {
        try {
            const { data } = await apiAxios.get("/api/responsables");
            setResponsables(data);
        } catch (error) {
            console.error("Error cargando responsables", error);
        }
    };

    const abrirModal = (responsable = null) => {
        setSelectedResponsable(responsable);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setSelectedResponsable(null);
        setShowModal(false);
    };

    const eliminarResponsable = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await apiAxios.delete(`/api/responsables/${id}`);
            setResponsables(responsables.filter(r => r.id_responsable !== id));
            Swal.fire("Eliminado", "El responsable fue eliminado", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const columnas = [
        { name: "ID", selector: row => row.id_responsable },
        { name: "Nombre", selector: row => row.nombre },
        { name: "Apellido", selector: row => row.apellido },
        { name: "Correo", selector: row => row.correo },
        { name: "Teléfono", selector: row => row.numero_telefono },
        { name: "Cargo", selector: row => row.cargo }, 
        { 
            name: "Acciones", 
            cell: row => (
                <div className="d-flex gap-2">

                    
                    <button  className="btn btn-sm btn-primary" 
                        onClick={() => abrirModal(row)}>    
                        <i className="bi bi-pencil-square"></i>          
                    </button>

                    
                    <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => eliminarResponsable(row.id_responsable)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button>

                </div>
            )
        }
    ];

    const listaFiltrada = responsables.filter((r) =>
        (r.nombre + " " + r.apellido + " " + r.cargo)
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">
                <input
                    className="form-control w-50"
                    placeholder="Buscar..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />

                <button className="btn btn-primary" onClick={() => abrirModal()}>
                    Registrar Responsable
                </button>
            </div>

            <DataTable
                columns={columnas}
                data={listaFiltrada}
                pagination
                highlightOnHover
                striped
            />

            {showModal && (
                <ResponsableForm
                    selectedResponsable={selectedResponsable}
                    onSubmit={() => {
                        cargarResponsables();
                        cerrarModal();
                    }}
                    onCancel={cerrarModal}
                />
            )}
        </div>
    );
};

export default CrudResponsables;