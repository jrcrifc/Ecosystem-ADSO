// Vista de gestión de Fichas de Formación con CRUD e importación desde Excel
// Las fichas pertenecen a un programa y pueden tener muchos aprendices asociados
import { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import FichaForm from "./FichaForm.jsx";

export default function Fichas() {
  // Estado que almacena la lista de fichas cargadas desde el backend
  const [fichas, setFichas] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedFicha, setSelectedFicha] = useState(null);

  useEffect(() => {
    cargar();
    cargarProgramas();
    const modalFicha = document.getElementById("modalFicha");
    const handleHidden = () => {
      setSelectedFicha(null);
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };
    if (modalFicha) {
      modalFicha.addEventListener("hidden.bs.modal", handleHidden);
    }
    return () => {
      if (modalFicha) {
        modalFicha.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  // Función asíncrona que obtiene todas las fichas desde la API
  const cargar = async () => {
    try {
      const res = await apiAxios.get("/api/fichas");
      setFichas(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las fichas", "error");
    }
  };

  // Función asíncrona que obtiene todos los programas para los selectores
  const cargarProgramas = async () => {
    try {
      const res = await apiAxios.get("/api/programas");
      setProgramas(res.data);
    } catch {
      console.error("Error cargando programas");
    }
  };

  // Funciones de SweetAlert eliminadas, se usa FichaForm
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

  // Alternar estado activo/inactivo de la ficha
  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual !== false ? false : true;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La ficha pasará a estar ${nuevoEstado ? "ACTIVA" : "INACTIVA"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estadoActual !== false ? "#dc3545" : "#0077B6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      const ficha = fichas.find(f => f.id_ficha === id);
      await apiAxios.put(`/api/fichas/${id}`, {
        numero_ficha: ficha.numero_ficha,
        id_programa: ficha.id_programa,
        fecha_inicio: ficha.fecha_inicio,
        fecha_fin: ficha.fecha_fin,
        estado: nuevoEstado
      });
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo cambiar el estado", "error");
    }
  };

  // Función que maneja la importación masiva de fichas desde un archivo Excel
  const handleImportar = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Fichas desde Excel',
      html: `
        <div style="text-align:left;font-size:14px;color:#475569;line-height:1.5">
          <p>Sube un archivo <strong>.xlsx</strong> o <strong>.xls</strong> con las columnas:</p>
          <ul style="padding-left:20px;font-size:13px">
            <li><strong>numero_ficha</strong> (obligatorio, número único)</li>
            <li><strong>nombre_programa</strong> (opcional, nombre del programa)</li>
            <li><strong>fecha_inicio</strong> (opcional, formato AAAA-MM-DD)</li>
            <li><strong>fecha_fin</strong> (opcional, formato AAAA-MM-DD)</li>
          </ul>
          <p style="font-size:12px;color:#f59e0b;font-weight:600">Las fichas con número duplicado serán omitidas</p>
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
    // Muestra loading mientras se procesa el archivo
    Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiAxios.post("/api/fichas/importar-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { creados, omitidos, errores } = res.data;
      let html = `<div style="text-align:left;font-size:14px">
        <p style="color:#2e7d32;font-weight:600">✅ Creadas: ${creados || 0}</p>
        <p style="color:#64748b">ℹ️ Omitidas: ${omitidos || 0}</p>`;
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

  // Filtra las fichas según el texto ingresado (por número de ficha o nombre del programa)
  const filtradas = fichas.filter(f => {
    const s = filterText.toLowerCase().trim();
    if (!s) return true;
    return (f.numero_ficha || '').toLowerCase().includes(s) ||
      (f.programa?.nombre_programa || '').toLowerCase().includes(s);
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
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>📋 Fichas de Formación</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Gestiona las fichas de formación. Cada ficha pertenece a un programa y puede tener múltiples aprendices.</p>

      {/* Barra de búsqueda y botones de acción */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por número de ficha o programa..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }} />
        </div>
        <div className="col-md-7 text-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn text-white"
            style={{ background: "#0077B6", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalFicha"
            onClick={() => setSelectedFicha(null)}
          >
            ➕ Nueva Ficha
          </button>
          <button onClick={handleImportar} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
            📥 Importar Excel
          </button>
        </div>
      </div>

      {/* Tabla de fichas o mensaje vacío */}
      {filtradas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p>No hay fichas registradas</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['N° Ficha', 'Programa', 'Lectiva', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(f => (
                <tr key={f.id_ficha} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontSize: '13px' }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '99px', fontSize: '13px', fontWeight: '600' }}>
                      📋 {f.numero_ficha}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    {f.programa?.nombre_programa || <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin programa</span>}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '11px' }}>
                    {f.fecha_inicio && f.fecha_fin ? `${f.fecha_inicio} a ${f.fecha_fin}` : 'No definida'}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${f.estado !== false ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
                      {f.estado !== false ? "ACTIVA" : "INACTIVA"}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setSelectedFicha(f)} 
                        data-bs-toggle="modal"
                        data-bs-target="#modalFicha"
                        title="Editar"
                        className="btn btn-sm"
                        style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => toggleEstado(f.id_ficha, f.estado)} title={f.estado !== false ? "Inactivar" : "Activar"} className="btn btn-sm" style={{ background: f.estado !== false ? "#fee2e2" : "#dcfce7", color: f.estado !== false ? "#dc2626" : "#16a34a", border: "none" }}>
                        <i className={`fas ${f.estado !== false ? "fa-ban" : "fa-check"}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal editar/crear Ficha */}
      <div className="modal fade" id="modalFicha" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-white" style={{ background: "#023E8A" }}>
              <h5 className="modal-title" style={{ fontWeight: "700" }}>
                {selectedFicha ? "Editar Ficha" : "Registrar Nueva Ficha"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalFicha")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <FichaForm
                selectedFicha={selectedFicha}
                programas={programas}
                refreshParent={cargar}
                hideModal={() => hideModal("modalFicha")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
