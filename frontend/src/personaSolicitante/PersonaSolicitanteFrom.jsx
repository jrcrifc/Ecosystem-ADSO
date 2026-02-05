import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

const PersonaSolicitanteForm = ({
    selectedPersonaSolicitante,
    onSubmit,
    onCancel
}) => {

    const formInicial = {
        Nombre: "",
        Correo: "",
        Telefono: "",
        Direccion: "",
        nom_programa: "",
        num_ficha: "",
        id_usuario: ""
    };

    const [form, setForm] = useState(formInicial);

    useEffect(() => {
        if (selectedPersonaSolicitante) {
            setForm({
                Nombre: selectedPersonaSolicitante.Nombre || "",
                Correo: selectedPersonaSolicitante.Correo || "",
                Telefono: selectedPersonaSolicitante.Telefono || "",
                Direccion: selectedPersonaSolicitante.Direccion || "",
                nom_programa: selectedPersonaSolicitante.nom_programa || "",
                num_ficha: selectedPersonaSolicitante.num_ficha || "",
                id_usuario: selectedPersonaSolicitante.id_usuario || ""
            });
        } else {
            limpiarFormulario();
        }
    }, [selectedPersonaSolicitante]);

    const limpiarFormulario = () => {
        setForm(formInicial);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedPersonaSolicitante) {
                await apiAxios.put(
                    `/api/personaSolicitante/${selectedPersonaSolicitante.id_persona_solicitante}`,
                    form
                );
                Swal.fire("Actualizado", "Registro actualizado correctamente", "success");
            } else {
                await apiAxios.post("/api/personaSolicitante", form);
                Swal.fire("Registrado", "Registro creado correctamente", "success");
            }

            limpiarFormulario();
            onSubmit();

        } catch (error) {
            Swal.fire("Error", "No se pudo guardar el registro", "error");
        }
    };

    const handleCancelar = () => {
        limpiarFormulario();
        onCancel();
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {selectedPersonaSolicitante
                                ? "Editar Persona Solicitante"
                                : "Registrar Persona Solicitante"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCancelar}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        name="Nombre"
                                        className="form-control"
                                        value={form.Nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Correo</label>
                                    <input
                                        type="email"
                                        name="Correo"
                                        className="form-control"
                                        value={form.Correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        name="Telefono"
                                        className="form-control"
                                        value={form.Telefono}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        name="Direccion"
                                        className="form-control"
                                        value={form.Direccion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Programa</label>
                                    <input
                                        type="text"
                                        name="nom_programa"
                                        className="form-control"
                                        value={form.nom_programa}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Ficha</label>
                                    <input
                                        type="text"
                                        name="num_ficha"
                                        className="form-control"
                                        value={form.num_ficha}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Usuario</label>
                                    <input
                                        type="number"
                                        name="id_usuario"
                                        className="form-control"
                                        value={form.id_usuario}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelar}
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

export default PersonaSolicitanteForm;
