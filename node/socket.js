import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // En producción, limita esto
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Usuario conectado:", socket.id);

    // Unirse a una sala específica por ID de usuario para enviar notificaciones privadas
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Usuario ${userId} se unió a su sala privada`);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Usuario desconectado");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
};

/**
 * Envía una notificación en tiempo real a un usuario específico
 */
export const sendNotification = (userId, data) => {
  if (io) {
    io.to(`user_${userId}`).emit("notification", data);
  }
};
