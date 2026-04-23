import api from './axiosInstance';

// Auth
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
};

// Products
export const productsAPI = {
  getAll:  (params) => api.get('/products', { params }),
  getOne:  (id)     => api.get(`/products/${id}`),
  create:  (data)   => api.post('/products', data),
  update:  (id, data) => api.put(`/products/${id}`, data),
  delete:  (id)     => api.delete(`/products/${id}`),
};

// Customers
export const customersAPI = {
  getAll:  (params) => api.get('/customers', { params }),
  getOne:  (id)     => api.get(`/customers/${id}`),
  create:  (data)   => api.post('/customers', data),
  update:  (id, data) => api.put(`/customers/${id}`, data),
  delete:  (id)     => api.delete(`/customers/${id}`),
};

// Suppliers
export const suppliersAPI = {
  getAll:  (params) => api.get('/suppliers', { params }),
  getOne:  (id)     => api.get(`/suppliers/${id}`),
  create:  (data)   => api.post('/suppliers', data),
  update:  (id, data) => api.put(`/suppliers/${id}`, data),
  delete:  (id)     => api.delete(`/suppliers/${id}`),
};

// Sales Orders
export const salesOrdersAPI = {
  getAll:       (params)   => api.get('/sales-orders', { params }),
  getOne:       (id)       => api.get(`/sales-orders/${id}`),
  create:       (data)     => api.post('/sales-orders', data),
  update:       (id, data) => api.put(`/sales-orders/${id}`, data),
  updateStatus: (id, status) => api.patch(`/sales-orders/${id}/status`, { status }),
};

// Purchase Orders
export const purchaseOrdersAPI = {
  getAll:  (params)   => api.get('/purchase-orders', { params }),
  getOne:  (id)       => api.get(`/purchase-orders/${id}`),
  create:  (data)     => api.post('/purchase-orders', data),
  update:  (id, data) => api.put(`/purchase-orders/${id}`, data),
};

// GRN
export const grnAPI = {
  getAll:  (params) => api.get('/grn', { params }),
  getOne:  (id)     => api.get(`/grn/${id}`),
  create:  (data)   => api.post('/grn', data),
};

// Invoices
export const invoicesAPI = {
  getAll:   (params)   => api.get('/invoices', { params }),
  getOne:   (id)       => api.get(`/invoices/${id}`),
  create:   (data)     => api.post('/invoices', data),
  update:   (id, data) => api.put(`/invoices/${id}`, data),
  markPaid: (id)       => api.patch(`/invoices/${id}/mark-paid`),
};

// Users
export const usersAPI = {
  getAll:  (params)   => api.get('/users', { params }),
  getOne:  (id)       => api.get(`/users/${id}`),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id)       => api.delete(`/users/${id}`),
  stats:   ()         => api.get('/users/stats'),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Reports
export const reportsAPI = {
  sales:     (params) => api.get('/reports/sales',     { params }),
  inventory: (params) => api.get('/reports/inventory', { params }),
  finance:   (params) => api.get('/reports/finance',   { params }),
};
