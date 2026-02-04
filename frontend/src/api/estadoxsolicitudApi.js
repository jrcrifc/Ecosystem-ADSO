import apiAxios from './axiosConfig.js';

export const getAllEstadoXSolicitud = () => apiAxios.get('/estadoxsolicitud');

export const createEstadoXSolicitud = (data) => apiAxios.post('/estadoxsolicitud', data);

export const updateEstadoXSolicitud = (id, data) => apiAxios.put(`/estadoxsolicitud/${id}`, data);

export const deleteEstadoXSolicitud = (id) => apiAxios.delete(`/estadoxsolicitud/${id}`);