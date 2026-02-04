import apiAxios from './axiosConfig.js';

export const getAllEstadoSolicitud = () => apiAxios.get('/estado-solicitud');

export const createEstadoSolicitud = (data) => apiAxios.post('/estado-solicitud', data);

export const updateEstadoSolicitud = (id, data) => apiAxios.put(`/estado-solicitud/${id}`, data);

export const deleteEstadoSolicitud = (id) => apiAxios.delete(`/estado-solicitud/${id}`);