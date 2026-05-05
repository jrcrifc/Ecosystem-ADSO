import { io } from "socket.io-client";

// Detectar URL automáticamente o usar localhost
const host = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
const socketUrl = `http://${host}:8000`;

const socket = io(socketUrl, {
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5
});

export default socket;
