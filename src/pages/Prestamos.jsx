import React, { useState, useEffect } from 'react';
import { Banknote, Plus, Trash2, Edit2, Eye, Loader } from 'lucide-react';
import Card from '../components/Card';
import { prestamosAPI, monedasAPI } from '../services/api';

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    idMoneda: '',
    entidadFinanciera: '',
    capitalPrestado: '',
    tasaInteres: '',
    plazoDias: '',
    modalidadPago: 'MENSUAL',
    observaciones: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pres, mon] = await Promise.all([
        prestamosAPI.getAll().catch(() => []),
        monedasAPI.getAll().catch(() => []),
      ]);
      setPrestamos(Array.isArray(pres) ? pres : []);
      setMonedas(Array.isArray(mon) ? mon : []);
    } catch (err) {
      setError('Error al cargar préstamos');
    } finally {
      setLoading(false);
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
    try {
      await prestamosAPI.create(formData);
      setFormData({
        idMoneda: '',
        entidadFinanciera: '',
        capitalPrestado: '',
        tasaInteres: '',
        plazoDias: '',
        modalidadPago: 'MENSUAL',
        observaciones: '',
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Error al crear préstamo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      try {
        await prestamosAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Error al eliminar préstamo');
      }
    }
  };

  const getMonedaNombre = (idMoneda) => {
    const moneda = monedas.find((m) => m.idMoneda === idMoneda);
    return moneda ? moneda.nombreMoneda : 'Desconocida';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando préstamos...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-2">
              <Banknote className="text-red-600" />
              <span>Préstamos</span>
            </h1>
            <p className="text-gray-600 mt-2">Controla tus préstamos y pagos programados</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Préstamo</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Formulario Nuevo Préstamo */}
        {showForm && (
          <Card title="Nuevo Préstamo" className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                  <select
                    name="idMoneda"
                    value={formData.idMoneda}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="">Selecciona una moneda</option>
                    {monedas.map((m) => (
                      <option key={m.idMoneda} value={m.idMoneda}>
                        {m.nombreMoneda}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entidad Financiera
                  </label>
                  <input
                    type="text"
                    name="entidadFinanciera"
                    value={formData.entidadFinanciera}
                    onChange={handleChange}
                    placeholder="Nombre del banco/entidad"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Prestado
                  </label>
                  <input
                    type="number"
                    name="capitalPrestado"
                    value={formData.capitalPrestado}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Interés (%)
                  </label>
                  <input
                    type="number"
                    name="tasaInteres"
                    value={formData.tasaInteres}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plazo (Días)</label>
                  <input
                    type="number"
                    name="plazoDias"
                    value={formData.plazoDias}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidad de Pago
                  </label>
                  <select
                    name="modalidadPago"
                    value={formData.modalidadPago}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="MENSUAL">Mensual</option>
                    <option value="FINAL">Final</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Notas adicionales (opcional)"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Crear Préstamo
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

        {/* Lista de Préstamos */}
        <div className="grid grid-cols-1 gap-6">
          {prestamos.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Banknote size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">No hay préstamos registrados</p>
                <p className="text-gray-500 text-sm mt-1">
                  Crea un nuevo préstamo para comenzar
                </p>
              </div>
            </Card>
          ) : (
            prestamos.map((pres) => (
              <Card key={pres.idPrestamo} className="hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Banknote size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {pres.entidadFinanciera}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Capital: Q{pres.capitalPrestado?.toLocaleString('es-GT')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Tasa Interés</p>
                        <p className="font-semibold text-gray-800">{pres.tasaInteres}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Plazo</p>
                        <p className="font-semibold text-gray-800">{pres.plazoDias} días</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total a Pagar</p>
                        <p className="font-semibold text-red-600">
                          Q{pres.montoTotalARecibir?.toLocaleString('es-GT')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Estado</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            pres.estado === 'VIGENTE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {pres.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(pres.idPrestamo)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}