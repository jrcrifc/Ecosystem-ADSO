// Importa Axios para realizar peticiones HTTP al backend
import axios from "axios";

// Crea una instancia personalizada de Axios con la URL base del servidor
const apiAxios = axios.create({
  // Toma la URL desde las variables de entorno de Vite, con fallback a localhost:8000
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  // Define el tipo de contenido JSON para todas las peticiones
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepta cada petición saliente para adjuntar el token JWT de autenticación
apiAxios.interceptors.request.use(
  (config) => {
    // Lee el token almacenado en sessionStorage tras el login
    const token = sessionStorage.getItem("token");
    // Si existe token, lo agrega al encabezado Authorization con formato Bearer
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Devuelve la configuración modificada para continuar la petición
    return config;
  },
  (error) => {
    // Rechaza la promesa si ocurre un error en la preparación de la petición
    return Promise.reject(error);
  }
);

// Exporta la instancia configurada para usarla en toda la aplicación
export default apiAxios;