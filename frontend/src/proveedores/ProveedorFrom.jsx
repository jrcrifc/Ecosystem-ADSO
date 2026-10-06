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
        nit_empresa: "",
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
                nit_empresa: selectedProveedor.nit_empresa || "",
                nom_proveedor: selectedProveedor.nom_proveedor || "",
                apel_proveedor: selectedProveedor.apel_proveedor || "",
                tel_proveedor: selectedProveedor.tel_proveedor || "",
                dir_proveedor: selectedProveedor.dir_proveedor || "",
            });
        } else {
            // Resetea el formulario si es una creacion nueva
            setForm({
                nit_empresa: "",
                nom_proveedor: "",
                apel_proveedor: "",
                tel_proveedor: "",
                dir_proveedor: "",
            });
        }
    }, [selectedProveedor]);

    // Manejador de cambios en los campos del formulario con restricción numérica para NIT y Teléfono
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "nit_empresa" || name === "tel_proveedor") {
            const cleanVal = value.replace(/\D/g, "");
            setForm(prev => ({ ...prev, [name]: cleanVal }));
            return;
        }
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
            setForm({ nit_empresa: "", nom_proveedor: "", apel_proveedor: "", tel_proveedor: "", dir_proveedor: "" });

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
        <form onSubmit={handleSubmit} noValidate style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Datos del proveedor */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
                  📝 Datos del Proveedor
                </p>
              </div>

              {/* Campo NIT de empresa */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>NIT de Empresa</label>
                <input type="text" inputMode="numeric" name="nit_empresa" value={form.nit_empresa} onChange={handleChange} placeholder="Ej: 900123456" maxLength={15}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} />
              </div>

              {/* Campo de nombre del proveedor */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nombre</label>
                <input type="text" name="nom_proveedor" value={form.nom_proveedor} onChange={handleChange} placeholder="Ej: Carlos" required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} />
              </div>

              {/* Campo de apellido del proveedor */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Apellido</label>
                <input type="text" name="apel_proveedor" value={form.apel_proveedor} onChange={handleChange} placeholder="Ej: Rodríguez" required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} />
              </div>

              {/* Contacto */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px", marginTop: "4px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
                  📞 Contacto
                </p>
              </div>

              {/* Campo de telefono del proveedor */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Teléfono</label>
                <input type="tel" inputMode="numeric" name="tel_proveedor" value={form.tel_proveedor} onChange={handleChange} placeholder="Ej: 3001234567" maxLength={10} required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} />
              </div>

              {/* Campo de direccion del proveedor */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Dirección</label>
                <input type="text" name="dir_proveedor" value={form.dir_proveedor} onChange={handleChange} placeholder="Ej: Calle 10 # 5-20" required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} />
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="button" onClick={hideModal}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                  Cancelar
                </button>
                <button type="submit"
                  style={{ flex: 2, padding: "8px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                  {selectedProveedor ? "✅ Actualizar Proveedor" : "✅ Registrar Proveedor"}
                </button>
              </div>
        </form>
    );
};

// Exporta el componente para su uso en otras partes de la aplicacion
export default ProveedorForm;
