import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
import IngresoReactivoForm from "./movimientoreactivoform.jsx";
import SalidaReactivoForm from "../salidasReactivos/salidareactivoform.jsx";
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";

const CrudmovimientoReactivo = () => {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [selectedSalida, setSelectedSalida] = useState(null);

  const columns = [
    { name: "ID", selector: (row) => row.id_movimiento_reactivo, sortable: true, width: "80px", center: true },
    { name: "Reactivo", selector: (row) => row.reactivo?.nom_reactivo || "-", sortable: true, minWidth: "200px" },
    {
      name: "Cant. Inicial",
      sortable: true,
      minWidth: "180px",
      cell: (row) => (
        <span>
          {parseFloat(parseFloat(row.cantidad_inicial || 0).toFixed(3)).toString()}{" "}
          <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "600" }}>
            {row.reactivo?.presentacion_reactivo || ""}
          </span>
        </span>
      )
    },
    { name: "Lote", selector: (row) => row.lote || "-", sortable: true, minWidth: "150px" },
    { name: "Proveedor", selector: (row) => row.proveedor ? `${row.proveedor.nom_proveedor} ${row.proveedor.apel_proveedor}` : "-", sortable: true, minWidth: "200px" },
    { name: "Vencimiento", selector: (row) => row.fecha_vencimiento?.slice(0, 10) || "-", sortable: true, minWidth: "160px" },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <span style={{
          background: row.estado === 1 ? "#dcfce7" : "#fee2e2",
          color: row.estado === 1 ? "#16a34a" : "#dc2626",
          padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700",
          border: `1px solid ${row.estado === 1 ? "#bbf7d0" : "#fecaca"}`
        }}>
          {row.estado === 1 ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm"
            style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button
            className="btn btn-sm"
            style={{
              background: row.estado === 1 ? "#fee2e2" : "#dcfce7",
              color: row.estado === 1 ? "#dc2626" : "#16a34a",
              border: "none"
            }}
            onClick={() => toggleEstadoMovimiento(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarMovimientos();

    // ✅ Sincronización en tiempo real
    socket.on("movimiento_actualizado", cargarMovimientos);
    socket.on("salida_actualizada", cargarMovimientos);

    // ✅ Event listeners para modales de Bootstrap para limpieza garantizada
    const modalIngreso = document.getElementById("modalIngreso");
    const modalSalida = document.getElementById("modalSalida");

    const cleanupBackdrop = () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };

    const handleIngresoHidden = () => {
      setSelectedMovimiento(null);
      cleanupBackdrop();
    };

    const handleSalidaHidden = () => {
      setSelectedSalida(null);
      cleanupBackdrop();
    };

    if (modalIngreso) {
      modalIngreso.addEventListener("hidden.bs.modal", handleIngresoHidden);
    }
    if (modalSalida) {
      modalSalida.addEventListener("hidden.bs.modal", handleSalidaHidden);
    }

    return () => {
      socket.off("movimiento_actualizado", cargarMovimientos);
      socket.off("salida_actualizada", cargarMovimientos);
      if (modalIngreso) {
        modalIngreso.removeEventListener("hidden.bs.modal", handleIngresoHidden);
      }
      if (modalSalida) {
        modalSalida.removeEventListener("hidden.bs.modal", handleSalidaHidden);
      }
    };
  }, []);

  const cargarMovimientos = async () => {
    try {
      const res = await apiAxios.get("/api/movimientos");
      setMovimientos(res.data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      Swal.fire("Error", "No se pudo cargar los movimientos de los reactivos", "error");
    }
  };

  const toggleEstadoMovimiento = async (movimiento) => {
    const nuevoEstado = movimiento.estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? "ACTIVAR" : "INACTIVAR";
    const result = await Swal.fire({
      title: `¿${accion} Ingreso de Reactivo?`,
      text: nuevoEstado === 0
        ? "Se desactivará este lote de ingreso. Ya no contará en el stock del reactivo ni en el control de inventario."
        : "Se reactivará este lote de ingreso. Volverá a contar en el stock del reactivo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: `Sí, ${accion.toLowerCase()}`,
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;

    try {
      if (nuevoEstado === 0) {
        // Inactivar usando el endpoint existente (DELETE)
        await apiAxios.delete(`/api/movimientos/${movimiento.id_movimiento_reactivo}`);
      } else {
        // Activar: usar PUT para cambiar estado a 1
        await apiAxios.put(`/api/movimientos/${movimiento.id_movimiento_reactivo}`, {
          ...movimiento,
          estado: 1,
          id_reactivo: movimiento.id_reactivo || movimiento.reactivo?.id_reactivo,
          cantidad_inicial: movimiento.cantidad_inicial,
        });
      }

      // ✅ Emitir eventos socket
      socket.emit("movimiento_actualizado");
      socket.emit("salida_actualizada");

      cargarMovimientos();
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "✅ Activado" : "✅ Inactivado",
        text: nuevoEstado === 1
          ? "El movimiento ha sido reactivado y el stock recalculado"
          : "El movimiento ha sido inactivado y el stock recalculado correctamente",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `No se pudo ${accion.toLowerCase()} el movimiento`, "error");
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalIngreso");
    if (modal) {
      const closeBtn = modal.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.click();
      } else {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.hide();
      }
      
      // ✅ Limpieza inmediata para evitar backdrops huérfanos por re-renders rápidos de React
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const hideModalSalida = () => {
    const modal = document.getElementById("modalSalida");
    if (modal) {
      const closeBtn = modal.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.click();
      } else {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.hide();
      }
      
      // ✅ Limpieza inmediata para evitar backdrops huérfanos por re-renders rápidos de React
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = movimientos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_movimiento_reactivo || "").includes(search) ||
      String(item.reactivo?.nom_reactivo || "").toLowerCase().includes(search) ||
      String(item.lote || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Movimientos de Reactivos</h2>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, reactivo o lote..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          <button
            className="btn btn-outline-secondary"
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => navigate("/salidas")}
          >
            📜 Ver Historial de Salidas
          </button>
          <button
            className="btn"
            style={{ background: "#ef4444", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalSalida"
            onClick={() => setSelectedSalida(null)}
          >
            📤 Nueva Salida
          </button>
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(null)}
          >
            + Nuevo Ingreso
          </button>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={1}
          defaultSortAsc={false}
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay movimientos registrados</p>
            </div>
          }
        />
      </div>

      {/* Modal Ingreso */}
      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", border: "none" }}>
              <h5 className="modal-title">
                {selectedMovimiento ? "Editar" : "Nuevo"} Movimiento de Reactivo
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

      {/* Modal Salida */}
      <div className="modal fade" id="modalSalida" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #DC3545, #A4161A)", color: "#fff", border: "none" }}>
              <h5 className="modal-title">Nueva Salida de Reactivo</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModalSalida}
              ></button>
            </div>
            <div className="modal-body">
              <SalidaReactivoForm
                selectedSalida={selectedSalida}
                refreshData={cargarMovimientos}
                hideModal={hideModalSalida}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudmovimientoReactivo;