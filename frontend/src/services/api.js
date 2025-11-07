import axios from 'axios';
import { addPendingAction } from '../utils/offlineStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!navigator.onLine && error.config) {
      await addPendingAction({
        method: error.config.method,
        url: error.config.url,
        data: error.config.data
      });
      return Promise.reject({ offline: true, message: 'Action saved for later sync' });
    }
    return Promise.reject(error);
  }
);

export const taskAPI = {
  create: (data) => api.post('/tasks', data),
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  toggleComplete: (id) => api.patch(`/tasks/${id}/complete`),
  bulkComplete: (taskIds) => api.post('/tasks/bulk-complete', { taskIds }),
  bulkDelete: (taskIds) => api.delete('/tasks/bulk-delete', { data: { taskIds } }),
  undo: (id) => api.post(`/tasks/${id}/undo`),
  getHistory: (id) => api.get(`/tasks/${id}/history`),
  uploadAttachments: (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  shareTask: (id, userIds) => api.post(`/tasks/${id}/share`, { userIds })
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

export const userAPI = {
  search: (query) => api.get('/users/search', { params: { q: query } })
};

export default api;
