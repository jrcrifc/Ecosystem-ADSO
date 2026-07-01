// Vista de gestión de Aprendices con CRUD e importación desde Excel
import { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import AprendizForm from "./AprendizForm.jsx";

export default function Aprendices() {
  const [aprendices, setAprendices] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedAprendiz, setSelectedAprendiz] = useState(null);

  useEffect(() => {
    cargar();
    cargarFichas();
    const modalAprendiz = document.getElementById("modalAprendiz");
    const handleHidden = () => {
      setSelectedAprendiz(null);
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    if (modalAprendiz) {
      modalAprendiz.addEventListener("hidden.bs.modal", handleHidden);
    }
    return () => {
      if (modalAprendiz) {
        modalAprendiz.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  const cargar = async () => {
    try {
      const res = await apiAxios.get("/api/aprendices");
      setAprendices(res.data);
    } catch { Swal.fire("Error", "No se pudieron cargar los aprendices", "error"); }
  };

  const cargarFichas = async () => {
    try {
      const res = await apiAxios.get("/api/fichas");
      setFichas(res.data);
    } catch { console.error("Error cargando fichas"); }
  };

  // Funciones de SweetAlert eliminadas, se usa AprendizForm
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

  // Ver detalles completos del aprendiz
  const handleVerDetalle = (a) => {
    Swal.fire({
      title: `📋 ${a.nombres_apellidos}`,
      width: 550,
      html: `
        <div style="text-align:left;font-size:13px;color:#334155;line-height:1.8">
          <p style="font-weight:700;color:#0077B6;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📝 Datos Básicos</p>
          <p><strong>📄 Documento:</strong> ${a.tipo_documento ? a.tipo_documento + ' ' : ''}${a.documento}</p>
          <p><strong>📧 Email:</strong> ${a.email || a.usuario?.email || 'N/A'}</p>
          <p><strong>📋 Ficha:</strong> ${a.ficha?.numero_ficha || 'Sin ficha'} ${a.ficha?.programa ? ' - ' + a.ficha.programa.nombre_programa : ''}</p>
          <p><strong>📅 Lectiva:</strong> ${a.ficha?.fecha_inicio && a.ficha?.fecha_fin ? `${a.ficha.fecha_inicio} a ${a.ficha.fecha_fin}` : 'No definida'}</p>
          
          <p style="font-weight:700;color:#0077B6;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:12px">📋 Información Personal</p>
          <p><strong>🎂 Nacimiento:</strong> ${a.fecha_nacimiento || 'N/A'}</p>
          <p><strong>👤 Género:</strong> ${a.genero || 'N/A'}</p>
          <p><strong>💍 Estado civil:</strong> ${a.estado_civil || 'N/A'}</p>
          <p><strong>🏷️ Tipo aprendiz:</strong> ${a.tipo_aprendiz || 'N/A'}</p>
          
          <p style="font-weight:700;color:#0077B6;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:12px">📍 Ubicación y Contacto</p>
          <p><strong>🏠 Dirección:</strong> ${a.direccion || 'N/A'} ${a.tipo_direccion ? '(' + a.tipo_direccion + ')' : ''}</p>
          <p><strong>📞 Teléfono:</strong> ${a.telefono || 'N/A'}</p>
          <p><strong>🏢 Estrato:</strong> ${a.estrato || 'N/A'}</p>
        </div>
      `,
      confirmButtonColor: '#0077B6',
      confirmButtonText: 'Cerrar'
    });
  };

  // Alternar estado activo/inactivo del aprendiz
  const toggleEstado = async (a) => {
    if (!a.usuario) {
      Swal.fire("Error", "Este aprendiz no tiene un usuario asociado para cambiar su estado", "warning");
      return;
    }
    const estadoActual = a.usuario.estado;
    const nuevoEstado = estadoActual === "aprobado" ? "INACTIVO" : "ACTIVO";
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El aprendiz pasará a estar ${nuevoEstado}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estadoActual === "aprobado" ? "#dc3545" : "#0077B6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/auth/usuarios/${a.usuario.id_usuario}/toggle-activo`);
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar el estado", "error");
    }
  };

  // Importar Excel (fuerza rol Aprendiz)
  const handleImportar = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Aprendices desde Excel',
      html: `
        <div style="text-align:left;font-size:14px;color:#475569;line-height:1.5">
          <p>Sube un archivo <strong>.xlsx</strong> o <strong>.xls</strong> con las columnas:</p>
          <ul style="padding-left:20px;font-size:13px">
            <li><strong>documento</strong> (solo números)</li>
            <li><strong>nombres_apellidos</strong> (nombre completo)</li>
            <li><strong>email</strong> (correo único)</li>
            <li><strong>numero_ficha</strong> (opcional)</li>
            <li><strong>nombre_ficha / programa</strong> (opcional)</li>
          </ul>
          <p style="font-size:12px;color:#64748b;margin-top:8px">Columnas extendidas opcionales: <em>tipo_documento, fecha_nacimiento, genero, direccion, tipo_direccion, telefono, estrato, estado_civil, tipo_aprendiz</em></p>
          <p style="font-size:12px;color:#0077B6;font-weight:600">El rol se asignará automáticamente como <strong>Aprendiz</strong></p>
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
    formData.append('rolForzado', 'Aprendiz');
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

  // Filtrar aprendices
  const filtrados = aprendices.filter(a => {
    const s = filterText.toLowerCase().trim();
    if (!s) return true;
    return (a.documento || '').toLowerCase().includes(s) ||
      (a.nombres_apellidos || '').toLowerCase().includes(s) ||
      (a.email || a.usuario?.email || '').toLowerCase().includes(s) ||
      (a.ficha?.numero_ficha || '').toLowerCase().includes(s) ||
      (a.telefono || '').toLowerCase().includes(s) ||
      (a.tipo_aprendiz || '').toLowerCase().includes(s);
  });

  // Estilos reutilizables
  const btnStyle = (bg, color, border) => ({
    background: bg, color, border: border || 'none', borderRadius: '8px',
    padding: '7px 16px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
  });

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>🎓 Aprendices</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Gestiona los aprendices del sistema. Crea, edita, elimina o importa desde Excel.</p>

      {/* Barra de búsqueda y botones */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por documento, nombre, email, ficha o tipo..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }} />
        </div>
        <div className="col-md-7 text-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn text-white"
            style={{ background: "#0077B6", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalAprendiz"
            onClick={() => setSelectedAprendiz(null)}
          >
            ➕ Nuevo Aprendiz
          </button>
          <button onClick={handleImportar} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
            📥 Importar Excel
          </button>
        </div>
      </div>

      {/* Tabla de aprendices */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p>No hay aprendices registrados</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Documento', 'Nombres', 'Ficha', 'Teléfono', 'Tipo', 'Lectiva', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(a => (
                <tr key={a.id_aprendiz} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontSize: '13px' }}>
                    {a.tipo_documento ? <span style={{ fontSize: '10px', color: '#64748b' }}>{a.tipo_documento} </span> : null}
                    {a.documento}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px' }}>
                    <div>{a.nombres_apellidos}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{a.email || a.usuario?.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {a.ficha ? (
                      <div>
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                          📋 {a.ficha.numero_ficha}
                        </span>
                        {a.ficha.programa && (
                          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>
                            {a.ficha.programa.nombre_programa}
                          </div>
                        )}
                      </div>
                    ) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin ficha</span>}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px' }}>{a.telefono || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {a.tipo_aprendiz ? (
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                        {a.tipo_aprendiz}
                      </span>
                    ) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '11px' }}>
                    {a.ficha?.fecha_inicio && a.ficha?.fecha_fin ? `${a.ficha.fecha_inicio} a ${a.ficha.fecha_fin}` : 'No definida'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${a.usuario?.estado === 'aprobado' ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
                      {a.usuario?.estado === 'aprobado' ? "ACTIVO" : (a.usuario?.estado ? a.usuario.estado.toUpperCase() : "INACTIVO")}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleVerDetalle(a)} title="Ver Detalle" className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={() => setSelectedAprendiz(a)}
                        data-bs-toggle="modal"
                        data-bs-target="#modalAprendiz"
                        title="Editar"
                        className="btn btn-sm"
                        style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => toggleEstado(a)} 
                        title={a.usuario?.estado === 'aprobado' ? "Inactivar" : "Activar"} 
                        className="btn btn-sm" 
                        style={{ 
                          background: a.usuario?.estado === 'aprobado' ? "#fee2e2" : "#dcfce7", 
                          color: a.usuario?.estado === 'aprobado' ? "#dc2626" : "#16a34a", 
                          border: "none" 
                        }}
                      >
                        <i className={`fas ${a.usuario?.estado === 'aprobado' ? "fa-ban" : "fa-check"}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal editar/crear Aprendiz */}
      <div className="modal fade" id="modalAprendiz" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-white" style={{ background: "#023E8A" }}>
              <h5 className="modal-title" style={{ fontWeight: "700" }}>
                {selectedAprendiz ? "Editar Aprendiz" : "Registrar Nuevo Aprendiz"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalAprendiz")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <AprendizForm
                selectedAprendiz={selectedAprendiz}
                fichas={fichas}
                refreshParent={cargar}
                hideModal={() => hideModal("modalAprendiz")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
