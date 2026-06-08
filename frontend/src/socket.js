// Importa la función io de socket.io-client para crear la conexión WebSocket
import { io } from "socket.io-client";

// Obtiene la URL del backend desde las variables de entorno de Vite
const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Crea la instancia del socket con configuración de transporte y reconexión
const socket = io(socketUrl, {
  // Define polling como transporte primario y websocket como secundario
  transports: ["polling", "websocket"],
  // Limita a 5 intentos de reconexión automática
  reconnectionAttempts: 5
});

// Exporta la instancia del socket para usarla en otros componentes
export default socket;
