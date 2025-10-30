import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validación básica
    if (!formData.usuario.trim()) {
      setError('Por favor ingresa tu usuario');
      return;
    }
    if (!formData.contrasena.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Intentando login con:', formData.usuario);

      // 🔹 Llamada al backend
      const response = await authAPI.login(formData.usuario, formData.contrasena);
      console.log('Respuesta del login:', response);

      // 🔹 Validar estructura
      if (!response?.exitoso || !response.datos?.token) {
        throw new Error('Respuesta inválida del servidor');
      }

      // 🔹 Extraer datos del backend
      const { idUsuario, usuario, nombreCompleto, token } = response.datos;

      if (!idUsuario || !usuario) {
        throw new Error('Datos de usuario incompletos en la respuesta');
      }

      // 🔹 Guardar datos en localStorage (a través de App.jsx -> onLogin)
      onLogin(token, { idUsuario, usuario, nombreCompleto });

      // 🔹 Limpiar formulario
      setFormData({
        usuario: '',
        contrasena: '',
      });

      // 🔹 Redirigir después de un pequeño delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 300);

    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      setFormData((prev) => ({
        ...prev,
        contrasena: '',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Banco API</h1>
          <p className="text-gray-600 mt-2">Sistema de Operaciones Financieras Bancarias</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Usuario</span>
                </div>
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Contraseña</span>
                </div>
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-teal-600 font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">Credenciales de Prueba:</p>
            <p className="text-sm text-blue-800">Usuario: <span className="font-mono">admin</span></p>
            <p className="text-sm text-blue-800">Contraseña: <span className="font-mono">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
