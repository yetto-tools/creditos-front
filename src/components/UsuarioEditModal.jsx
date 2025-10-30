import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loader } from 'lucide-react';

const UsuarioEditModal = ({ isOpen, onClose, usuario, onSave }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombreCompleto: '',
    correoElectronico: '',
    estado: 'ACTIVO',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        usuario: usuario.usuario || '',
        nombreCompleto: usuario.nombreCompleto || '',
        correoElectronico: usuario.correoElectronico || '',
        estado: usuario.estado || 'ACTIVO',
        contrasena: '',
        confirmarContrasena: '',
      });
      setError(null);
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar contraseñas si se están cambiando
    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para enviar (sin contraseña si está vacía)
      const dataToSend = {
        usuario: formData.usuario,
        nombreCompleto: formData.nombreCompleto,
        correoElectronico: formData.correoElectronico,
        estado: formData.estado,
      };

      // Solo incluir contraseña si se ingresó una nueva
      if (formData.contrasena) {
        dataToSend.contrasena = formData.contrasena;
        dataToSend.confirmarContrasena = formData.confirmarContrasena;
      }

      await onSave(usuario.idUsuario, dataToSend);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario" size="lg">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                placeholder="correo@ejemplo.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-600 mb-3">
              Cambiar contraseña (opcional - dejar en blanco para mantener la actual)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UsuarioEditModal;
