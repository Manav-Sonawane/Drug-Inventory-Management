import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};

// ── Drugs ─────────────────────────────────────────────────────────────────────
export const drugsApi = {
  list: (params?: { search?: string; category?: string }) =>
    api.get('/drugs', { params }).then((r) => r.data),
  get: (id: string) => api.get(`/drugs/${id}`).then((r) => r.data),
  create: (body: any) => api.post('/drugs', body).then((r) => r.data),
  update: (id: string, body: any) => api.put(`/drugs/${id}`, body).then((r) => r.data),
};

// ── Warehouse ─────────────────────────────────────────────────────────────────
export const warehouseApi = {
  inventory: (params?: { warehouse_id?: string; status?: string; search?: string }) =>
    api.get('/warehouse/inventory', { params }).then((r) => r.data),
  expiryAlerts: () => api.get('/warehouse/expiry-alerts').then((r) => r.data),
  batchTraceability: (batchId: string) =>
    api.get(`/warehouse/batches/${batchId}/traceability`).then((r) => r.data),
  createGRN: (body: any) => api.post('/warehouse/grn', body).then((r) => r.data),
  stockAdjustment: (body: any) => api.put('/warehouse/stock-adjustment', body).then((r) => r.data),
};

// ── Procurement ───────────────────────────────────────────────────────────────
export const procurementApi = {
  list: (params?: { status?: string; vendor_id?: string }) =>
    api.get('/purchase-orders', { params }).then((r) => r.data),
  get: (id: string) => api.get(`/purchase-orders/${id}`).then((r) => r.data),
  create: (body: any) => api.post('/purchase-orders', body).then((r) => r.data),
  approve: (id: string) => api.put(`/purchase-orders/${id}/approve`).then((r) => r.data),
  reject: (id: string, reason: string) =>
    api.put(`/purchase-orders/${id}/reject`, { reason }).then((r) => r.data),
};

// ── Shipments ─────────────────────────────────────────────────────────────────
export const shipmentsApi = {
  list: (params?: { status?: string; hospital_id?: string }) =>
    api.get('/shipments', { params }).then((r) => r.data),
  get: (id: string) => api.get(`/shipments/${id}`).then((r) => r.data),
  create: (body: any) => api.post('/shipments', body).then((r) => r.data),
  tracking: (id: string) => api.get(`/shipments/${id}/tracking`).then((r) => r.data),
  pod: (id: string, body: { notes?: string; location?: string }) =>
    api.put(`/shipments/${id}/pod`, body).then((r) => r.data),
};

// ── Consumption ───────────────────────────────────────────────────────────────
export const consumptionApi = {
  log: (body: any) => api.post('/consumption/log', body).then((r) => r.data),
  byHospital: (hospitalId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/consumption/hospital/${hospitalId}`, { params }).then((r) => r.data),
  trends: (params?: { days?: number; hospital_id?: string }) =>
    api.get('/consumption/trends', { params }).then((r) => r.data),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard').then((r) => r.data),
  stockoutFrequency: () => api.get('/analytics/stockout-frequency').then((r) => r.data),
  vendorPerformance: () => api.get('/analytics/vendor-performance').then((r) => r.data),
  expiryWaste: () => api.get('/analytics/expiry-waste').then((r) => r.data),
  procurementEfficiency: () => api.get('/analytics/procurement-efficiency').then((r) => r.data),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  users: { list: (params?: any) => api.get('/admin/users', { params }).then((r) => r.data) },
  vendors: {
    list: () => api.get('/admin/vendors').then((r) => r.data),
    create: (body: any) => api.post('/admin/vendors', body).then((r) => r.data),
  },
  warehouses: {
    list: () => api.get('/admin/warehouses').then((r) => r.data),
    create: (body: any) => api.post('/admin/warehouses', body).then((r) => r.data),
  },
  hospitals: {
    list: () => api.get('/admin/hospitals').then((r) => r.data),
    create: (body: any) => api.post('/admin/hospitals', body).then((r) => r.data),
  },
};

// ── Audit ─────────────────────────────────────────────────────────────────────
export const auditApi = {
  list: (params?: { entity_type?: string; entity_id?: string; limit?: number; offset?: number }) =>
    api.get('/audit', { params }).then((r) => r.data),
};

export default api;
