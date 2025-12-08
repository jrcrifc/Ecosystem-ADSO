import api from '../api/axiosConfig';
export default {
  getAll: () => api.get('/equipos'),
  create: (p) => api.post('/equipos', p)
};
