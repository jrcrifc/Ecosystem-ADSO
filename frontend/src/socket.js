// Importa la función io de socket.io-client para crear la conexión WebSocket
import { io } from "socket.io-client";

const isProduction = import.meta.env.PROD;
const socketUrl = isProduction ? window.location.origin : (import.meta.env.VITE_API_URL || "http://localhost:8000");

const socketOptions = {
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5
};

if (isProduction) {
  socketOptions.path = "/api/socket.io";
}

const socket = io(socketUrl, socketOptions);

// Exporta la instancia del socket para usarla en otros componentes
export default socket;
