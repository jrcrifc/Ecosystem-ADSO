import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";

export default function EquipoForm({ hideModal, selectedEquipo }) {
  const [form, setForm] = useState({
    fech_inventario: "",
    grupo_equipo: "",
    nom_equipo: "",
    marca_equipo: "",
    cantidad_equipo: 0,
    no_placa: "",
    nom_cuentadante: "",
    observaciones: "",
    foto_equipo: "",
  });

  useEffect(() => {
    if (selectedEquipo) {
      setForm({
        fech_inventario: selectedEquipo.fech_inventario || "",
        grupo_equipo: selectedEquipo.grupo_equipo || "",
        nom_equipo: selectedEquipo.nom_equipo || "",
        marca_equipo: selectedEquipo.marca_equipo || "",
        cantidad_equipo: selectedEquipo.cantidad_equipo || 0,
        no_placa: selectedEquipo.no_placa || "",
        nom_cuentadante: selectedEquipo.nom_cuentadante || "",
        observaciones: selectedEquipo.observaciones || "",
        foto_equipo: selectedEquipo.foto_equipo || "",
      });
    } else {
      setForm({
        fech_inventario: "",
        grupo_equipo: "",
        nom_equipo: "",
        marca_equipo: "",
        cantidad_equipo: 0,
        no_placa: "",
        nom_cuentadante: "",
        observaciones: "",
        foto_equipo: "",
      });
    }
  }, [selectedEquipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "cantidad_equipo" ? parseInt(value) : value });
  };

  const saveData = async () => {
    try {
      if (selectedEquipo) {
        await apiAxios.put(`api/equipo/${selectedEquipo.id_equipo}`, form);
      } else {
        await apiAxios.post("api/equipo", form);
      }
      hideModal();
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error);
    }
  };

  return (
    <form>
      <div className="mb-3">
        <label>Fecha Inventario</label>
        <input type="date" className="form-control" name="fech_inventario" value={form.fech_inventario} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Grupo Equipo</label>
        <input type="text" className="form-control" name="grupo_equipo" value={form.grupo_equipo} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Nombre Equipo</label>
        <input type="text" className="form-control" name="nom_equipo" value={form.nom_equipo} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Marca Equipo</label>
        <input type="text" className="form-control" name="marca_equipo" value={form.marca_equipo} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Cantidad</label>
        <input type="number" className="form-control" name="cantidad_equipo" value={form.cantidad_equipo} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>No. Placa</label>
        <input type="text" className="form-control" name="no_placa" value={form.no_placa} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Cuentadante</label>
        <input type="text" className="form-control" name="nom_cuentadante" value={form.nom_cuentadante} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Observaciones</label>
        <input type="text" className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Foto (URL)</label>
        <input type="text" className="form-control" name="foto_equipo" value={form.foto_equipo} onChange={handleChange} />
      </div>

      <div className="d-grid">
        <button type="button" className="btn btn-success" onClick={saveData}>
          {selectedEquipo ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
