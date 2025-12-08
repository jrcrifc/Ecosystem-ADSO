import api from '../api/axiosConfig';
export default {
  getAll: () => api.get('/solicitudes'),
  create: (p) => api.post('/solicitudes', p),
  getWithHist: (id) => api.get(`/solicitudes/${id}`)
};
