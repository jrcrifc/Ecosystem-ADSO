import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import MovimientoReactivoForm from "./movimientoreactivoform.jsx";

const CrudMovimientoReactivo = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  // 🔥 Obtener datos
  const fetchMovimientos = async () => {
    try {
      const res = await apiAxios.get("/api/estadoSolicitud");
      setMovimientos(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los movimientos", "error");
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  // 🔥 Abrir modal nuevo
  const handleNuevo = () => {
    setSelectedMovimiento(null);
    const modal = new bootstrap.Modal(
      document.getElementById("modalIngreso")
    );
    modal.show();
  };

  // 🔥 Abrir modal editar
  const handleEditar = (movimiento) => {
    setSelectedMovimiento(movimiento);
    const modal = new bootstrap.Modal(
      document.getElementById("modalIngreso")
    );
    modal.show();
  };

  // 🔥 Eliminar
  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await apiAxios.delete(`/api/estadoSolicitud/${id}`);
        Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
        fetchMovimientos();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-primary">Movimientos de Reactivos</h4>
        <button className="btn btn-success" onClick={handleNuevo}>
          + Nuevo Ingreso
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cant. Inicial</th>
              <th>Cant. Salida</th>
              <th>Lote</th>
              <th>Reactivo</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length > 0 ? (
              movimientos.map((mov) => (
                <tr key={mov.id_movimiento_reactivo}>
                  <td>{mov.id_movimiento_reactivo}</td>
                  <td>{mov.fecha_ingreso?.slice(0, 10)}</td>
                  <td>{mov.cantidad_inicial}</td>
                  <td>{mov.cantidad_salida}</td>
                  <td>{mov.lote}</td>
                  <td>{mov.id_reactivo}</td>
                  <td>{mov.id_proveedor || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        mov.estado_inventario === "agotado"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {mov.estado_inventario}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditar(mov)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleEliminar(mov.id_movimiento_reactivo)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      <div
        className="modal fade"
        id="modalIngreso"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedMovimiento
                  ? "Editar Movimiento"
                  : "Nuevo Movimiento"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <MovimientoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={fetchMovimientos}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudMovimientoReactivo;