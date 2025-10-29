import React, { useState } from 'react';
import { User, Mail, Lock, Calendar, Check } from 'lucide-react';
import Card from '../components/Card';

export default function Perfil({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: user?.nombreCompleto || '',
    correoElectronico: user?.correoElectronico || '',
    contrasenaActual: '',
    contraseñaNueva: '',
    confirmarContrasena: '',
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    setMessage({
      type: 'success',
      text: 'Perfil actualizado correctamente',
    });
    setEditMode(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-2">
            <User className="text-indigo-600" />
            <span>Mi Perfil</span>
          </h1>
          <p className="text-gray-600 mt-2">Gestiona la información de tu cuenta</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-800'
                : 'bg-red-100 border border-red-400 text-red-800'
            }`}
          >
            <Check size={20} />
            <span>{message.text}</span>
          </div>
        )}

        {/* Información General */}
        <Card title="Información General" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Usuario</p>
                <p className="font-semibold text-gray-800 font-mono">{user?.idUsuario}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Usuario</p>
                <p className="font-semibold text-gray-800">{user?.usuario}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
              <p className="font-semibold text-gray-800">{user?.nombreCompleto}</p>
            </div>
          </div>
        </Card>

        {/* Editar Perfil */}
        <Card title={editMode ? 'Editar Perfil' : 'Detalles de Cuenta'} className="mb-6">
          {!editMode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail size={16} className="text-indigo-600" />
                  <p className="text-sm text-gray-600">Correo Electrónico</p>
                </div>
                <p className="font-semibold text-gray-800">{user?.correoElectronico || 'No registrado'}</p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Editar Información
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Cambiar Contraseña */}
        <Card title="Cambiar Contraseña">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Contraseña Actual</span>
                </div>
              </label>
              <input
                type="password"
                name="contrasenaActual"
                value={formData.contrasenaActual}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Nueva Contraseña</span>
                </div>
              </label>
              <input
                type="password"
                name="contraseñaNueva"
                value={formData.contraseñaNueva}
                onChange={handleChange}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

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
                placeholder="Repite tu nueva contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Cambiar Contraseña
            </button>
          </form>
        </Card>

        {/* Información Adicional */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Información Importante</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Tus datos son seguros y encriptados</li>
            <li>✓ Acceso mediante autenticación JWT</li>
            <li>✓ Tu sesión expirará por inactividad</li>
            <li>✓ Puedes cambiar tu contraseña en cualquier momento</li>
          </ul>
        </div>
      </div>
    </main>
  );
}