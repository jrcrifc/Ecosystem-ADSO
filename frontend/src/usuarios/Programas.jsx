// Vista de gestión de Programas de Formación con CRUD e importación desde Excel
// Permite al administrador crear, editar, eliminar y buscar programas, además de importar desde archivos Excel
import { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import ProgramaForm from "./ProgramaForm.jsx";

export default function Programas() {
  const [programas, setProgramas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedPrograma, setSelectedPrograma] = useState(null);

  useEffect(() => {
    cargar();
    const modalPrograma = document.getElementById("modalPrograma");
    const handleHidden = () => {
      setSelectedPrograma(null);
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    if (modalPrograma) {
      modalPrograma.addEventListener("hidden.bs.modal", handleHidden);
    }
    return () => {
      if (modalPrograma) {
        modalPrograma.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  // Función asíncrona que obtiene todos los programas desde la API
  const cargar = async () => {
    try {
      const res = await apiAxios.get("/api/programas");
      setProgramas(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los programas", "error");
    }
  };

  // Funciones de SweetAlert eliminadas, se usa ProgramaForm
  const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const closeBtn = modal.querySelector(".btn-close");
      if (closeBtn) closeBtn.click();
      else {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.hide();
      }
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  // Alternar estado activo/inactivo del programa de formación
  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual !== false ? false : true;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El programa pasará a estar ${nuevoEstado ? "ACTIVO" : "INACTIVO"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estadoActual !== false ? "#dc3545" : "#0077B6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      const prog = programas.find(p => p.id_programa === id);
      await apiAxios.put(`/api/programas/${id}`, {
        nombre_programa: prog.nombre_programa,
        estado: nuevoEstado
      });
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar el estado", "error");
    }
  };

  // Función que maneja la importación masiva de programas desde un archivo Excel
  const handleImportar = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Programas desde Excel',
      html: `
        <div style="text-align:left;font-size:14px;color:#475569;line-height:1.5">
          <p>Sube un archivo <strong>.xlsx</strong> o <strong>.xls</strong> con la columna:</p>
          <ul style="padding-left:20px;font-size:13px">
            <li><strong>nombre_programa</strong> (nombre del programa de formación)</li>
          </ul>
          <p style="font-size:12px;color:#8b5cf6;font-weight:600">Los programas duplicados serán omitidos automáticamente</p>
        </div>
      `,
      input: 'file',
      inputAttributes: { accept: '.xlsx,.xls' },
      showCancelButton: true,
      confirmButtonText: 'Subir archivo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6'
    });
    if (!file) return;
    // Muestra loader mientras se procesa
    Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiAxios.post("/api/programas/importar-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { creados, omitidos, errores } = res.data;
      let html = `<div style="text-align:left;font-size:14px">
        <p style="color:#2e7d32;font-weight:600">✅ Creados: ${creados || 0}</p>
        <p style="color:#64748b">ℹ️ Omitidos: ${omitidos || 0}</p>`;
      if (errores?.length > 0) {
        html += `<hr/><p style="color:#c62828;font-weight:bold">⚠️ Errores (${errores.length}):</p>
          <div style="max-height:150px;overflow-y:auto;background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:10px;font-size:11px;font-family:monospace;color:#9f1239">
            ${errores.map(e => `• ${e}`).join('<br/>')}
          </div>`;
      }
      html += '</div>';
      Swal.fire({ title: '¡Importación Finalizada!', html, icon: errores?.length > 0 ? 'warning' : 'success', confirmButtonColor: '#0077B6' });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al importar", "error");
    }
  };

  // Filtra los programas según el texto ingresado en el campo de búsqueda
  const filtrados = programas.filter(p => {
    const s = filterText.toLowerCase().trim();
    if (!s) return true;
    return (p.nombre_programa || '').toLowerCase().includes(s);
  });

  // Función reutilizable para generar estilos de botones
  const btnStyle = (bg, color, border) => ({
    background: bg, color, border: border || 'none', borderRadius: '8px',
    padding: '7px 16px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
  });

  return (
    <div className="container mt-4">
      {/* Encabezado con línea decorativa y título */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>📚 Programas de Formación</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Gestiona los programas de formación del SENA. Crea, edita, elimina o importa desde Excel.</p>

      {/* Barra de búsqueda y botones de acción */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por nombre del programa..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }} />
        </div>
        <div className="col-md-7 text-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn text-white"
            style={{ background: "#0077B6", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalPrograma"
            onClick={() => setSelectedPrograma(null)}
          >
            ➕ Nuevo Programa
          </button>
          <button onClick={handleImportar} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
            📥 Importar Excel
          </button>
        </div>
      </div>

      {/* Tabla de programas o mensaje vacío */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p>No hay programas registrados</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', width: '5%', fontSize: '11px', fontWeight: '700', color: '#64748b' }}>#</th>
                <th style={{ padding: '16px 24px', width: '45%', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>NOMBRE DEL PROGRAMA</th>
                <th style={{ padding: '16px 24px', width: '15%', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>ESTADO</th>
                <th style={{ padding: '16px 24px', width: '20%', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>FICHAS ASOCIADAS</th>
                <th style={{ padding: '16px 24px', width: '15%', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, idx) => (
                <tr key={p.id_programa} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '14px', verticalAlign: 'middle' }}>{idx + 1}</td>
                  <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '14px', fontWeight: '500', verticalAlign: 'middle' }}>{p.nombre_programa}</td>
                  <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                    <span className={`px-3 py-1 rounded-pill fw-semibold ${p.estado !== false ? "text-success" : "text-danger"}`} style={{ fontSize: "12px", background: p.estado !== false ? "#dcfce7" : "#fee2e2" }}>
                      {p.estado !== false ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px', verticalAlign: 'middle' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                      {p.fichas ? p.fichas.length : 0} fichas
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setSelectedPrograma(p)} data-bs-toggle="modal" data-bs-target="#modalPrograma" title="Editar" className="btn btn-sm" style={{ background: "#e0f2fe", color: "#0284c7", border: "none", padding: "6px 10px" }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => toggleEstado(p.id_programa, p.estado)} title={p.estado !== false ? "Inactivar" : "Activar"} className="btn btn-sm" style={{ background: p.estado !== false ? "#fee2e2" : "#dcfce7", color: p.estado !== false ? "#dc2626" : "#16a34a", border: "none", padding: "6px 10px" }}>
                        <i className={`fas ${p.estado !== false ? "fa-ban" : "fa-check"}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal editar/crear Programa */}
      <div className="modal fade" id="modalPrograma" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-white" style={{ background: "#023E8A" }}>
              <h5 className="modal-title" style={{ fontWeight: "700" }}>
                {selectedPrograma ? "Editar Programa" : "Registrar Nuevo Programa"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalPrograma")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ProgramaForm
                selectedPrograma={selectedPrograma}
                refreshParent={cargar}
                hideModal={() => hideModal("modalPrograma")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
