import React, { useState, useEffect } from 'react';
import { Users, Eye, Loader, Plus, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { usuariosAPI } from '../services/api';
import UsuarioDetailModal from '../components/UsuarioDetailModal';
import UsuarioEditModal from '../components/UsuarioEditModal';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    nombreCompleto: '',
    correoElectronico: '',
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosAPI.getAll().catch(() => []);
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (usuario) => {
    setSelectedUsuario(usuario);
    setShowDetailModal(true);
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id, data) => {
    try {
      await usuariosAPI.update(id, data);
      await fetchUsuarios();
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await usuariosAPI.delete(id);
        fetchUsuarios();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await usuariosAPI.create(formData);
      setFormData({
        usuario: '',
        contrasena: '',
        confirmarContrasena: '',
        nombreCompleto: '',
        correoElectronico: '',
      });
      setShowForm(false);
      fetchUsuarios();
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader size={32} className="animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-teal-100 rounded-lg p-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-2">
              <Users className="text-teal-600" />
              <span>Usuarios del Sistema</span>
            </h1>
            <p className="text-gray-600 mt-2">Gestiona todos los usuarios registrados</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Formulario Nuevo Usuario */}
        {showForm && (
          <Card title="Nuevo Usuario" className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
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

                <div></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Crear Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Tabla de Usuarios */}
        {usuarios.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No hay usuarios registrados</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Correo Electrónico
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.idUsuario}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-gray-800">
                        {usuario.usuario}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{usuario.nombreCompleto}</td>
                    <td className="px-6 py-4 text-gray-600">{usuario.correoElectronico}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.estado === 'ACTIVO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.idUsuario)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-600 mb-2">{usuarios.length}</p>
              <p className="text-gray-600">Total de Usuarios</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">
                {usuarios.filter((u) => u.estado === 'ACTIVO').length}
              </p>
              <p className="text-gray-600">Usuarios Activos</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600 mb-2">
                {usuarios.filter((u) => u.estado !== 'ACTIVO').length}
              </p>
              <p className="text-gray-600">Usuarios Inactivos</p>
            </div>
          </Card>
        </div>

        {/* Modales */}
        <UsuarioDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          usuario={selectedUsuario}
        />

        <UsuarioEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          usuario={selectedUsuario}
          onSave={handleSaveEdit}
        />
      </div>
    </main>
  );
}