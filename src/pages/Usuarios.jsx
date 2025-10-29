import React, { useState, useEffect } from 'react';
import { Users, Eye, Loader } from 'lucide-react';
import Card from '../components/Card';
import { usuariosAPI } from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-2">
            <Users className="text-indigo-600" />
            <span>Usuarios del Sistema</span>
          </h1>
          <p className="text-gray-600 mt-2">Visualiza todos los usuarios registrados</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
            {error}
          </div>
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
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold">
                        <Eye size={18} />
                        <span>Ver</span>
                      </button>
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
              <p className="text-4xl font-bold text-indigo-600 mb-2">{usuarios.length}</p>
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
      </div>
    </main>
  );
}