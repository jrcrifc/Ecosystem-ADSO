import axios from 'axios';

const apiAxios = axios.create({
    baseURL: 'http://localhost:8000', // Ajusta a la URL de tu servidor
});

// Interceptor para añadir el token JWT a todas las peticiones salientes
apiAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar expiración o invalidación de JWT
apiAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/UserLogin';
        }
        return Promise.reject(error);
    }
);

export default apiAxios;