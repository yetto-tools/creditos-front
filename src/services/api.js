import axios from 'axios';

// URL base del backend
const API_BASE_URL = 'https://localhost:44353/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (no autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================================================

export const authService = {
  login: (usuario, contrasena) =>
    api.post('/auth/login', { usuario, contrasena }),

  registro: (usuario, contrasena, confirmarContrasena, nombreCompleto, correoElectronico) =>
    api.post('/auth/registro', {
      usuario,
      contrasena,
      confirmarContrasena,
      nombreCompleto,
      correoElectronico,
    }),

  cambiarContrasena: (idUsuario, contrasenaActual, contrasenaNueva, confirmarContrasenaNueva) =>
    api.post(`/auth/cambiar-contrasena/${idUsuario}`, {
      contrasenaActual,
      contrasenaNueva,
      confirmarContrasenaNueva,
    }),
};

// ============================================================================
// SERVICIOS DE USUARIOS
// ============================================================================

export const usuarioService = {
  obtenerTodos: () =>
    api.get('/usuarios'),

  obtenerPorId: (id) =>
    api.get(`/usuarios/${id}`),

  actualizar: (id, usuario) =>
    api.put(`/usuarios/${id}`, usuario),
};

// ============================================================================
// SERVICIOS DE MONEDAS
// ============================================================================

export const monedaService = {
  obtenerTodas: () =>
    api.get('/monedas'),

  obtenerPorId: (id) =>
    api.get(`/monedas/${id}`),

  obtenerPorCodigo: (codigo) =>
    api.get(`/monedas/codigo/${codigo}`),
};

// ============================================================================
// SERVICIOS DE INVERSIONES
// ============================================================================

export const inversionService = {
  crear: (idUsuario, inversion) =>
    api.post(`/inversiones`, { ...inversion, idUsuario }),

  obtenerTodas: (idUsuario = null) =>
    api.get(`/inversiones${idUsuario ? `?idUsuario=${idUsuario}` : ''}`),

  obtenerPorId: (id) =>
    api.get(`/inversiones/${id}`),

  obtenerActivas: (idUsuario = null) =>
    api.get(`/inversiones/activas${idUsuario ? `?idUsuario=${idUsuario}` : ''}`),

  cancelar: (id) =>
    api.put(`/inversiones/${id}/cancelar`, {}),

  obtenerPagos: (idInversion) =>
    api.get(`/inversiones/${idInversion}/pagos`),
};

// ============================================================================
// SERVICIOS DE PRÉSTAMOS
// ============================================================================

export const prestamoService = {
  crear: (idUsuario, prestamo) =>
    api.post(`/prestamos`, { ...prestamo, idUsuario }),

  obtenerTodos: (idUsuario = null) =>
    api.get(`/prestamos${idUsuario ? `?idUsuario=${idUsuario}` : ''}`),

  obtenerPorId: (id) =>
    api.get(`/prestamos/${id}`),

  obtenerActivos: (idUsuario = null) =>
    api.get(`/prestamos/activos${idUsuario ? `?idUsuario=${idUsuario}` : ''}`),

  cancelar: (id) =>
    api.put(`/prestamos/${id}/cancelar`, {}),

  obtenerPagos: (idPrestamo) =>
    api.get(`/prestamos/${idPrestamo}/pagos`),
};

// ============================================================================
// SERVICIOS DE SALDO
// ============================================================================

export const saldoService = {
  obtenerSaldoActual: (idMoneda) =>
    api.get(`/saldo/actual/${idMoneda}`),

  obtenerSaldoConsolidado: () =>
    api.get('/saldo/consolidado'),

  obtenerHistoricoMoneda: (idMoneda, dias = 30) =>
    api.get(`/saldo/historico/${idMoneda}?dias=${dias}`),
};

export default api;