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


const handleUnauthorized = () => {
  // Limpiar sesión, pero sin refrescar la SPA
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Guardar una marca para que el frontend sepa que hay que redirigir
  sessionStorage.setItem('redirectAfter401', 'true');
};


// Función helper para peticiones
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      ...options,
    });

    // Si el token expiró o no es válido
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('No autorizado o sesión expirada');
    }

    // Intentar parsear JSON, aunque venga vacío
    const data = await response.json().catch(() => ({}));

    // Validar estructura esperada
    if (typeof data !== 'object' || data === null) {
      throw new Error('Respuesta inválida del servidor');
    }

    // Si el backend devuelve un campo `exitoso: false`
    if (data.exitoso === false || !response.ok) {
      throw new Error(data.mensaje || 'Error en la petición');
    }

    // Si todo va bien, retornar estructura limpia
    return {
      exitoso: data.exitoso ?? true,
      mensaje: data.mensaje || 'Operación exitosa',
      datos: data.datos ?? null,
      codigo: data.codigo ?? response.status,
    };

  } catch (error) {
    console.error('API Error:', error);
    throw error; // deja que el componente maneje el mensaje
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