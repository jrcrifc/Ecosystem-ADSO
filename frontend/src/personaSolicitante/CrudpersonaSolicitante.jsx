import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import PersonaSolicitanteForm from "./PersonaSolicitanteFrom.jsx";

const CrudpersonaSolicitante = () => {

    const [personasSolicitantes, setPersonasSolicitantes] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [selectedPersonaSolicitante, setSelectedPersonaSolicitante] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        cargarPersonaSolicitante();
    }, []);

    const cargarPersonaSolicitante = async () => {
        try {
            const { data } = await apiAxios.get("/api/personaSolicitante");
            setPersonasSolicitantes(data);
        } catch (error) {
            console.error("Error cargando personas solicitantes", error);
        }
    };

    const abrirModal = (persona = null) => {
        setSelectedPersonaSolicitante(persona);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setSelectedPersonaSolicitante(null);
        setShowModal(false);
    };

    const eliminarSolicitante = async (id) => {
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
            await apiAxios.delete(`/api/personaSolicitante/${id}`);
            setPersonasSolicitantes(
                personasSolicitantes.filter(
                    p => p.id_persona_solicitante !== id
                )
            );
            Swal.fire("Eliminado", "La persona solicitante fue eliminada", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const columnas = [
        { name: "Id", selector: row => row.id_persona_solicitante },
        { name: "Nombre", selector: row => row.Nombre },
        { name: "Correo", selector: row => row.Correo },
        { name: "Teléfono", selector: row => row.Telefono },
        { name: "Dirección", selector: row => row.Direccion },
        { name: "Programa", selector: row => row.nom_programa },
        { name: "Ficha", selector: row => row.num_ficha },
        { name: "Usuario", selector: row => row.id_usuario },
        {
            name: "Acciones",
            cell: row => (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => abrirModal(row)}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarSolicitante(row.id_persona_solicitante)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            )
        }
    ];

    const listaFiltrada = personasSolicitantes.filter(p =>
        p.Nombre?.toLowerCase().includes(filterText.toLowerCase())
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
                <button
                    className="btn btn-primary"
                    onClick={() => abrirModal()}
                >
                    Registrar Persona Solicitante
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
                <PersonaSolicitanteForm
                    key={selectedPersonaSolicitante?.id_persona_solicitante || "nuevo"}
                    selectedPersonaSolicitante={selectedPersonaSolicitante}
                    onSubmit={() => {
                        cargarPersonaSolicitante();
                        cerrarModal();
                    }}
                    onCancel={cerrarModal}
                />
            )}
        </div>
    );
};

export default CrudpersonaSolicitante;
