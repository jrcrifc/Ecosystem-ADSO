import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import apiAxios from "../api/axiosConfig";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const DashboardCharts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiAxios.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error al cargar estadísticas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stats && stats.vencimientos?.length > 0) {
      import("sweetalert2").then(Swal => {
        Swal.default.fire({
          title: '¡Alerta de Vencimiento!',
          text: `Reactivos en riesgo: ${stats.vencimientos.map(v => v.reactivo?.nom_reactivo).join(", ")}`,
          icon: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true
        });
      });
    }
  }, [stats]);

  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Cargando métricas...</div>;
  if (!stats) return null;

  // Formatear datos para Pie Chart (Equipos por Estado)
  const dataEquipos = stats.equiposDistribucion.map(item => ({
    name: item.estado === 1 ? "Activos" : "Inactivos",
    value: parseInt(item.count)
  }));

  // Formatear datos para Bar Chart (Solicitudes por Estado)
  const dataSolicitudes = stats.solicitudes.map(item => ({
    name: item.estado === 1 ? "Activas" : "Inactivas",
    cantidad: parseInt(item.count)
  }));

  if (stats.soloPersonal) {
    return (
      <div style={{ marginTop: "32px", animation: "fadeUp 0.8s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Mi Resumen de Préstamos</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", maxWidth: "600px", margin: "0 auto" }}>
          {/* Estado de Mis Solicitudes */}
          <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px", textAlign: "center" }}>Mis Solicitudes de Préstamo</h4>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataSolicitudes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f0f7ff' }} />
                  <Bar dataKey="cantidad" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "32px", animation: "fadeUp 0.8s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Métricas del Laboratorio</h2>
      </div>

      {stats.vencimientos?.length > 0 && (
        <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm" style={{ borderRadius: "12px", borderLeft: "5px solid #dc3545" }} role="alert">
          <i className="fa-solid fa-triangle-exclamation fs-4 me-3"></i>
          <div>
            <h5 className="mb-1 fw-bold">Atención: Reactivos por vencer</h5>
            <p className="mb-0 fs-6">
              Hay <strong>{stats.vencimientos.length}</strong> lote(s) de reactivos que vencerán pronto:<br/>
              <span className="fw-semibold text-danger">{stats.vencimientos.map(v => `${v.reactivo?.nom_reactivo} (Lote ${v.lote || 'N/A'})`).join(" • ")}</span>
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        
        {/* Distribución de Equipos */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px" }}>Estado de Equipos</h4>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataEquipos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataEquipos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estado de Solicitudes */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px" }}>Solicitudes del Sistema</h4>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSolicitudes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f0f7ff' }} />
                <Bar dataKey="cantidad" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reactivos por vencer */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "15px" }}>⚠️ Reactivos Próximos a Vencer</h4>
          {stats.vencimientos.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center", marginTop: "40px" }}>No hay vencimientos próximos.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.vencimientos.map((v, i) => (
                <div key={i} style={{ 
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "10px"
                }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#c53030" }}>{v.reactivo?.nom_reactivo}</span>
                  <span style={{ fontSize: "11px", color: "#742a2a" }}>{new Date(v.fecha_vencimiento).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: "20px", padding: "12px", background: "#f0f7ff", borderRadius: "10px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "700" }}>Total en Inventario: {stats.totals.reactivos}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCharts;
