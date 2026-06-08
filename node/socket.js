// ============================================================
// 🔌 CONFIGURACIÓN DE SOCKET.IO (WebSockets)
// Este archivo configura las comunicaciones en tiempo real del sistema.
// Permite enviar notificaciones instantáneas a usuarios específicos
// sin necesidad de que refresquen la página.
// ============================================================

// Importa la clase Server de socket.io para crear el servidor WebSocket
import { Server } from "socket.io";

// Variable global que almacena la instancia de Socket.io
let io;

// Función para inicializar Socket.io en el servidor HTTP
export const initSocket = (server) => {
  // Crea una nueva instancia de Socket.io asociada al servidor HTTP
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Escucha el evento de conexión de nuevos clientes
  io.on("connection", (socket) => {
    // Imprime el ID del socket conectado
    console.log("🔌 Usuario conectado:", socket.id);

    // Escucha el evento join para unir al usuario a una sala privada
    socket.on("join", (userId) => {
      // Une al socket a una sala privada con el formato user_{id}
      socket.join(`user_${userId}`);
      console.log(`👤 Usuario ${userId} se unió a su sala privada`);
    });

    // Escucha el evento de desconexión del cliente
    socket.on("disconnect", () => {
      console.log("🔌 Usuario desconectado");
    });
  });

  // Retorna la instancia de Socket.io creada
  return io;
};

// Función para obtener la instancia de Socket.io ya inicializada
export const getIO = () => {
  // Verifica si Socket.io ha sido inicializado
  if (!io) {
    // Lanza un error si no se ha inicializado
    throw new Error("Socket.io no ha sido inicializado");
  }
  // Retorna la instancia de Socket.io
  return io;
};

// Función para enviar una notificación en tiempo real a un usuario específico
export const sendNotification = (userId, data) => {
  // Verifica que la instancia de Socket.io exista
  if (io) {
    // Emite el evento notification a la sala privada del usuario
    io.to(`user_${userId}`).emit("notification", data);
  }
};
