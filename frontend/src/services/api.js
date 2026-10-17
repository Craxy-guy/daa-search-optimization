import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';
const api = axios.create({ baseURL: API_BASE });

export const datasetAPI = {
  generate: (params) => api.post('/dataset/generate', params),
  upload: (formData) => api.post('/dataset/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const searchAPI = {
  linear: (data) => api.post('/search/linear', data),
  binary: (data) => api.post('/search/binary', data),
};

export const sortAPI = {
  merge: (data) => api.post('/sort/merge', data),
};

export const optimizeAPI = {
  analyze: (data) => api.post('/optimize', data),
};

export const benchmarkAPI = {
  run: (data) => api.post('/benchmark', data),
};

export const historyAPI = {
  getAll: () => api.get('/history'),
  clear: () => api.delete('/history'),
  exportCSV: () => api.get('/history/export', { responseType: 'blob' }),
};

export const complexityAPI = {
  getAll: () => api.get('/complexity'),
};

export default api;
