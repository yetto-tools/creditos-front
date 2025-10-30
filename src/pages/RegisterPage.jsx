import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../services/api';

export default function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    nombreCompleto: '',
    correoElectronico: '',
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

  const validateForm = () => {
    if (!formData.usuario.trim()) {
      setError('El usuario es requerido');
      return false;
    }
    if (formData.usuario.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return false;
    }
    if (!formData.contrasena) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (!formData.nombreCompleto.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }
    if (!formData.correoElectronico.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correoElectronico)) {
      setError('El correo electrónico no es válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.usuario,
        formData.contrasena,
        formData.confirmarContrasena,
        formData.nombreCompleto,
        formData.correoElectronico
      );

      onRegister(response.datos.token, {
        idUsuario: response.idUsuario,
        usuario: response.usuario,
        nombreCompleto: response.nombreCompleto,
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse. Intenta nuevamente.');
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
          <p className="text-gray-600 mt-2">Crear Nueva Cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrarse</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Usuario</span>
                </div>
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Ej: usuario123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Nombre Completo</span>
                </div>
              </label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez García"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Correo Electrónico</span>
                </div>
              </label>
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
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
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Confirmar Contraseña</span>
                </div>
              </label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
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
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}