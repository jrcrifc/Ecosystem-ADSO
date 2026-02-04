import apiAxios from './axiosConfig.js';

export const getAllSolicitudes = () => apiAxios.get('/solicitudes');

export const createSolicitud = (data) => apiAxios.post('/solicitudes', data);

export const updateSolicitud = (id, data) => apiAxios.put(`/solicitudes/${id}`, data);

export const deleteSolicitud = (id) => apiAxios.delete(`/solicitudes/${id}`);