// Vista de gestión de Instructores con CRUD e importación desde Excel
import { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import InstructorForm from "./InstructorForm.jsx";

export default function Instructores() {
  const [instructores, setInstructores] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    cargar();
    const modalInstructor = document.getElementById("modalInstructor");
    const handleHidden = () => {
      setSelectedInstructor(null);
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    if (modalInstructor) {
      modalInstructor.addEventListener("hidden.bs.modal", handleHidden);
    }
    return () => {
      if (modalInstructor) {
        modalInstructor.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);
  useEffect(() => { setPage(1); }, [filterText]);

  const cargar = async () => {
    try {
      const res = await apiAxios.get("/api/instructores");
      setInstructores(res.data);
    } catch { Swal.fire("Error", "No se pudieron cargar los instructores", "error"); }
  };

  // Funciones de SweetAlert eliminadas, se usa InstructorForm
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

  // Ver detalles del instructor
  const handleVerDetalle = (inst) => {
    Swal.fire({
      title: `📋 ${inst.nombres_apellidos}`,
      html: `
        <div style="text-align:left;font-size:14px;color:#334155;line-height:2">
          <p><strong>📄 Documento:</strong> ${inst.documento}</p>
          <p><strong>📧 Email institucional:</strong> ${inst.email || inst.usuario?.email || 'N/A'}</p>
          <p><strong>📞 Teléfono:</strong> ${inst.telefono || 'N/A'}</p>
          <p><strong>🏷️ Vinculación:</strong> ${inst.tipo_vinculacion || 'N/A'}</p>
          <p><strong>🟢 Estado:</strong> ${inst.usuario?.estado === 'aprobado' ? 'Activo' : inst.usuario?.estado || 'N/A'}</p>
        </div>
      `,
      confirmButtonColor: '#0077B6',
      confirmButtonText: 'Cerrar'
    });
  };

  // Alternar estado activo/inactivo del instructor
  const toggleEstado = async (inst) => {
    if (!inst.usuario) {
      Swal.fire("Error", "Este instructor no tiene un usuario asociado para cambiar su estado", "warning");
      return;
    }
    const estadoActual = inst.usuario.estado;
    const nuevoEstado = estadoActual === "aprobado" ? "INACTIVO" : "ACTIVO";
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El instructor pasará a estar ${nuevoEstado}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estadoActual === "aprobado" ? "#dc3545" : "#0077B6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/auth/usuarios/${inst.usuario.id_usuario}/toggle-activo`);
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar el estado", "error");
    }
  };

  // Importar Excel (fuerza rol Instructor)
  const handleImportar = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Instructores desde Excel',
      html: `
        <div style="text-align:left;font-size:14px;color:#475569;line-height:1.5">
          <p>Sube un archivo <strong>.xlsx</strong> o <strong>.xls</strong> con las columnas:</p>
          <ul style="padding-left:20px;font-size:13px">
            <li><strong>documento</strong> (solo números)</li>
            <li><strong>nombres_apellidos</strong> (nombre completo)</li>
            <li><strong>email</strong> (correo único)</li>
            <li><strong>telefono</strong> (opcional)</li>
            <li><strong>tipo_vinculacion</strong> (Planta/Contrato, opcional)</li>
          </ul>
          <p style="font-size:12px;color:#10b981;font-weight:600">El rol se asignará automáticamente como <strong>Instructor</strong></p>
        </div>
      `,
      input: 'file',
      inputAttributes: { accept: '.xlsx,.xls' },
      showCancelButton: true, confirmButtonText: 'Subir archivo', cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6'
    });
    if (!file) return;
    Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('rolForzado', 'Instructor');
    try {
      const res = await apiAxios.post("/api/auth/usuarios/importar-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { creados, omitidos, errores } = res.data.data;
      let html = `<div style="text-align:left;font-size:14px">
        <p style="color:#2e7d32;font-weight:600">✅ Creados: ${creados}</p>
        <p style="color:#64748b">ℹ️ Omitidos: ${omitidos}</p>`;
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

  // Filtrar
  const filtrados = instructores.filter(i => {
    const s = filterText.toLowerCase().trim();
    if (!s) return true;
    return (i.documento || '').toLowerCase().includes(s) ||
      (i.nombres_apellidos || '').toLowerCase().includes(s) ||
      (i.email || i.usuario?.email || '').toLowerCase().includes(s) ||
      (i.telefono || '').toLowerCase().includes(s);
  });

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const paginados = filtrados.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const btnStyle = (bg, color, border) => ({
    background: bg, color, border: border || 'none', borderRadius: '8px',
    padding: '7px 16px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
  });

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>👨‍🏫 Instructores</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Gestiona los instructores del sistema. Crea, edita, elimina o importa desde Excel.</p>

      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por documento, nombre, email, programa..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }} />
        </div>
        <div className="col-md-7 text-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn text-white"
            style={{ background: "#0077B6", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalInstructor"
            onClick={() => setSelectedInstructor(null)}
          >
            ➕ Nuevo Instructor
          </button>
          <button onClick={handleImportar} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
            📥 Importar Excel
          </button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p>No hay instructores registrados</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Documento', 'Nombres y Apellidos', 'Email', 'Teléfono', 'Vinculación', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginados.map(i => (
                <tr key={i.id_instructor} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontSize: '13px' }}>{i.documento}</td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px' }}>{i.nombres_apellidos}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{i.email || i.usuario?.email}</td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px' }}>{i.telefono || '—'}</td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#f0f9ff', color: '#0077B6', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                      {i.tipo_vinculacion || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${i.usuario?.estado === 'aprobado' ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
                      {i.usuario?.estado === 'aprobado' ? "ACTIVO" : (i.usuario?.estado ? i.usuario.estado.toUpperCase() : "INACTIVO")}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleVerDetalle(i)} title="Ver Detalle" className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => setSelectedInstructor(i)} 
                        data-bs-toggle="modal"
                        data-bs-target="#modalInstructor"
                        title="Editar"
                        className="btn btn-sm"
                        style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => toggleEstado(i)} 
                        title={i.usuario?.estado === 'aprobado' ? "Inactivar" : "Activar"} 
                        className="btn btn-sm" 
                        style={{ 
                          background: i.usuario?.estado === 'aprobado' ? "#fee2e2" : "#dcfce7", 
                          color: i.usuario?.estado === 'aprobado' ? "#dc2626" : "#16a34a", 
                          border: "none" 
                        }}
                      >
                        <i className={`fas ${i.usuario?.estado === 'aprobado' ? "fa-ban" : "fa-check"}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: "6px", marginTop: "20px", flexWrap: "wrap", paddingBottom: "20px"
            }}>
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                  background: page === 1 ? "#f1f5f9" : "#fff", cursor: page === 1 ? "default" : "pointer",
                  color: page === 1 ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                }}
              >«</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                  background: page === 1 ? "#f1f5f9" : "#fff", cursor: page === 1 ? "default" : "pointer",
                  color: page === 1 ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                }}
              >‹</button>
              <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", padding: "0 8px" }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                  background: page === totalPages ? "#f1f5f9" : "#fff", cursor: page === totalPages ? "default" : "pointer",
                  color: page === totalPages ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                }}
              >›</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                  background: page === totalPages ? "#f1f5f9" : "#fff", cursor: page === totalPages ? "default" : "pointer",
                  color: page === totalPages ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                }}
              >»</button>
            </div>
          )}
        </div>
      )}
      {/* Modal editar/crear Instructor */}
      <div className="modal fade" id="modalInstructor" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-white" style={{ background: "#023E8A" }}>
              <h5 className="modal-title" style={{ fontWeight: "700" }}>
                {selectedInstructor ? "Editar Instructor" : "Registrar Nuevo Instructor"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalInstructor")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <InstructorForm
                selectedInstructor={selectedInstructor}
                refreshParent={cargar}
                hideModal={() => hideModal("modalInstructor")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
