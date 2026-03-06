import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ProveedorForm from "./ProveedorFrom.jsx";

const Crudproveedor = () => {
    const [proveedor, setProveedor] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState(null);

    useEffect(() => {
        cargarProveedor();
    }, []);

    const cargarProveedor = async () => {
        try {
            const { data } = await apiAxios.get("/api/proveedor");
            setProveedor(data);
        } catch (error) {
            console.error("Error cargando proveedor", error);
            Swal.fire("Error", "No se pudo cargar los proveedores", "error");
        }
    };

    const eliminarProveedor = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar proveedor?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await apiAxios.delete(`/api/proveedor/${id}`);
            setProveedor(proveedor.filter(p => p.id_proveedor !== id));
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El proveedor fue eliminado correctamente",
                timer: 1800,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const columnas = [
        { name: "ID",        selector: row => row.id_proveedor,   sortable: true, width: "80px" },
        { name: "Nombre",    selector: row => row.nom_proveedor,  sortable: true, width: "160px" },
        { name: "Apellido",  selector: row => row.apel_proveedor, sortable: true, width: "160px" },
        { name: "Teléfono",  selector: row => row.tel_proveedor,  sortable: true, width: "160px" },
        { name: "Dirección", selector: row => row.dir_proveedor,  sortable: true, width: "160px" },
        {
            name: "Acciones",
            center: true,
            width: "120px",
            cell: (row) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn btn-sm btn-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#modalProveedor"
                        onClick={() => setSelectedProveedor(row)}
                        title="Editar"
                    >
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarProveedor(row.id_proveedor)}
                        title="Eliminar"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    const listaFiltrada = proveedor.filter(p =>
        [p.nom_proveedor, p.apel_proveedor, p.tel_proveedor, p.dir_proveedor]
            .some(field => field?.toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <div className="mt-4" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px" }}>
            <h2 className="text-center mb-4 text-primary fw-bold">
                Gestión de Proveedores
            </h2>

            <div className="row mb-3 align-items-center">
                <div className="col-md-7">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, apellido, teléfono o dirección..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
                <div className="col-md-5 text-end">
                    <button
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#modalProveedor"
                        onClick={() => setSelectedProveedor(null)}
                    >
                        + Nuevo Proveedor
                    </button>
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={listaFiltrada}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No hay proveedores registrados"
                paginationPerPage={10}
            />

            {/* MODAL BOOTSTRAP */}
            <div className="modal fade" id="modalProveedor" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">
                                {selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <ProveedorForm
                                selectedProveedor={selectedProveedor}
                                refreshData={cargarProveedor}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Crudproveedor;