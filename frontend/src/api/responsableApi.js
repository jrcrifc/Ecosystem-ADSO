import apiAxios from './axiosConfig.js';

export const getAllResponsables = () => apiAxios.get('/responsables');

export const createResponsable = (data) => apiAxios.post('/responsables', data);

export const updateResponsable = (id, data) => apiAxios.put(`/responsables/${id}`, data);

export const deleteResponsable = (id) => apiAxios.delete(`/responsables/${id}`);