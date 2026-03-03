import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Normalizar sin barra final para evitar URLs con doble //
const baseURL = API_URL.replace(/\/+$/g, '');

const apiAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir token automáticamente si existe
apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiAxios;
