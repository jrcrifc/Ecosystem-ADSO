// Vista de gestión de Fichas de Formación con CRUD e importación desde Excel
// Las fichas pertenecen a un programa y pueden tener muchos aprendices asociados
import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function Fichas() {
  // Estado que almacena la lista de fichas cargadas desde el backend
  const [fichas, setFichas] = useState([]);
  // Estado que almacena la lista de programas disponibles para el selector
  const [programas, setProgramas] = useState([]);
  // Estado que controla el texto del filtro de búsqueda
  const [filterText, setFilterText] = useState("");

  // Al montar el componente, carga fichas y programas en paralelo
  useEffect(() => { cargar(); cargarProgramas(); }, []);

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

  // Función que abre un modal para crear una nueva ficha manualmente
  const handleCrear = async () => {
    const { value: formValues } = await Swal.fire({
      title: '📋 Nueva Ficha',
      html: `
        <input id="swal-numero" class="swal2-input" placeholder="Número de ficha (ej: 2889927)">
        <select id="swal-programa" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin programa asignado</option>
        </select>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:10px; width:80%; margin-left:auto; margin-right:auto;">
          <input id="swal-inicio" type="date" class="swal2-input" style="width:48%; margin:0" title="Fecha inicio etapa lectiva">
          <input id="swal-fin" type="date" class="swal2-input" style="width:48%; margin:0" title="Fecha fin etapa lectiva">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      didOpen: () => {
        // Rellena dinámicamente el selector de programas con los datos cargados
        const select = document.getElementById('swal-programa');
        programas.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id_programa;
          opt.textContent = p.nombre_programa;
          select.appendChild(opt);
        });
      },
      preConfirm: () => {
        const numero = document.getElementById('swal-numero').value.trim();
        if (!numero) { Swal.showValidationMessage('El número de ficha es obligatorio'); return false; }
        return {
          numero_ficha: numero,
          id_programa: document.getElementById('swal-programa').value || null,
          fecha_inicio: document.getElementById('swal-inicio').value || null,
          fecha_fin: document.getElementById('swal-fin').value || null
        };
      }
    });
    if (!formValues) return;
    try {
      await apiAxios.post("/api/fichas", formValues);
      Swal.fire("✅ Creada", "Ficha registrada correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al crear la ficha", "error");
    }
  };

  // Función que abre un modal pre-rellenado para editar una ficha existente
  const handleEditar = async (f) => {
    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar Ficha',
      html: `
        <input id="swal-numero" class="swal2-input" placeholder="Número de ficha" value="${f.numero_ficha || ''}">
        <select id="swal-programa" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin programa</option>
        </select>
        <select id="swal-estado" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="true" ${f.estado !== false ? 'selected' : ''}>Activo</option>
          <option value="false" ${f.estado === false ? 'selected' : ''}>Inactivo</option>
        </select>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:10px; width:80%; margin-left:auto; margin-right:auto;">
          <input id="swal-inicio" type="date" class="swal2-input" style="width:48%; margin:0" title="Fecha inicio" value="${f.fecha_inicio || ''}">
          <input id="swal-fin" type="date" class="swal2-input" style="width:48%; margin:0" title="Fecha fin" value="${f.fecha_fin || ''}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      didOpen: () => {
        // Rellena el selector de programas y marca el seleccionado
        const select = document.getElementById('swal-programa');
        programas.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id_programa;
          opt.textContent = p.nombre_programa;
          if (String(p.id_programa) === String(f.id_programa)) opt.selected = true;
          select.appendChild(opt);
        });
      },
      preConfirm: () => {
        const numero = document.getElementById('swal-numero').value.trim();
        if (!numero) { Swal.showValidationMessage('El número de ficha es obligatorio'); return false; }
        return {
          numero_ficha: numero,
          id_programa: document.getElementById('swal-programa').value || null,
          estado: document.getElementById('swal-estado').value === 'true',
          fecha_inicio: document.getElementById('swal-inicio').value || null,
          fecha_fin: document.getElementById('swal-fin').value || null
        };
      }
    });
    if (!formValues) return;
    try {
      await apiAxios.put(`/api/fichas/${f.id_ficha}`, formValues);
      Swal.fire("✅ Actualizada", "Ficha actualizada correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al actualizar", "error");
    }
  };

  // Función que confirma y elimina una ficha
  const handleEliminar = async (f) => {
    const result = await Swal.fire({
      title: "¿Eliminar ficha?",
      text: `Se eliminará la ficha ${f.numero_ficha}. Los aprendices asociados quedarán sin ficha.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/fichas/${f.id_ficha}`);
      Swal.fire("Eliminada", "Ficha eliminada correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al eliminar", "error");
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
        <div style={{ height: "3px", width: "24px", background: "#f59e0b", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", margin: 0 }}>📋 Fichas de Formación</h2>
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
          <button onClick={handleCrear} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
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
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '99px', fontSize: '13px', fontWeight: '700' }}>
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
                    <span style={{
                      background: f.estado !== false ? '#ecfdf5' : '#fef2f2',
                      color: f.estado !== false ? '#059669' : '#dc2626',
                      fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px'
                    }}>
                      {f.estado !== false ? '✅ Activa' : '❌ Inactiva'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEditar(f)} style={btnStyle('#f0f9ff', '#0077B6', '1px solid #bae6fd')}>✏️</button>
                      <button onClick={() => handleEliminar(f)} style={btnStyle('#fef2f2', '#dc2626', '1px solid #fecaca')}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
