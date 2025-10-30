import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [registroData, setRegistroData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    nombreCompleto: '',
    correoElectronico: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(usuario, contrasena);
      const { token, idUsuario, nombreCompleto } = response.data;

      // Guardar token y datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify({
        idUsuario,
        nombreCompleto,
        nombre: usuario,
      }));

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.registro(
        registroData.usuario,
        registroData.contrasena,
        registroData.confirmarContrasena,
        registroData.nombreCompleto,
        registroData.correoElectronico
      );

      // Mostrar mensaje de éxito y volver a login
      setShowRegistro(false);
      setRegistroData({
        usuario: '',
        contrasena: '',
        confirmarContrasena: '',
        nombreCompleto: '',
        correoElectronico: '',
      });
      setError('');
      alert('Registro exitoso. Por favor, inicia sesión.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setRegistroData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Banco API
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sistema de Operaciones Financieras Bancarias
        </p>

        {!showRegistro ? (
          // Formulario de Login
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setShowRegistro(true)}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-2">
                Credenciales de prueba:
              </p>
              <p className="text-xs text-gray-500 text-center">
                Usuario: admin  
              </p>
              <p className="text-xs text-gray-500 text-center">
                Contraseña: 123456
              </p>
            </div>
          </>
        ) : (
          // Formulario de Registro
          <>
            <form onSubmit={handleRegistro} className="space-y-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Usuario
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={registroData.usuario}
                  onChange={handleRegistroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Elige un usuario"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={registroData.nombreCompleto}
                  onChange={handleRegistroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre completo"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={registroData.correoElectronico}
                  onChange={handleRegistroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={registroData.contrasena}
                  onChange={handleRegistroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contraseña"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={registroData.confirmarContrasena}
                  onChange={handleRegistroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirmar contraseña"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm disabled:bg-gray-400"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowRegistro(false)}
                className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
              >
                Volver a login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}