import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu API
export const menuAPI = {
  getAll: () => api.get('/api/menu'),
  getById: (id) => api.get(`/api/menu/${id}`),
  getByCategory: (category) => api.get(`/api/menu/category/${category}`),
  create: (data) => api.post('/api/menu', data),
  update: (id, data) => api.put(`/api/menu/${id}`, data),
  delete: (id) => api.delete(`/api/menu/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/api/orders', data),
  getAll: (status) => api.get('/api/orders', { params: { status } }),
  getById: (id) => api.get(`/api/orders/${id}`),
  getByCustomer: (phone) => api.get(`/api/orders/customer/${phone}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

// Reservations API
export const reservationsAPI = {
  create: (data) => api.post('/api/reservations', data),
  getAll: (filters) => api.get('/api/reservations', { params: filters }),
  getById: (id) => api.get(`/api/reservations/${id}`),
  getByCustomer: (phone) => api.get(`/api/reservations/customer/${phone}`),
  updateStatus: (id, status) => api.patch(`/api/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/reservations/${id}`),
};

export default api;
