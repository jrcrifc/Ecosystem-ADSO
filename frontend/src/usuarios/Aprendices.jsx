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

  // Helper para generar las opciones de ficha en un select
  const buildFichaOptions = (selectedId) => {
    return fichas.map(f => 
      `<option value="${f.id_ficha}" ${String(f.id_ficha) === String(selectedId) ? 'selected' : ''}>${f.numero_ficha} - ${f.programa?.nombre_programa || 'Sin programa'}</option>`
    ).join('');
  };

  // HTML del formulario de campos extendidos
  const camposExtendidosHTML = (a = {}) => `
    <div style="text-align:left;padding:0 10px">
      <p style="font-weight:700;color:#0077B6;font-size:13px;margin:15px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📋 Información Personal</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 10px">
      <select id="swal-tipo-doc" class="swal2-input" style="font-size:13px;padding:6px;margin:0">
        <option value="">Tipo documento</option>
        <option value="CC" ${a.tipo_documento === 'CC' ? 'selected' : ''}>CC</option>
        <option value="TI" ${a.tipo_documento === 'TI' ? 'selected' : ''}>TI</option>
        <option value="CE" ${a.tipo_documento === 'CE' ? 'selected' : ''}>CE</option>
        <option value="PEP" ${a.tipo_documento === 'PEP' ? 'selected' : ''}>PEP</option>
        <option value="PPT" ${a.tipo_documento === 'PPT' ? 'selected' : ''}>PPT</option>
      </select>
      <input id="swal-fecha-nac" class="swal2-input" type="date" style="font-size:13px;padding:6px;margin:0" value="${a.fecha_nacimiento || ''}" placeholder="Fecha nacimiento">
      <select id="swal-genero" class="swal2-input" style="font-size:13px;padding:6px;margin:0">
        <option value="">Género</option>
        <option value="Masculino" ${a.genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
        <option value="Femenino" ${a.genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
        <option value="Otro" ${a.genero === 'Otro' ? 'selected' : ''}>Otro</option>
      </select>
      <select id="swal-estado-civil" class="swal2-input" style="font-size:13px;padding:6px;margin:0">
        <option value="">Estado civil</option>
        <option value="Soltero" ${a.estado_civil === 'Soltero' ? 'selected' : ''}>Soltero</option>
        <option value="Casado" ${a.estado_civil === 'Casado' ? 'selected' : ''}>Casado</option>
        <option value="Unión libre" ${a.estado_civil === 'Unión libre' ? 'selected' : ''}>Unión libre</option>
        <option value="Divorciado" ${a.estado_civil === 'Divorciado' ? 'selected' : ''}>Divorciado</option>
        <option value="Viudo" ${a.estado_civil === 'Viudo' ? 'selected' : ''}>Viudo</option>
      </select>
    </div>
    <div style="text-align:left;padding:0 10px">
      <p style="font-weight:700;color:#0077B6;font-size:13px;margin:15px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📍 Ubicación y Contacto</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 10px">
      <input id="swal-direccion" class="swal2-input" style="font-size:13px;padding:6px;margin:0" placeholder="Dirección" value="${a.direccion || ''}">
      <select id="swal-tipo-dir" class="swal2-input" style="font-size:13px;padding:6px;margin:0">
        <option value="">Tipo dirección</option>
        <option value="Urbana" ${a.tipo_direccion === 'Urbana' ? 'selected' : ''}>Urbana</option>
        <option value="Rural" ${a.tipo_direccion === 'Rural' ? 'selected' : ''}>Rural</option>
      </select>
      <input id="swal-telefono" class="swal2-input" style="font-size:13px;padding:6px;margin:0" placeholder="Teléfono" value="${a.telefono || ''}">
      <select id="swal-estrato" class="swal2-input" style="font-size:13px;padding:6px;margin:0">
        <option value="">Estrato</option>
        ${[1,2,3,4,5,6].map(e => `<option value="${e}" ${String(a.estrato) === String(e) ? 'selected' : ''}>${e}</option>`).join('')}
      </select>
    </div>
    <div style="text-align:left;padding:0 10px">
      <p style="font-weight:700;color:#0077B6;font-size:13px;margin:15px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">🏷️ Formación</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:6px;padding:0 10px">
      <input id="swal-tipo-aprendiz" class="swal2-input" style="font-size:13px;padding:6px;margin:0" placeholder="Tipo de aprendiz (ej: Regular)" value="${a.tipo_aprendiz || ''}">
    </div>
    <div style="text-align:left;padding:0 10px">
      <p style="font-weight:700;color:#0077B6;font-size:13px;margin:15px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">👨‍👩‍👦 Acudiente / Responsable</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 10px">
      <input id="swal-nom-resp" class="swal2-input" style="font-size:13px;padding:6px;margin:0;grid-column:1/3" placeholder="Nombre del responsable" value="${a.nombre_responsable || ''}">
      <input id="swal-tel-resp" class="swal2-input" style="font-size:13px;padding:6px;margin:0" placeholder="Teléfono responsable" value="${a.telefono_responsable || ''}">
      <input id="swal-email-resp" class="swal2-input" style="font-size:13px;padding:6px;margin:0" placeholder="Email responsable" value="${a.email_responsable || ''}">
    </div>
  `;

  // Leer todos los campos extendidos del formulario
  const leerCamposExtendidos = () => ({
    tipo_documento: document.getElementById('swal-tipo-doc')?.value || null,
    fecha_nacimiento: document.getElementById('swal-fecha-nac')?.value || null,
    genero: document.getElementById('swal-genero')?.value || null,
    estado_civil: document.getElementById('swal-estado-civil')?.value || null,
    direccion: document.getElementById('swal-direccion')?.value || null,
    tipo_direccion: document.getElementById('swal-tipo-dir')?.value || null,
    telefono: document.getElementById('swal-telefono')?.value || null,
    estrato: document.getElementById('swal-estrato')?.value || null,
    tipo_aprendiz: document.getElementById('swal-tipo-aprendiz')?.value || null,
    nombre_responsable: document.getElementById('swal-nom-resp')?.value || null,
    telefono_responsable: document.getElementById('swal-tel-resp')?.value || null,
    email_responsable: document.getElementById('swal-email-resp')?.value || null,
  });

  // Crear aprendiz manualmente
  const handleCrear = async () => {
    const { value: formValues } = await Swal.fire({
      title: '🎓 Nuevo Aprendiz',
      width: 650,
      html: `
        <div style="text-align:left;padding:0 10px">
          <p style="font-weight:700;color:#06b6d4;font-size:13px;margin:0 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📝 Datos Básicos</p>
        </div>
        <input id="swal-doc" class="swal2-input" placeholder="Documento (solo números)">
        <input id="swal-nombre" class="swal2-input" placeholder="Nombres y Apellidos">
        <input id="swal-email" class="swal2-input" placeholder="Correo electrónico">
        <select id="swal-ficha" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin ficha asignada</option>
          ${buildFichaOptions(null)}
        </select>
        ${camposExtendidosHTML()}
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      preConfirm: () => ({
        documento: document.getElementById('swal-doc').value,
        nombres_apellidos: document.getElementById('swal-nombre').value,
        email: document.getElementById('swal-email').value,
        id_ficha: document.getElementById('swal-ficha').value || null,
        ...leerCamposExtendidos()
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
      width: 650,
      html: `
        <div style="text-align:left;padding:0 10px">
          <p style="font-weight:700;color:#06b6d4;font-size:13px;margin:0 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📝 Datos Básicos</p>
        </div>
        <input id="swal-doc" class="swal2-input" placeholder="Documento" value="${a.documento || ''}">
        <input id="swal-nombre" class="swal2-input" placeholder="Nombres y Apellidos" value="${a.nombres_apellidos || ''}">
        <input id="swal-email" class="swal2-input" placeholder="Correo" value="${a.email || a.usuario?.email || ''}">
        <select id="swal-ficha" class="swal2-select" style="margin-top:10px;padding:8px;border:1px solid #d9d9d9;border-radius:4px;width:80%">
          <option value="">Sin ficha</option>
          ${buildFichaOptions(a.id_ficha)}
        </select>
        ${camposExtendidosHTML(a)}
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      preConfirm: () => ({
        documento: document.getElementById('swal-doc').value,
        nombres_apellidos: document.getElementById('swal-nombre').value,
        email: document.getElementById('swal-email').value,
        id_ficha: document.getElementById('swal-ficha').value || null,
        ...leerCamposExtendidos()
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

  // Ver detalles completos del aprendiz
  const handleVerDetalle = (a) => {
    Swal.fire({
      title: `📋 ${a.nombres_apellidos}`,
      width: 550,
      html: `
        <div style="text-align:left;font-size:13px;color:#334155;line-height:1.8">
          <p style="font-weight:700;color:#06b6d4;border-bottom:1px solid #e2e8f0;padding-bottom:4px">📝 Datos Básicos</p>
          <p><strong>📄 Documento:</strong> ${a.tipo_documento ? a.tipo_documento + ' ' : ''}${a.documento}</p>
          <p><strong>📧 Email:</strong> ${a.email || a.usuario?.email || 'N/A'}</p>
          <p><strong>📋 Ficha:</strong> ${a.ficha?.numero_ficha || 'Sin ficha'}</p>
          <p><strong>📅 Lectiva:</strong> ${a.ficha?.fecha_inicio && a.ficha?.fecha_fin ? `${a.ficha.fecha_inicio} a ${a.ficha.fecha_fin}` : 'No definida'}</p>
          
          <p style="font-weight:700;color:#06b6d4;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:12px">📋 Información Personal</p>
          <p><strong>🎂 Nacimiento:</strong> ${a.fecha_nacimiento || 'N/A'}</p>
          <p><strong>👤 Género:</strong> ${a.genero || 'N/A'}</p>
          <p><strong>💍 Estado civil:</strong> ${a.estado_civil || 'N/A'}</p>
          <p><strong>🏷️ Tipo aprendiz:</strong> ${a.tipo_aprendiz || 'N/A'}</p>
          
          <p style="font-weight:700;color:#06b6d4;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:12px">📍 Ubicación y Contacto</p>
          <p><strong>🏠 Dirección:</strong> ${a.direccion || 'N/A'} ${a.tipo_direccion ? '(' + a.tipo_direccion + ')' : ''}</p>
          <p><strong>📞 Teléfono:</strong> ${a.telefono || 'N/A'}</p>
          <p><strong>🏢 Estrato:</strong> ${a.estrato || 'N/A'}</p>
          
          <p style="font-weight:700;color:#06b6d4;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:12px">👨‍👩‍👦 Acudiente</p>
          <p><strong>👤 Nombre:</strong> ${a.nombre_responsable || 'N/A'}</p>
          <p><strong>📞 Teléfono:</strong> ${a.telefono_responsable || 'N/A'}</p>
          <p><strong>📧 Email:</strong> ${a.email_responsable || 'N/A'}</p>
        </div>
      `,
      confirmButtonColor: '#0077B6',
      confirmButtonText: 'Cerrar'
    });
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
          <p style="font-size:12px;color:#64748b;margin-top:8px">Columnas extendidas opcionales: <em>tipo_documento, fecha_nacimiento, genero, direccion, tipo_direccion, telefono, estrato, estado_civil, tipo_aprendiz, nombre_responsable, telefono_responsable, email_responsable</em></p>
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
        <div style={{ height: "3px", width: "24px", background: "#06b6d4", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#06b6d4", margin: 0 }}>🎓 Aprendices</h2>
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
                {['Documento', 'Nombres', 'Ficha', 'Teléfono', 'Tipo', 'Lectiva', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(a => (
                <tr key={a.id_aprendiz} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>
                    {a.tipo_documento ? <span style={{ fontSize: '10px', color: '#64748b' }}>{a.tipo_documento} </span> : null}
                    {a.documento}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    <div style={{ fontWeight: '600' }}>{a.nombres_apellidos}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{a.email || a.usuario?.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {a.ficha ? (
                      <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                        📋 {a.ficha.numero_ficha}
                      </span>
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
                    <span style={{ background: a.usuario?.estado === 'aprobado' ? '#ecfdf5' : '#fef2f2', color: a.usuario?.estado === 'aprobado' ? '#059669' : '#dc2626', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                      {a.usuario?.estado === 'aprobado' ? '✅ Activo' : a.usuario?.estado || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleVerDetalle(a)} style={btnStyle('#f5f3ff', '#7c3aed', '1px solid #ddd6fe')}>👁️</button>
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
