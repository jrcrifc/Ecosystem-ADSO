// Importa React, useEffect y useState para manejar el ciclo de vida
import React, { useEffect, useState } from "react";
// Importa componentes de Recharts para gráficos de barras y pastel
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig";

// Paleta de colores para los segmentos del gráfico de pastel
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Componente que renderiza las métricas del laboratorio con gráficos interactivos
const DashboardCharts = () => {
  // Datos de estadísticas obtenidos del servidor
  const [stats, setStats] = useState(null);
  // Indicador de carga mientras se obtienen los datos
  const [loading, setLoading] = useState(true);

  // Carga las estadísticas al montar el componente
  useEffect(() => {
    fetchStats();
  }, []);

  // Obtiene las estadísticas del dashboard desde el backend
  const fetchStats = async () => {
    try {
      // Solicita las estadísticas al endpoint del dashboard
      const res = await apiAxios.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error al cargar estadísticas", error);
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Muestra indicador de carga mientras se obtienen los datos
  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Cargando métricas...</div>;
  // Si no hay datos, no renderiza nada
  if (!stats) return null;

  // Transforma los datos de equipos para el gráfico de pastel (PieChart)
  const dataEquipos = stats.equiposDistribucion.map(item => ({
    name: item.estado === 1 ? "Activos" : "Inactivos",
    value: parseInt(item.count)
  }));

  // Transforma los datos de solicitudes para el gráfico de barras (BarChart)
  const dataSolicitudes = stats.solicitudes.map(item => ({
    name: item.estado === 1 ? "Activas" : "Inactivas",
    cantidad: parseInt(item.count)
  }));

  // Vista simplificada para personal (solo muestra sus solicitudes)
  if (stats.soloPersonal) {
    return (
      <div style={{ marginTop: "32px", animation: "fadeUp 0.8s ease" }}>
        {/*
          Título de la sección para personal
        */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Mi Resumen de Préstamos</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", maxWidth: "600px", margin: "0 auto" }}>
          {/*
            Estado de Mis Solicitudes - gráfico de barras
          */}
          <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px", textAlign: "center" }}>Mis Solicitudes de Préstamo</h4>
            <div style={{ height: "250px" }}>
              {/*
                Gráfico de barras responsive con datos de solicitudes del personal
              */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataSolicitudes}>
                  {/*
                    Grid con líneas punteadas solo horizontales
                  */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f0f7ff' }} />
                  {/*
                    Barras azules con bordes superiores redondeados
                  */}
                  <Bar dataKey="cantidad" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista completa para administradores con todas las métricas
  return (
    <div style={{ marginTop: "32px", animation: "fadeUp 0.8s ease" }}>
      {/*
        Título de la sección de métricas
      */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ height: "4px", width: "32px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Métricas del Laboratorio</h2>
      </div>

      {/*
        Alerta de reactivos próximos a vencer (solo si hay alguno)
      */}
      {stats.vencimientos?.length > 0 && (
        <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm" style={{ borderRadius: "12px", borderLeft: "5px solid #dc3545" }} role="alert">
          <i className="fa-solid fa-triangle-exclamation fs-4 me-3"></i>
          <div>
            <h5 className="mb-1 fw-bold">Atención: Reactivos por vencer</h5>
            <p className="mb-0 fs-6">
              {/*
                Muestra cantidad de lotes y nombres de reactivos próximos a vencer
              */}
              Hay <strong>{stats.vencimientos.length}</strong> lote(s) de reactivos que vencerán pronto:<br/>
              <span className="fw-semibold text-danger">{stats.vencimientos.map(v => `${v.reactivo?.nom_reactivo} (Lote ${v.lote || 'N/A'})`).join(" • ")}</span>
            </p>
          </div>
        </div>
      )}

      {/*
        Grid responsivo de tarjetas con gráficos y datos
      */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        
        {/*
          Distribución de Equipos - gráfico de pastel (PieChart)
        */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px" }}>Estado de Equipos</h4>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/*
                  Gráfico de dona con radio interno y externo
                */}
                <Pie
                  data={dataEquipos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {/*
                    Cada segmento del pastel con color de la paleta
                  */}
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

        {/*
          Estado de Solicitudes del Sistema - gráfico de barras (BarChart)
        */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "20px" }}>Solicitudes del Sistema</h4>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSolicitudes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f0f7ff' }} />
                {/*
                  Barras azules representando la cantidad de solicitudes
                */}
                <Bar dataKey="cantidad" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*
          Reactivos por vencer - listado de reactivos próximos a expirar
        */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0A1628", marginBottom: "15px" }}>Reactivos Próximos a Vencer</h4>
          {/*
            Mensaje si no hay vencimientos próximos
          */}
          {stats.vencimientos.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center", marginTop: "40px" }}>No hay vencimientos próximos.</p>
          ) : (
            // Lista de reactivos próximos a vencer con nombre y fecha
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.vencimientos.map((v, i) => (
                <div key={i} style={{ 
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "10px"
                }}>
                  {/*
                    Nombre del reactivo en rojo oscuro
                  */}
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#c53030" }}>{v.reactivo?.nom_reactivo}</span>
                  {/*
                    Fecha de vencimiento formateada
                  */}
                  <span style={{ fontSize: "11px", color: "#742a2a" }}>{new Date(v.fecha_vencimiento).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
          {/*
            Total de reactivos en inventario
          */}
          <div style={{ marginTop: "20px", padding: "12px", background: "#f0f7ff", borderRadius: "10px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "700" }}>Total en Inventario: {stats.totals.reactivos}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCharts;
