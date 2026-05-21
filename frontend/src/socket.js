import { io } from "socket.io-client";

// Usar la URL del backend desde las variables de entorno
const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const socket = io(socketUrl, {
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5
});

export default socket;
