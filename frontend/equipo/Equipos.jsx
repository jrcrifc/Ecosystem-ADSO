import { useEffect, useState } from "react";

const API_URL = "http://localhost:4001/api/equipos";

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom_equipo: "",
    marca_equipo: "",
    cantidad_equipo: "",
    nom_cuentadante: "",
    no_placa: "",
    fech_inventario: "",
    grupo_equipo: "",
    observaciones: "",
    foto_equipo: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const cargarEquipos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEquipos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      setFormData({
        nom_equipo: "",
        marca_equipo: "",
        cantidad_equipo: "",
        nom_cuentadante: "",
        no_placa: "",
        fech_inventario: "",
        grupo_equipo: "",
        observaciones: "",
        foto_equipo: ""
      });
      setEditingId(null);
      setShowForm(false);
      cargarEquipos();
    } catch {
      alert("Error al guardar equipo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este equipo?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarEquipos();
  };

  const filteredEquipos = equipos.filter(e =>
    e.nom_equipo?.toLowerCase().includes(search.toLowerCase()) ||
    e.marca_equipo?.toLowerCase().includes(search.toLowerCase()) ||
    e.nom_cuentadante?.toLowerCase().includes(search.toLowerCase()) ||
    e.grupo_equipo?.toLowerCase().includes(search.toLowerCase()) ||
    e.observaciones?.toLowerCase().includes(search.toLowerCase()) ||
    e.fech_inventario?.toString().includes(search) ||
    e.id_equipo?.toString().includes(search)
  );

  return (
    <div>
      <h3 className="mb-3">Equipos</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              nom_equipo: "",
              marca_equipo: "",
              cantidad_equipo: "",
              nom_cuentadante: "",
              no_placa: "",
              fech_inventario: "",
              grupo_equipo: "",
              observaciones: "",
              foto_equipo: ""
            });
          }}
        >
          Nuevo Equipo
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="NOMBRE EQUIPO"
                value={formData.nom_equipo}
                onChange={(e) =>
                  setFormData({ ...formData, nom_equipo: e.target.value })
                }
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="MARCA EQUIPO"
                value={formData.marca_equipo}
                onChange={(e) =>
                  setFormData({ ...formData, marca_equipo: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="CANTIDAD EQUIPO"
                value={formData.cantidad_equipo}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad_equipo: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="NOM CUENTADANTE"
                value={formData.nom_cuentadante}
                onChange={(e) =>
                  setFormData({ ...formData, nom_cuentadante: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="NO PLACA"
                value={formData.no_placa}
                onChange={(e) =>
                  setFormData({ ...formData, no_placa: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                placeholder="FECHA INVENTARIO"
                value={formData.fech_inventario?.slice(0,10) || ''}
                onChange={(e) =>
                  setFormData({ ...formData, fech_inventario: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="GRUPO EQUIPO"
                value={formData.grupo_equipo}
                onChange={(e) =>
                  setFormData({ ...formData, grupo_equipo: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="OBSERVACIONES"
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="URL FOTO EQUIPO"
                value={formData.foto_equipo}
                onChange={(e) =>
                  setFormData({ ...formData, foto_equipo: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-success me-2">
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Cantidad</th>
                <th>Cuentadante</th>
                <th>Placa</th>
                <th>Fecha Inv.</th>
                <th>Grupo</th>
                <th>Observaciones</th>
                <th>Foto</th>
                <th>Creado</th>
                <th>Actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipos.map(eq => (
                <tr key={eq.id_equipo}>
                  <td>{eq.id_equipo}</td>
                  <td>{eq.nom_equipo}</td>
                  <td>{eq.marca_equipo}</td>
                  <td>{eq.cantidad_equipo}</td>
                  <td>{eq.nom_cuentadante}</td>
                  <td>{eq.no_placa}</td>
                  <td>{eq.fech_inventario ? eq.fech_inventario.slice(0,10) : ''}</td>
                  <td>{eq.grupo_equipo}</td>
                  <td>{eq.observaciones ? (eq.observaciones.length > 40 ? eq.observaciones.slice(0,40) + '...' : eq.observaciones) : ''}</td>
                  <td>{eq.foto_equipo ? <img src={eq.foto_equipo} alt="foto" width={60} /> : ''}</td>
                  <td>{eq.createdat ? eq.createdat.slice(0,19) : ''}</td>
                  <td>{eq.updatedat ? eq.updatedat.slice(0,19) : ''}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() =>
                        alert(
                          `ID: ${eq.id_equipo}\nNombre: ${eq.nom_equipo}\nPlaca: ${eq.no_placa}`
                        )
                      }
                    >
                      Ver
                    </button>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setFormData({
                          ...eq,
                          fech_inventario: eq.fech_inventario ? eq.fech_inventario.slice(0,10) : '',
                          createdat: eq.createdat,
                          updatedat: eq.updatedat
                        });
                        setEditingId(eq.id_equipo);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(eq.id_equipo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEquipos.length === 0 && !loading && (
        <p className="text-center">Sin datos</p>
      )}
    </div>
  );
}
