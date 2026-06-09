// Vista de gestión de Programas de Formación con CRUD e importación desde Excel
// Permite al administrador crear, editar, eliminar y buscar programas, además de importar desde archivos Excel
import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function Programas() {
  // Estado que almacena la lista de programas cargados desde el backend
  const [programas, setProgramas] = useState([]);
  // Estado que controla el texto del filtro de búsqueda
  const [filterText, setFilterText] = useState("");

  // Al montar el componente, carga la lista de programas
  useEffect(() => { cargar(); }, []);

  // Función asíncrona que obtiene todos los programas desde la API
  const cargar = async () => {
    try {
      const res = await apiAxios.get("/api/programas");
      setProgramas(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los programas", "error");
    }
  };

  // Función que abre un modal de SweetAlert2 para crear un nuevo programa manualmente
  const handleCrear = async () => {
    const { value: formValues } = await Swal.fire({
      title: '📚 Nuevo Programa',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre del programa de formación">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        if (!nombre) { Swal.showValidationMessage('El nombre del programa es obligatorio'); return false; }
        return { nombre_programa: nombre };
      }
    });
    if (!formValues) return;
    try {
      await apiAxios.post("/api/programas", formValues);
      Swal.fire("✅ Creado", "Programa registrado correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al crear el programa", "error");
    }
  };

  // Función que abre un modal pre-rellenado para editar un programa existente
  const handleEditar = async (p) => {
    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar Programa',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre del programa" value="${p.nombre_programa || ''}">
        <select id="swal-estado" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="true" ${p.estado !== false ? 'selected' : ''}>Activo</option>
          <option value="false" ${p.estado === false ? 'selected' : ''}>Inactivo</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        if (!nombre) { Swal.showValidationMessage('El nombre es obligatorio'); return false; }
        return {
          nombre_programa: nombre,
          estado: document.getElementById('swal-estado').value === 'true'
        };
      }
    });
    if (!formValues) return;
    try {
      await apiAxios.put(`/api/programas/${p.id_programa}`, formValues);
      Swal.fire("✅ Actualizado", "Programa actualizado correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al actualizar", "error");
    }
  };

  // Función que confirma y elimina un programa con doble confirmación
  const handleEliminar = async (p) => {
    const result = await Swal.fire({
      title: "¿Eliminar programa?",
      text: `Se eliminará "${p.nombre_programa}" y todas las fichas asociadas podrían quedar sin programa`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/programas/${p.id_programa}`);
      Swal.fire("Eliminado", "Programa eliminado correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al eliminar", "error");
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
        <div style={{ height: "3px", width: "24px", background: "#8b5cf6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#8b5cf6", margin: 0 }}>📚 Programas de Formación</h2>
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
          <button onClick={handleCrear} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
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
                {['#', 'Nombre del Programa', 'Estado', 'Fichas Asociadas', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, idx) => (
                <tr key={p.id_programa} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#94a3b8', fontSize: '13px' }}>{idx + 1}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{p.nombre_programa}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: p.estado !== false ? '#ecfdf5' : '#fef2f2',
                      color: p.estado !== false ? '#059669' : '#dc2626',
                      fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px'
                    }}>
                      {p.estado !== false ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                    {p.fichas?.length || 0} fichas
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEditar(p)} style={btnStyle('#f0f9ff', '#0077B6', '1px solid #bae6fd')}>✏️</button>
                      <button onClick={() => handleEliminar(p)} style={btnStyle('#fef2f2', '#dc2626', '1px solid #fecaca')}>🗑️</button>
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
