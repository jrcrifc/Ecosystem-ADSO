import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";

const ProveedorForm = ({ selectedProveedor, refreshData }) => {
    const [form, setForm] = useState({
        nom_proveedor: "",
        apel_proveedor: "",
        tel_proveedor: "",
        dir_proveedor: "",
    });

    useEffect(() => {
        if (selectedProveedor) {
            setForm({
                nom_proveedor: selectedProveedor.nom_proveedor || "",
                apel_proveedor: selectedProveedor.apel_proveedor || "",
                tel_proveedor: selectedProveedor.tel_proveedor || "",
                dir_proveedor: selectedProveedor.dir_proveedor || "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nom_proveedor || !form.apel_proveedor || !form.tel_proveedor || !form.dir_proveedor) {
            Swal.fire("Campos obligatorios", "Todos los campos son requeridos", "warning");
            return;
        }

        try {
            if (selectedProveedor) {
                await apiAxios.put(`/api/proveedor/${selectedProveedor.id_proveedor}`, form);
                Swal.fire("Actualizado", "Proveedor modificado correctamente", "success");
            } else {
                await apiAxios.post("/api/proveedor", form);
                Swal.fire("Registrado", "Proveedor creado correctamente", "success");
            }

            refreshData();

            // Cerrar modal Bootstrap
            const modal = document.getElementById("modalProveedor");
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal?.hide();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "No se pudo guardar el proveedor";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Nombre</label>
                    <input
                        type="text"
                        name="nom_proveedor"
                        className="form-control form-control-sm"
                        value={form.nom_proveedor}
                        onChange={handleChange}
                        placeholder="Ej: Carlos"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Apellido</label>
                    <input
                        type="text"
                        name="apel_proveedor"
                        className="form-control form-control-sm"
                        value={form.apel_proveedor}
                        onChange={handleChange}
                        placeholder="Ej: Rodríguez"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Teléfono</label>
                    <input
                        type="tel"
                        name="tel_proveedor"
                        className="form-control form-control-sm"
                        value={form.tel_proveedor}
                        onChange={handleChange}
                        placeholder="Ej: 3001234567"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Dirección</label>
                    <input
                        type="text"
                        name="dir_proveedor"
                        className="form-control form-control-sm"
                        value={form.dir_proveedor}
                        onChange={handleChange}
                        placeholder="Ej: Calle 10 # 5-20"
                        required
                    />
                </div>

                <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary w-100">
                        {selectedProveedor ? "Actualizar Proveedor" : "Registrar Proveedor"}
                    </button>
                </div>

            </div>
        </form>
    );
};

export default ProveedorForm;