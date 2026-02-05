import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ProveedorFrom from "./ProveedorFrom.jsx";

const Crudproveedor = () => {
    const [proveedor, setProveedor] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        cargarProveedor();
    }, []);

    const cargarProveedor = async () => {
        try {
            const { data } = await apiAxios.get("/api/proveedor");
            setProveedor(data);
        } catch (error) {
            console.error("Error cargando proveedor", error);
        }
    };

    const abrirModal = (proveedor = null) => {
        setSelectedProveedor(proveedor);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setSelectedProveedor(null);
        setShowModal(false);
    };

    const eliminarProveedor = async (id) => {
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
            await apiAxios.delete(`/api/proveedor/${id}`);
            setProveedor(proveedor.filter(p => p.id_proveedor !== id));
            Swal.fire("Eliminado", "El proveedor fue eliminado", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const columnas = [
        { name: "Id", selector: row => row.id_proveedor },
        { name: "Nombre", selector: row => row.nom_proveedor },
        { name: "Apellido", selector: row => row.apel_proveedor },
        { name: "Teléfono", selector: row => row.tel_proveedor },
        { name: "Dirección", selector: row => row.dir_proveedor },
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
                        onClick={() => eliminarProveedor(row.id_proveedor)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            )
        }
    ];

    const listaFiltrada = proveedor.filter(p =>
        p.nom_proveedor.toLowerCase().includes(filterText.toLowerCase())
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
                    Registrar Proveedor
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
                <ProveedorFrom
                    selectedProveedor={selectedProveedor}
                    onSubmit={() => {
                        cargarProveedor();
                        cerrarModal();
                    }}
                    onCancel={cerrarModal}
                />
            )}
        </div>
    );
};

export default Crudproveedor;
