// Archivo de componente de notificaciones en tiempo real con campana y sonido

// Importa los hooks de React para manejar estado, efectos y referencias
import { useState, useEffect, useRef } from "react";
// Importa el hook de navegacion de React Router
import { useNavigate } from "react-router-dom";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";

// Define el componente de campana de notificaciones
export default function Campanita({ userData, onAprobado, userRol }) {
  // Estado que almacena la lista de notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  // Estado que controla si el dropdown de notificaciones esta abierto
  const [open, setOpen] = useState(false);
  // Estado que controla si se muestran todas las notificaciones
  const [verTodas, setVerTodas] = useState(false);
  // Referencia al elemento del dropdown para detectar clics fuera
  const ref = useRef();
  // Hook de navegacion para redirigir a otras rutas
  const navigate = useNavigate();

  // Obtiene el ID del usuario desde las props
  const id_usuario = userData?.id_usuario || userData?.user?.id_usuario;
  // Calcula el numero de notificaciones no leidas
  const noLeidas = notificaciones.filter(n => !n.leida).length;
  // Determina si el usuario es administrador
  const esAdmin = String(userRol || "").toLowerCase() === 'administrador';

  // ===== Conexion socket, carga inicial y notificaciones en tiempo real =====

  // Efecto que configura la conexion socket y carga inicial de notificaciones
  useEffect(() => {
    // Sale si no hay ID de usuario
    if (!id_usuario) return;

    // Carga inicial de notificaciones
    cargar();

    // Funcion para emitir evento de union a la sala del usuario
    const emitJoin = () => {
      socket.emit("join", id_usuario);
    };

    // Si el socket ya esta conectado, emite inmediatamente
    if (socket.connected) {
      emitJoin();
    }

    // Escucha el evento de conexion del socket
    socket.on("connect", emitJoin);

    // Funcion para reproducir sonido de notificacion
    const playNotificationSound = () => {
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/ui/message_notification.ogg");
        audio.play().catch(e => console.log("Audio bloqueado por el navegador (requiere interacción previa):", e));
      } catch (e) {
        console.error("No se pudo reproducir el sonido de notificación", e);
      }
    };

    // Manejador de notificaciones entrantes
    const handleNotification = (nueva) => {
      // Agrega la nueva notificacion al inicio de la lista
      setNotificaciones(prev => [nueva, ...prev]);
      
      // Reproduce el sonido de campanita
      playNotificationSound();
      
      // Muestra un Toast inmediato con opcion de ver la notificacion
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: nueva.titulo || '🔔 Nueva Notificación',
        text: nueva.mensaje,
        showConfirmButton: true,
        confirmButtonText: 'Ver',
        timer: 10000,
        timerProgressBar: true
      }).then((result) => {
        // Si el usuario hace clic en Ver, redirige segun el tipo
        if (result.isConfirmed) {
          handleNotificacionClick(nueva);
        }
      });

      // Si la notificacion es de aprobado, notifica al componente padre
      if (nueva.tipo === 'aprobado' && onAprobado && userRol !== 'Administrador') {
        onAprobado();
      }
    };

    // Escucha el evento de notificacion del socket
    socket.on("notification", handleNotification);

    // Limpieza al desmontar el componente
    return () => {
      socket.off("connect", emitJoin);
      socket.off("notification", handleNotification);
    };
  }, [id_usuario]);

  // Efecto que cierra el dropdown al hacer clic fuera de el
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ===== Cargar notificaciones desde la API =====

  // Funcion asincrona para cargar las notificaciones del usuario
  const cargar = async () => {
    try {
      // Realiza peticion GET para obtener las notificaciones
      const res = await apiAxios.get(`/api/notificaciones/${id_usuario}`);
      let nuevas = res.data;

      // Verifica si hay notificaciones de aprobado no leidas
      const hayAprobacion = nuevas.some(n => n.tipo === 'aprobado' && !n.leida);
      if (hayAprobacion && onAprobado && userRol !== 'Administrador') {
        onAprobado();
      }

      // Inyecta notificaciones virtuales de reactivos por vencer para roles autorizados
      if (['Administrador', 'Gestor', 'Cuentadante', 'Pasante'].includes(userRol)) {
        try {
          const statsRes = await apiAxios.get('/api/dashboard/stats');
          const venc = statsRes.data.vencimientos || [];
          // Crea notificaciones virtuales para cada reactivo por vencer
          const virtualNotifs = venc.map(v => ({
            id_notificacion: `venc-${v.id_movimiento_reactivo}`,
            tipo: 'vencimiento_reactivo',
            titulo: '⚠️ Reactivo por vencer',
            mensaje: `El reactivo ${v.reactivo?.nom_reactivo} (Lote: ${v.lote || 'N/A'}) vence el ${new Date(v.fecha_vencimiento).toLocaleDateString()}.`,
            leida: false,
            createdAt: new Date().toISOString()
          }));
          nuevas = [...virtualNotifs, ...nuevas];
        } catch (e) {
          console.error("Error cargando stats en notificaciones", e);
        }
      }

      // Guarda todas las notificaciones en el estado
      setNotificaciones(nuevas);
    } catch { }
  };

  // ===== Marcar todas las notificaciones como leidas =====

  // Funcion asincrona para marcar todas las notificaciones como leidas
  const marcarTodas = async () => {
    try {
      // Envia peticion PUT para marcar todas como leidas
      await apiAxios.put(`/api/notificaciones/${id_usuario}/todas-leidas`);
      // Actualiza el estado local marcando todas como leidas
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch { }
  };

  // ===== Manejar clic en notificacion: marcar leida y redirigir =====

  // Funcion asincrona para manejar el clic en una notificacion
  const handleNotificacionClick = async (n) => {
    // Marca la notificacion como leida si no lo esta
    if (!n.leida) {
      try {
        await apiAxios.put(`/api/notificaciones/${n.id_notificacion}/leida`);
        setNotificaciones(prev => prev.map(x =>
          x.id_notificacion === n.id_notificacion ? { ...x, leida: true } : x
        ));
      } catch { }
    }

    // Redirige segun el tipo de notificacion
    if (esAdmin && n.tipo === 'solicitud_acceso') {
      setOpen(false);
      navigate('/gestion-usuarios');
    } else if (n.tipo === 'nueva_solicitud') {
      setOpen(false);
      navigate(esAdmin ? '/gestion-solicitudes' : '/solicitud');
    } else if (n.tipo === 'cambio_estado_solicitud') {
      setOpen(false);
      navigate('/solicitud');
    } else if (n.tipo === 'aprobado') {
      setOpen(false);
      navigate('/perfil');
    } else if (n.tipo === 'vencimiento_reactivo') {
      setOpen(false);
      navigate('/control-reactivos');
    } else {
      setOpen(false);
    }
  };

  // ===== Color de fondo segun el tipo de notificacion =====

  // Funcion que retorna un color de fondo segun el tipo de notificacion
  const colorTipo = (tipo) => {
    if (tipo === 'aprobado') return '#f0fdf4';
    if (tipo === 'rechazado') return '#fef2f2';
    if (tipo === 'solicitud_acceso') return '#eff6ff';
    if (tipo === 'nueva_solicitud') return '#fffbeb';
    if (tipo === 'cambio_estado_solicitud') return '#f5f3ff';
    if (tipo === 'vencimiento_reactivo') return '#fff1f2';
    return '#f8fafc';
  };

  // ===== Icono emoji segun el tipo de notificacion =====

  // Funcion que retorna un icono emoji segun el tipo de notificacion
  const iconTipo = (tipo) => {
    if (tipo === 'aprobado') return '✅';
    if (tipo === 'rechazado') return '❌';
    if (tipo === 'solicitud_acceso') return '📋';
    if (tipo === 'nueva_solicitud') return '📦';
    if (tipo === 'cambio_estado_solicitud') return '🔄';
    if (tipo === 'vencimiento_reactivo') return '⚠️';
    return '🔔';
  };

  // Renderiza el componente
  return (
    // Contenedor principal con referencia para detectar clics fuera
    <div ref={ref} style={{ position: "relative" }}>
      {/* Boton de la campana con contador de notificaciones no leidas */}
      <button onClick={() => { setOpen(!open); setVerTodas(false); }} style={{
        background: "transparent", border: "none", cursor: "pointer",
        position: "relative", padding: "6px"
      }}>
        <span style={{ fontSize: "22px" }}>🔔</span>
        {/* Indicador circular rojo con el numero de notificaciones no leidas */}
        {noLeidas > 0 && (
          <span style={{
            position: "absolute", top: "0", right: "0",
            background: "#ef4444", color: "#fff",
            fontSize: "10px", fontWeight: "700",
            width: "18px", height: "18px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>{noLeidas > 9 ? '9+' : noLeidas}</span>
        )}
      </button>

      {/* Dropdown de notificaciones (visible solo cuando open es true) */}
      {open && (
        <div style={{
          position: "absolute", right: "0", top: "calc(100% + 12px)",
          width: "380px", maxHeight: "480px",
          background: "#fff", borderRadius: "20px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
          border: "1px solid #f1f5f9", zIndex: 9999,
          overflow: "hidden", display: "flex", flexDirection: "column",
          animation: "fadeInScale 0.2s ease-out"
        }}>
          {/* Encabezado del dropdown con titulo y boton de marcar todas leidas */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #f0f4f8",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <span style={{ fontWeight: "700", color: "#0077B6", fontSize: "15px" }}>
              Notificaciones {noLeidas > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "99px", marginLeft: "6px" }}>{noLeidas}</span>
              )}
            </span>
            {/* Boton para marcar todas como leidas, visible solo si hay no leidas */}
            {noLeidas > 0 && (
              <button onClick={marcarTodas} style={{
                background: "transparent", border: "none",
                color: "#0077B6", fontSize: "12px", cursor: "pointer", fontWeight: "600"
              }}>Marcar todas leídas</button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div style={{ overflowX: "auto", display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Mensaje si no hay notificaciones */}
            {notificaciones.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔕</div>
                <p style={{ margin: 0, fontSize: "14px" }}>Sin notificaciones</p>
              </div>
            ) : (verTodas ? notificaciones : notificaciones.slice(0, 5)).map(n => (
              // Elemento de notificacion individual
              <div key={n.id_notificacion} style={{
                padding: "14px 20px",
                background: n.leida ? "#fff" : colorTipo(n.tipo),
                borderBottom: "1px solid #f0f4f8",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }} 
              // Efectos hover en cada notificacion
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = n.leida ? "#fff" : colorTipo(n.tipo); e.currentTarget.style.transform = "translateX(0)"; }}
              onClick={() => handleNotificacionClick(n)}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {/* Icono del tipo de notificacion */}
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{iconTipo(n.tipo)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "13px", color: "#0077B6" }}>{n.titulo}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#64748b", lineHeight: "1.5", wordBreak: "break-word" }}>{n.mensaje}</p>
                    {/* Pie de la notificacion con fecha e indicador de accion */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(n.createdAt).toLocaleString('es-CO')}
                      </p>
                      {/* Indicador de accion clickeable segun el tipo */}
                      {esAdmin && n.tipo === 'solicitud_acceso' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#0077B6",
                          background: "rgba(0,119,182,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ver solicitud →</span>
                      )}
                      {(n.tipo === 'nueva_solicitud' || n.tipo === 'cambio_estado_solicitud') && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#0077B6",
                          background: "rgba(0,119,182,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ver historial →</span>
                      )}
                      {n.tipo === 'vencimiento_reactivo' && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700", color: "#dc2626",
                          background: "rgba(220,38,38,0.1)", padding: "2px 8px",
                          borderRadius: "99px", whiteSpace: "nowrap"
                        }}>Ir al control →</span>
                      )}
                    </div>
                  </div>
                  {/* Punto azul indicador de no leida */}
                  {!n.leida && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0077B6", marginTop: "4px", flexShrink: 0 }} />}
                </div>
              </div>
            ))}

            {/* Boton Ver todas / Ver menos cuando hay mas de 5 notificaciones */}
            {notificaciones.length > 5 && (
              <button
                onClick={() => setVerTodas(prev => !prev)}
                style={{
                  width: "100%", padding: "12px", border: "none",
                  background: "#f8fafc", color: "#0077B6",
                  fontSize: "13px", fontWeight: "600",
                  cursor: "pointer", transition: "background 0.2s ease",
                  borderTop: "1px solid #f0f4f8"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
              >
                {verTodas ? `Mostrar menos ▲` : `Ver todas (${notificaciones.length}) ▼`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
