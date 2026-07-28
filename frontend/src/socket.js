// Importa la función io de socket.io-client para crear la conexión WebSocket
import { io } from "socket.io-client";

// En desarrollo: conecta a localhost:5173 (Vite hace proxy /api -> localhost:8000)
// En producción: conecta al mismo origen del servidor
const socket = io(window.location.origin, {
  path: "/api/socket.io",
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});

// Exporta la instancia del socket para usarla en otros componentes
export default socket;
