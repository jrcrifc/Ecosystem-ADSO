// Archivo de formulario de creacion/edicion de proveedores

// Importa los hooks de React para manejar estado y efectos secundarios
import { useEffect, useState } from "react";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa Bootstrap para manejar modales de forma programatica
import * as bootstrap from "bootstrap";

// Define el componente de formulario que recibe props para editar o crear proveedores
const ProveedorForm = ({ selectedProveedor, refreshData, hideModal }) => {
    // Estado local del formulario con los campos del proveedor
    const [form, setForm] = useState({
        nom_proveedor: "",
        apel_proveedor: "",
        tel_proveedor: "",
        dir_proveedor: "",
    });

    // Efecto que carga los datos del proveedor al editar o resetea el formulario
    useEffect(() => {
        // Verifica si hay un proveedor seleccionado para editar
        if (selectedProveedor) {
            // Asigna los valores del proveedor existente al formulario
            setForm({
                nom_proveedor: selectedProveedor.nom_proveedor || "",
                apel_proveedor: selectedProveedor.apel_proveedor || "",
                tel_proveedor: selectedProveedor.tel_proveedor || "",
                dir_proveedor: selectedProveedor.dir_proveedor || "",
            });
        } else {
            // Resetea el formulario si es una creacion nueva
            setForm({
                nom_proveedor: "",
                apel_proveedor: "",
                tel_proveedor: "",
                dir_proveedor: "",
            });
        }
    }, [selectedProveedor]);

    // Manejador de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Actualiza solo el campo modificado manteniendo los demas
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ===== Guardar (crear o actualizar) proveedor =====

    // Manejador del envio del formulario para crear o actualizar un proveedor
    const handleSubmit = async (e) => {
        // Previene la recarga de la pagina al enviar el formulario
        e.preventDefault();

        // Valida que todos los campos obligatorios esten completos
        if (!form.nom_proveedor || !form.apel_proveedor || !form.tel_proveedor || !form.dir_proveedor) {
            Swal.fire("Campos obligatorios", "Todos los campos son requeridos", "warning");
            return;
        }

        try {
            // Verifica si se esta editando un proveedor existente
            if (selectedProveedor) {
                // Envia peticion PUT para actualizar el proveedor
                await apiAxios.put(`/api/proveedor/${selectedProveedor.id_proveedor}`, form);
                Swal.fire({ icon: "success", title: "Actualizado", text: "Proveedor modificado correctamente", timer: 1500, showConfirmButton: false });
            } else {
                // Envia peticion POST para crear un nuevo proveedor
                await apiAxios.post("/api/proveedor", form);
                Swal.fire({ icon: "success", title: "Registrado", text: "Proveedor creado correctamente", timer: 1500, showConfirmButton: false });
            }

            // Limpia el formulario despues de guardar
            setForm({ nom_proveedor: "", apel_proveedor: "", tel_proveedor: "", dir_proveedor: "" });

            // Refresca la tabla de datos y cierra el modal
            refreshData();
            if (hideModal) hideModal();
        } catch (err) {
            // Muestra error en consola si falla la operacion
            console.error(err);
            // Obtiene el mensaje de error del servidor o uno generico
            const msg = err.response?.data?.message || "No se pudo guardar el proveedor";
            // Muestra alerta de error al usuario
            Swal.fire("Error", msg, "error");
        }
    };

    // Renderiza el formulario
    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">

                {/* Campo de nombre del proveedor */}
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

                {/* Campo de apellido del proveedor */}
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

                {/* Campo de telefono del proveedor */}
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

                {/* Campo de direccion del proveedor */}
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

                {/* Boton de envio que cambia su texto segun sea crear o editar */}
                <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary w-100">
                        {selectedProveedor ? "Actualizar Proveedor" : "Registrar Proveedor"}
                    </button>
                </div>

            </div>
        </form>
    );
};

// Exporta el componente para su uso en otras partes de la aplicacion
export default ProveedorForm;
