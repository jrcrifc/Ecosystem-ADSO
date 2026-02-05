import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const ResponsableFrom = ({ selectedResponsable, onSubmit, onCancel }) => {

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        numero_telefono: "",
        cargo: "",
        id_usuario: "",
    });

    useEffect(() => {
        if (selectedResponsable) {
            setForm({
                nombre: selectedResponsable.nombre || "",
                apellido: selectedResponsable.apellido || "",
                correo: selectedResponsable.correo || "",
                numero_telefono: selectedResponsable.numero_telefono || "",
                cargo: selectedResponsable.cargo || "",
                id_usuario: selectedResponsable.id_usuario || "",
            });
        }
    }, [selectedResponsable]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (selectedResponsable) {
                // EDITAR
                response = await apiAxios.put(
                    `/api/responsables/${selectedResponsable.id_responsable}`,
                    form
                );

                Swal.fire("Actualizado", "Responsable actualizado correctamente", "success");
            } else {
                // CREAR
                response = await apiAxios.post("/api/responsables", form);
                Swal.fire("Registrado", "Responsable registrado correctamente", "success");
            }

            onSubmit(response.data);
        } catch (error) {
            Swal.fire("Error", "No se pudo guardar el responsable", "error");
            console.error(error);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {selectedResponsable ? "Editar Responsable" : "Nuevo Responsable"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>

     <form onSubmit={handleSubmit}>
          <div className="modal-body">

        <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" name="nombre"className="form-control" value={form.nombre} onChange={handleChange} required/>
        </div>
        <div className="mb-3">
        <label className="form-label">Apellido</label>                 
        <input type="text" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} require/>
        </div>
        <div className="mb-3">
        <label className="form-label">Correo</label>
        <input type="email" name="correo" className="form-control" value={form.correo} onChange={handleChange} required/>
        </div>
        <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input type="text" name="numero_telefono" className="form-control" value={form.numero_telefono} onChange={handleChange} required/>
        </div>
<div className="mb-3">
  <label className="form-label">Cargo</label>
  <select name="cargo" className="form-control" value={form.cargo} onChange={handleChange} required >
    <option value="">Seleccione una opción</option>
    <option value="instructor">Instructor</option>
    <option value="pasante">Pasante</option>
    <option value="gestor">Gestor</option>
  </select>
</div>
        <div className="mb-3">
        <label className="form-label">ID Usuario</label>
        <input type="text" name="id_usuario" className="form-control" value={form.id_usuario} onChange={handleChange} required />
        </div>
        </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">
        {selectedResponsable ? "Actualizar" : "Guardar"}
        </button>
        </div>
 </form>

    </div>
  </div>
</div>
    );
};

export default ResponsableFrom;
