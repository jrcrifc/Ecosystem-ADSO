<<<<<<< HEAD
import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import IngresoReactivoForm from "./movimientoreactivoform.jsx";

const CrudmovimientoReactivo = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_movimiento_reactivo,
      sortable: true,
      width: "80px",
    },
    {
      name: "Reactivo",
      selector: (row) => row.reactivo?.nom_reactivo ?? "—",
      sortable: true,
      width: "180px",
    },
    {
      name: "Cant. Inicial",
      selector: (row) => row.cantidad_inicial,
      sortable: true,
      width: "130px",
    },
    {
      name: "Lote",
      selector: (row) => row.lote,
      sortable: true,
      width: "140px",
    },
    {
      name: "Proveedor",
      selector: (row) =>
        row.proveedor
          ? `${row.proveedor.nom_proveedor} ${row.proveedor.apel_proveedor}`
          : "—",
      sortable: true,
      width: "180px",
    },
    {
      name: "Cant. Salida",
      selector: (row) => row.cantidad_salida,
      sortable: true,
      width: "130px",
    },
    {
      name: "Fecha Ingreso",
      selector: (row) => row.fecha_ingreso?.slice(0, 10),
      sortable: true,
      width: "140px",
    },
    {
      name: "Estado",
      selector: (row) => row.estado_inventario,
      sortable: true,
      width: "130px",
      cell: (row) => (
        <span
          className={`badge ${
            row.estado_inventario === "en stock" ? "bg-success" : "bg-danger"
          }`}
          style={{ fontSize: "0.75rem" }}
        >
          {row.estado_inventario}
        </span>
      ),
=======
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

export default function CrudMovimientoReactivo() {
  const [movimientos, setMovimientos] = useState([]);
  const [reactivos, setReactivos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    id_reactivo: "", id_proveedor: "", lote: "",
    cantidad_inicial: "", cantidad_salida: "", fecha_ingreso: ""
  });
  const [tipo, setTipo] = useState("entrada"); // "entrada" o "salida"

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [movs, reacs, provs] = await Promise.all([
        apiAxios.get("/api/movimientos", { headers }),
        apiAxios.get("/api/reactivos", { headers }),
        apiAxios.get("/api/proveedor", { headers }),
      ]);
      setMovimientos(movs.data);
      setReactivos(reacs.data);
      setProveedores(provs.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const abrirModal = (mov = null) => {
    if (mov) {
      setEditando(mov.id_movimiento_reactivo);
      setTipo(mov.cantidad_inicial ? "entrada" : "salida");
      setForm({
        id_reactivo: mov.id_reactivo,
        id_proveedor: mov.id_proveedor || "",
        lote: mov.lote || "",
        cantidad_inicial: mov.cantidad_inicial || "",
        cantidad_salida: mov.cantidad_salida || "",
        fecha_ingreso: mov.fecha_ingreso?.slice(0, 10) || ""
      });
    } else {
      setEditando(null);
      setTipo("entrada");
      setForm({ id_reactivo: "", id_proveedor: "", lote: "", cantidad_inicial: "", cantidad_salida: "", fecha_ingreso: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const guardar = async () => {
    if (!form.id_reactivo) {
      Swal.fire("Atención", "Selecciona un reactivo", "warning");
      return;
    }
    const cantidad = tipo === "entrada" ? parseFloat(form.cantidad_inicial) : parseFloat(form.cantidad_salida);
    if (!cantidad || cantidad <= 0) {
      Swal.fire("Atención", "La cantidad debe ser mayor a 0", "warning");
      return;
    }

    const data = {
      id_reactivo: form.id_reactivo,
      id_proveedor: form.id_proveedor || null,
      lote: form.lote || null,
      fecha_ingreso: form.fecha_ingreso || null,
      cantidad_inicial: tipo === "entrada" ? cantidad : null,
      cantidad_salida: tipo === "salida" ? cantidad : null,
    };

    try {
      if (editando) {
        await apiAxios.put(`/api/movimientos/${editando}`, data, { headers });
        Swal.fire("¡Actualizado!", "Movimiento actualizado", "success");
      } else {
        await apiAxios.post("/api/movimientos", data, { headers });
        Swal.fire("¡Registrado!", `${tipo === "entrada" ? "Entrada" : "Salida"} registrada correctamente`, "success");
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar movimiento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/movimientos/${id}`, { headers });
      Swal.fire("Eliminado", "Movimiento eliminado", "success");
      cargarDatos();
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const columns = [
    { name: "ID", selector: r => r.id_movimiento_reactivo, sortable: true },
    { name: "Reactivo", selector: r => r.reactivo?.nom_reactivo || "-", sortable: true },
    { name: "Proveedor", selector: r => r.proveedor ? `${r.proveedor.nom_proveedor} ${r.proveedor.apel_proveedor}` : "-", sortable: true },
    { name: "Lote", selector: r => r.lote || "-", sortable: true },
    { name: "Fecha Ingreso", selector: r => r.fecha_ingreso?.slice(0, 10) || "-", sortable: true },
    {
      name: "Entrada",
      center: true,
      cell: r => r.cantidad_inicial
        ? <span className="badge bg-success">{parseFloat(r.cantidad_inicial).toFixed(3)}</span>
        : <span className="text-muted">-</span>
    },
    {
      name: "Salida",
      center: true,
      cell: r => r.cantidad_salida
        ? <span className="badge bg-danger">{parseFloat(r.cantidad_salida).toFixed(3)}</span>
        : <span className="text-muted">-</span>
    },
  
    {
      name: "Estado",
      center: true,
      cell: r => (
        <span className={`badge ${r.estado_inventario === 'en stock' ? 'bg-success' : 'bg-danger'}`}>
          {r.estado_inventario}
        </span>
      )
>>>>>>> origin/main
    },
    {
      name: "Acciones",
      center: true,
<<<<<<< HEAD
      width: "100px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const res = await apiAxios.get("/api/movimientos");
      setMovimientos(res.data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      Swal.fire(
        "Error",
        "No se pudo cargar los movimientos de los reactivos",
        "error"
      );
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalIngreso");
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = movimientos.filter(
    (item) =>
      `${item.id_movimiento_reactivo || ""}`.includes(filterText) ||
      `${item.reactivo?.nom_reactivo || ""}`
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      `${item.proveedor?.nom_proveedor || ""}`
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      `${item.lote || ""}`.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div
      className="mt-4"
      style={{ maxWidth: "960px", margin: "0 auto", padding: "0 16px" }}
    >
      <h2 className="text-center mb-4 text-primary fw-bold">
        Movimientos de Reactivos
      </h2>
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, reactivo, proveedor o lote..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(null)}
          >
            + Nuevo Ingreso
          </button>
        </div>
      </div>
=======
      cell: r => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-warning" onClick={() => abrirModal(r)} title="Editar">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => eliminar(r.id_movimiento_reactivo)} title="Eliminar">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const filtered = movimientos.filter(r =>
    [r.reactivo?.nom_reactivo, r.lote, r.estado_inventario]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "1100px" }}>
      <h2 className="text-center mb-3 fw-bold text-primary">Movimientos de Reactivos</h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <input type="text" className="form-control"
            placeholder="Buscar por reactivo, lote o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-primary" onClick={cargarDatos}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
          <button className="btn btn-success" onClick={() => abrirModal()}>
            <i className="fas fa-plus me-2"></i>Nuevo Movimiento
          </button>
        </div>
      </div>

>>>>>>> origin/main
      <DataTable
        columns={columns}
        data={filtered}
        pagination
<<<<<<< HEAD
=======
        paginationPerPage={10}
>>>>>>> origin/main
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay movimientos registrados"
<<<<<<< HEAD
        paginationPerPage={10}
      />
      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedMovimiento ? "Editar" : "Nuevo"} Ingreso de Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModal}
              ></button>
            </div>
            <div className="modal-body">
              <IngresoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={cargarMovimientos}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudmovimientoReactivo;
=======
        customStyles={{
          headCells: { style: { justifyContent: "center", fontWeight: "bold" } },
          cells: { style: { justifyContent: "center" } }
        }}
      />

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editando ? "Editar Movimiento" : "Nuevo Movimiento"}
                </h5>
                <button className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">

                {/* Tipo de movimiento */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo de movimiento</label>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn w-50 ${tipo === "entrada" ? "btn-success" : "btn-outline-success"}`}
                      onClick={() => setTipo("entrada")}
                    >
                      <i className="fas fa-arrow-down me-2"></i>Entrada
                    </button>
                    <button
                      className={`btn w-50 ${tipo === "salida" ? "btn-danger" : "btn-outline-danger"}`}
                      onClick={() => setTipo("salida")}
                    >
                      <i className="fas fa-arrow-up me-2"></i>Salida
                    </button>
                  </div>
                </div>

                {/* Reactivo */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Reactivo</label>
                  <select className="form-select" value={form.id_reactivo}
                    onChange={e => setForm({ ...form, id_reactivo: e.target.value })}>
                    <option value="">-- Selecciona un reactivo --</option>
                    {reactivos.map(r => (
                      <option key={r.id_reactivo} value={r.id_reactivo}>
                        {r.nom_reactivo} ({r.presentacion_reactivo})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Cantidad {tipo === "entrada" ? "que entra" : "que sale"}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.001"
                    value={tipo === "entrada" ? form.cantidad_inicial : form.cantidad_salida}
                    onChange={e => setForm({
                      ...form,
                      cantidad_inicial: tipo === "entrada" ? e.target.value : "",
                      cantidad_salida: tipo === "salida" ? e.target.value : ""
                    })}
                  />
                </div>

                {/* Proveedor — solo en entrada */}
                {tipo === "entrada" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Proveedor</label>
                    <select className="form-select" value={form.id_proveedor}
                      onChange={e => setForm({ ...form, id_proveedor: e.target.value })}>
                      <option value="">-- Selecciona un proveedor --</option>
                      {proveedores.map(p => (
                        <option key={p.id_proveedor} value={p.id_proveedor}>
                          {p.nom_proveedor} {p.apel_proveedor}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Lote — solo en entrada */}
                {tipo === "entrada" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Lote</label>
                    <input type="text" className="form-control" value={form.lote}
                      onChange={e => setForm({ ...form, lote: e.target.value })}
                      placeholder="Número de lote" />
                  </div>
                )}

                {/* Fecha */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input type="date" className="form-control" value={form.fecha_ingreso}
                    onChange={e => setForm({ ...form, fecha_ingreso: e.target.value })} />
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button
                  className={`btn ${tipo === "entrada" ? "btn-success" : "btn-danger"}`}
                  onClick={guardar}
                >
                  <i className="fas fa-save me-2"></i>
                  {editando ? "Actualizar" : tipo === "entrada" ? "Registrar Entrada" : "Registrar Salida"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> origin/main
