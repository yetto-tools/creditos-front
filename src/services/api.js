import axios from 'axios';

// URL base del backend

const API_BASE_URL =  'https://localhost:44353/api';

// Headers por defecto
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Función helper para peticiones
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      ...options,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================
const authAPI = {
  login: (usuario, contrasena) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, contrasena }),
    }),

  register: (usuario, contrasena, confirmarContrasena, nombreCompleto, correoElectronico) =>
    apiCall('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({
        usuario,
        contrasena,
        confirmarContrasena,
        nombreCompleto,
        correoElectronico,
      }),
    }),
};

// ============================================================================
// USUARIOS ENDPOINTS
// ============================================================================
const usuariosAPI = {
  getAll: () => apiCall('/usuarios'),
  getById: (id) => apiCall(`/usuarios/${id}`),
  create: (data) =>
    apiCall('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// INVERSIONES ENDPOINTS
// ============================================================================
const inversionesAPI = {
  getAll: () => apiCall('/inversiones'),
  getById: (id) => apiCall(`/inversiones/${id}`),
  getByUsuario: (idUsuario) => apiCall(`/inversiones/usuario/${idUsuario}`),
  create: (data) =>
    apiCall('/inversiones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/inversiones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/inversiones/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// PRESTAMOS ENDPOINTS
// ============================================================================
const prestamosAPI = {
  getAll: () => apiCall('/prestamos'),
  getById: (id) => apiCall(`/prestamos/${id}`),
  getByUsuario: (idUsuario) => apiCall(`/prestamos/usuario/${idUsuario}`),
  create: (data) =>
    apiCall('/prestamos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/prestamos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/prestamos/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// MONEDAS ENDPOINTS
// ============================================================================
const monedasAPI = {
  getAll: () => apiCall('/monedas'),
  getById: (id) => apiCall(`/monedas/${id}`),
};

// ============================================================================
// SALDO ENDPOINTS
// ============================================================================
const saldoAPI = {
  getByUsuario: (idUsuario) => apiCall(`/saldo/usuario/${idUsuario}`),
};

// ============================================================================
// EXPORTAR TODOS LOS APIS
// ============================================================================
export { authAPI, usuariosAPI, inversionesAPI, prestamosAPI, monedasAPI, saldoAPI };