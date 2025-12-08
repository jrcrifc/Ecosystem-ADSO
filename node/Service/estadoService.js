import api from '../api/axiosConfig';
export default {
  getAll: () => api.get('/estado-solicitud'),
  create: (payload) => api.post('/estado-solicitud', payload)
};
