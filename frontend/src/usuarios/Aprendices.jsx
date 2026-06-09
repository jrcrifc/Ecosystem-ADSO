// Vista de gestión de Aprendices con CRUD e importación desde Excel
import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function Aprendices() {
  const [aprendices, setAprendices] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => { cargar(); cargarFichas(); }, []);

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

  // Crear aprendiz manualmente
  const handleCrear = async () => {
    const { value: formValues } = await Swal.fire({
      title: '🎓 Nuevo Aprendiz',
      html: `
        <input id="swal-doc" class="swal2-input" placeholder="Documento (solo números)">
        <input id="swal-nombre" class="swal2-input" placeholder="Nombres y Apellidos">
        <input id="swal-email" class="swal2-input" placeholder="Correo electrónico">
        <select id="swal-ficha" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin ficha asignada</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      didOpen: () => {
        const select = document.getElementById('swal-ficha');
        fichas.forEach(f => {
          const opt = document.createElement('option');
          opt.value = f.id_ficha;
          opt.textContent = `${f.numero_ficha} - ${f.programa?.nombre_programa || 'Sin programa'}`;
          select.appendChild(opt);
        });
      },
      preConfirm: () => ({
        documento: document.getElementById('swal-doc').value,
        nombres_apellidos: document.getElementById('swal-nombre').value,
        email: document.getElementById('swal-email').value,
        id_ficha: document.getElementById('swal-ficha').value || null
      })
    });
    if (!formValues) return;
    try {
      await apiAxios.post("/api/aprendices", formValues);
      Swal.fire("✅ Creado", "Aprendiz registrado correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al crear", "error");
    }
  };

  // Editar aprendiz
  const handleEditar = async (a) => {
    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar Aprendiz',
      html: `
        <input id="swal-doc" class="swal2-input" placeholder="Documento" value="${a.documento || ''}">
        <input id="swal-nombre" class="swal2-input" placeholder="Nombres y Apellidos" value="${a.nombres_apellidos || ''}">
        <input id="swal-email" class="swal2-input" placeholder="Correo" value="${a.email || a.usuario?.email || ''}">
        <select id="swal-ficha" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin ficha</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      didOpen: () => {
        const select = document.getElementById('swal-ficha');
        fichas.forEach(f => {
          const opt = document.createElement('option');
          opt.value = f.id_ficha;
          opt.textContent = `${f.numero_ficha} - ${f.programa?.nombre_programa || 'Sin programa'}`;
          if (String(f.id_ficha) === String(a.id_ficha)) opt.selected = true;
          select.appendChild(opt);
        });
      },
      preConfirm: () => ({
        documento: document.getElementById('swal-doc').value,
        nombres_apellidos: document.getElementById('swal-nombre').value,
        email: document.getElementById('swal-email').value,
        id_ficha: document.getElementById('swal-ficha').value || null
      })
    });
    if (!formValues) return;
    try {
      await apiAxios.put(`/api/aprendices/${a.id_aprendiz}`, formValues);
      Swal.fire("✅ Actualizado", "Datos del aprendiz actualizados", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al actualizar", "error");
    }
  };

  // Eliminar aprendiz
  const handleEliminar = async (a) => {
    const result = await Swal.fire({
      title: "¿Eliminar aprendiz?",
      text: `Se eliminará a ${a.nombres_apellidos} y su cuenta de usuario`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#ef4444", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/aprendices/${a.id_aprendiz}`);
      Swal.fire("Eliminado", "Aprendiz eliminado correctamente", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al eliminar", "error");
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
      (a.ficha?.numero_ficha || '').toLowerCase().includes(s);
  });

  // Estilos reutilizables
  const btnStyle = (bg, color, border) => ({
    background: bg, color, border: border || 'none', borderRadius: '8px',
    padding: '7px 16px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
  });

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#06b6d4", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#06b6d4", margin: 0 }}>🎓 Aprendices</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Gestiona los aprendices del sistema. Crea, edita, elimina o importa desde Excel.</p>

      {/* Barra de búsqueda y botones */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por documento, nombre, email o ficha..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }} />
        </div>
        <div className="col-md-7 text-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleCrear} className="btn text-white"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", borderRadius: "10px", fontWeight: "600", padding: "10px 20px", border: "none" }}>
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
                {['Documento', 'Nombres y Apellidos', 'Email', 'Ficha', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(a => (
                <tr key={a.id_aprendiz} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{a.documento}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{a.nombres_apellidos}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{a.email || a.usuario?.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {a.ficha ? (
                      <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                        📋 {a.ficha.numero_ficha}
                      </span>
                    ) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin ficha</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: a.usuario?.estado === 'aprobado' ? '#ecfdf5' : '#fef2f2', color: a.usuario?.estado === 'aprobado' ? '#059669' : '#dc2626', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                      {a.usuario?.estado === 'aprobado' ? '✅ Activo' : a.usuario?.estado || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEditar(a)} style={btnStyle('#f0f9ff', '#0077B6', '1px solid #bae6fd')}>✏️</button>
                      <button onClick={() => handleEliminar(a)} style={btnStyle('#fef2f2', '#dc2626', '1px solid #fecaca')}>🗑️</button>
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
