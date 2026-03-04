import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

const ProveedorForm = ({ selectedProveedor, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        nom_proveedor: "",
        apel_proveedor: "",
        tel_proveedor: "",
        dir_proveedor: "",
    });

    useEffect(() => {
        if (selectedProveedor) {
            setForm({
                nom_proveedor: selectedProveedor.nom_proveedor,
                apel_proveedor: selectedProveedor.apel_proveedor,
                tel_proveedor: selectedProveedor.tel_proveedor,
                dir_proveedor: selectedProveedor.dir_proveedor,
            });
        } else {
            setForm({
                nom_proveedor: "",
                apel_proveedor: "",
                tel_proveedor: "",
                dir_proveedor: "",
            });
        }
    }, [selectedProveedor]);

    const handleChange = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedProveedor) {
                await apiAxios.put(
                    `/api/proveedor/${selectedProveedor.id_proveedor}`,
                    form
                );
                Swal.fire("Actualizado", "Proveedor actualizado correctamente", "success");
            } else {
                await apiAxios.post("/api/proveedor", form);
                Swal.fire("Registrado", "Proveedor registrado correctamente", "success");
            }

            onSubmit();
        } catch (error) {
            Swal.fire("Error", "No se pudo guardar el proveedor", "error");
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedProveedor ? "Editar proveedor" : "Registrar proveedor"}
                            </h5>
                            <button type="button" className="btn-close" onClick={onCancel}></button>
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nom_proveedor"
                                        value={form.nom_proveedor}
                                        onChange={handleChange}
                                        placeholder="Ingrese el nombre"
                                        required
                                        minLength={3}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="apel_proveedor"
                                        value={form.apel_proveedor}
                                        onChange={handleChange}
                                        placeholder="Ingrese el apellido"
                                        required
                                        minLength={3}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="tel_proveedor"
                                        value={form.tel_proveedor}
                                        onChange={handleChange}
                                        placeholder="Ej: 3001234567"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="dir_proveedor"
                                        value={form.dir_proveedor}
                                        onChange={handleChange}
                                        placeholder="Ingrese la dirección"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onCancel}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProveedorForm;
